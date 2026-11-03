// Тренировка: 5 режимов (сборка, диктант, 2 сопоставления, микс) + результаты
window.WM = window.WM || {};

WM.games = (() => {
  const $ = sel => document.querySelector(sel);
  const esc = s => WM.esc(String(s ?? ''));

  const MODES = [
    { id: 'assemble',    name: 'Собери слово',        desc: 'составьте слово из букв по переводу' },
    { id: 'dictation',   name: 'Диктант',             desc: 'прослушайте слово и напишите его' },
    { id: 'match-word',  name: 'Слово ↔ перевод',     desc: 'соедините пары «слово — перевод»' },
    { id: 'match-image', name: 'Картинка ↔ перевод',  desc: 'соедините пары «картинка — перевод»' },
    { id: 'mix',         name: 'Микс',                desc: 'каждое слово проходит все режимы по порядку' },
  ];

  let session = null;
  let lastConfig = null;
  let presetPool = null; // тренировка из группы: {words, lang, label}

  // «Микс»: каждое слово проходит все режимы строго по порядку —
  // картинка↔перевод → слово↔перевод → собери слово → диктант.
  // Фазы идут подряд, поэтому сопоставления собираются в полноценные
  // сетки из нескольких пар, а для одного слова порядок ровно такой
  const MIX_ORDER = ['match-image', 'match-word', 'assemble', 'dictation'];

  function dealTasks(words, mode) {
    if (mode !== 'mix') return words.map(w => ({ word: w, sub: mode }));
    return MIX_ORDER.flatMap(sub => words.map(w => ({ word: w, sub })));
  }

  const norm = s => String(s).toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

  // у наборов форм («be — was/were — been», «essere — sono, sei…») игра тренирует
  // инфинитив: собирать/писать всю строку форм невозможно и бессмысленно
  const headForm = word => (word.word || '').split(' — ')[0].trim() || (word.word || '');

  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- настройка ----------

  function openSetup(presetWords = null, presetLang = null, label = '') {
    presetPool = presetWords ? { words: presetWords, lang: presetLang, label } : null;
    const lang = WM.app.state.lang;

    $('#train-modes').innerHTML = MODES.map((m, i) => `
      <label class="mode-item${i === 0 ? ' selected' : ''}">
        <input type="radio" name="train-mode" value="${m.id}" ${i === 0 ? 'checked' : ''}>
        <span class="m-text"><span class="m-name">${m.name}</span><span class="m-desc">${m.desc}</span></span>
      </label>`).join('');
    $('#train-modes').querySelectorAll('.mode-item').forEach(item => {
      item.addEventListener('click', () => {
        $('#train-modes').querySelectorAll('.mode-item').forEach(x => x.classList.remove('selected'));
        item.classList.add('selected');
        item.querySelector('input').checked = true;
      });
    });

    // при тренировке из группы тег не нужен — пул уже зафиксирован
    $('#train-tag').closest('.field').style.display = presetPool ? 'none' : '';

    if (!presetPool) {
      const tags = WM.words.allTags();
      $('#train-tag').innerHTML = '<option value="">Все слова</option>' +
        tags.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
    }
    updateAvailability();
    $('#modal-train').showModal();
  }

  function updateAvailability() {
    if (presetPool) {
      $('#train-available').textContent = `Набор «${presetPool.label}» · слов: ${presetPool.words.length}`;
      return;
    }
    const n = poolWords(WM.app.state.lang, $('#train-tag').value).length;
    $('#train-available').textContent =
      n === 0 ? 'Нет слов для тренировки — сначала добавьте слова на этой вкладке.' : '';
  }

  function poolWords(lang, tag) {
    return WM.storage.getWords(WM.app.state.uid)
      .filter(w => w.lang === lang && (!tag || w.tags.includes(tag)));
  }

  function start() {
    const mode = document.querySelector('input[name="train-mode"]:checked').value;
    const raw = $('#train-count').value;
    const count = raw === 'all' ? null : parseInt(raw, 10);

    let available, lang;
    if (presetPool) {
      available = presetPool.words;
      lang = presetPool.lang;
    } else {
      lang = WM.app.state.lang;
      available = poolWords(lang, $('#train-tag').value);
    }
    if (!available.length) { WM.app.toast('Нет слов для тренировки — добавьте слова', true); return; }

    lastConfig = { mode, count, preset: presetPool };
    $('#modal-train').close();
    beginSession(mode, count, available, lang);
  }

  function beginSession(mode, count, available, lang) {
    const words = count ? shuffle(available).slice(0, count) : shuffle(available);
    const tasks = dealTasks(words, mode);
    session = {
      mode, lang, total: tasks.length, tasks,
      i: 0, done: 0, correct: 0, mistakes: new Map(), timers: [],
    };
    WM.app.showView('game');
    renderTask();
  }

  // ---------- служебное ----------

  function updateProgress() {
    const pct = session.total ? Math.round((session.done / session.total) * 100) : 0;
    $('#game-progress').style.width = pct + '%';
    $('#game-counter').textContent = `${session.done} / ${session.total}`;
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    session.timers.push(id);
  }

  function area() { return $('#game-area'); }

  function recordAnswer(word, ok) {
    session.done++;
    if (ok) session.correct++;
    else if (word) session.mistakes.set(word.id, word);
    updateProgress();
  }

  function feedback(text, ok) {
    const f = $('#game-feedback') || area().querySelector('.game-feedback');
    if (!f) return;
    f.textContent = text;
    f.className = 'game-feedback ' + (ok ? 'ok' : 'err');
  }

  function next(delay = 900) {
    session.i++;
    later(() => renderTask(), delay);
  }

  // ---------- отрисовка задания ----------

  function renderTask() {
    if (session.i >= session.tasks.length) return finish();
    updateProgress();

    const t = session.tasks[session.i];

    if (t.sub === 'assemble')       renderAssemble(t);
    else if (t.sub === 'dictation') renderDictation(t);
    else if (t.sub === 'match-word' || t.sub === 'match-image') renderMatch(t);

    // контейнер фидбека — после отрисовки, чтобы не затирался innerHTML
    if (!area().querySelector('#game-feedback')) {
      const fb = document.createElement('div');
      fb.className = 'game-feedback';
      fb.id = 'game-feedback';
      area().appendChild(fb);
    }
  }

  // 1. Собери слово
  function renderAssemble(t) {
    const { word } = t;
    const target = headForm(word); // инфинитив для наборов форм
    let letters = shuffle(target.split(''));
    if (target.length > 1 && letters.join('') === target) letters = shuffle(letters);

    area().innerHTML = `
      <div class="game-card">
        <div class="hint">Соберите слово по переводу</div>
        <div class="game-word">${esc(word.translation)}</div>
        <div class="letters-slots" id="as-slots"></div>
        <div class="letters-pool" id="as-pool"></div>
        <div class="game-actions">
          <button class="btn btn-ghost" id="as-clear">Очистить</button>
          <button class="btn btn-primary" id="as-check" disabled>Проверить</button>
        </div>
      </div>`;

    const slots = [], poolState = letters.map((ch, idx) => ({ ch, idx, used: false }));
    let placed = []; // {slotEl, tileIdx}

    const slotsEl = $('#as-slots'), poolEl = $('#as-pool');
    target.split('').forEach(() => {
      const s = document.createElement('div');
      s.className = 'letter-slot';
      s.addEventListener('click', () => {
        const pos = placed.indexOf(s);
        if (pos === -1) return;
        const item = s._item;
        s.textContent = ''; s.classList.remove('filled', 'cur'); s._item = null;
        placed.splice(pos, 1);
        poolState[item.tileIdx].used = false;
        drawPool();
        updateCur();
      });
      slots.push(s);
      slotsEl.appendChild(s);
    });

    function drawPool() {
      poolEl.innerHTML = '';
      poolState.forEach((item, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'letter-tile';
        b.textContent = item.ch;
        b.disabled = item.used;
        b.addEventListener('click', () => {
          const slot = slots.find(s => !s._item);
          if (!slot) return;
          item.used = true;
          slot.textContent = item.ch;
          slot.classList.add('filled');
          slot._item = { tileIdx: idx };
          placed.push(slot);
          drawPool();
          updateCur();
        });
        poolEl.appendChild(b);
      });
      const full = slots.every(s => s._item);
      $('#as-check').disabled = !full;
    }

    function updateCur() {
      slots.forEach(s => s.classList.remove('cur'));
      const firstEmpty = slots.find(s => !s._item);
      if (firstEmpty) firstEmpty.classList.add('cur');
    }

    $('#as-clear').addEventListener('click', () => {
      placed.forEach(s => { s.textContent = ''; s.classList.remove('filled', 'cur'); s._item = null; });
      placed = [];
      poolState.forEach(p => p.used = false);
      drawPool();
      updateCur();
    });

    $('#as-check').addEventListener('click', () => {
      const answer = placed.map(s => s.textContent).join('');
      const ok = norm(answer) === norm(target);
      answerFeedback(ok, `${target} — ${word.translation}`);
      recordAnswer(word, ok);
      WM.tts.speak(target, session.lang);
      next(ok ? 900 : 1600);
    });

    drawPool();
    updateCur();
  }

  // 2. Диктант
  function renderDictation(t) {
    const { word } = t;
    const target = headForm(word); // инфинитив для наборов форм
    area().innerHTML = `
      <div class="game-card">
        <div class="hint">Прослушайте и напишите слово</div>
        ${WM.images.renderPreview(word.image, word.word, word.tags, 'game-img')}
        <button class="icon-btn" id="dt-speak" aria-label="Прослушать ещё раз" title="Прослушать ещё раз">${ICONS.speaker}</button>
        <input type="text" class="game-input" id="dt-input" autocomplete="off" spellcheck="false" placeholder="Слово…">
        <div class="game-actions">
          <button class="btn btn-primary" id="dt-check">Проверить</button>
        </div>
      </div>`;

    $('#dt-speak').addEventListener('click', () => WM.tts.speak(target, session.lang));
    later(() => WM.tts.speak(target, session.lang), 250);

    const check = () => {
      const val = $('#dt-input').value;
      if (!val.trim()) return;
      const ok = norm(val) === norm(target);
      answerFeedback(ok, `${target} — ${word.translation}`);
      recordAnswer(word, ok);
      WM.tts.speak(target, session.lang);
      next(ok ? 900 : 1600);
    };
    $('#dt-check').addEventListener('click', check);
    $('#dt-input').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    $('#dt-input').focus();
  }

  // маленькая картинка для пар «картинка ↔ перевод»
  function smallImage(word) {
    const img = word.image;
    if (img?.type === 'base64' || img?.type === 'url') {
      return `<img src="${img.value}" alt="" loading="lazy" onerror="this.outerHTML='<span class=&quot;mi-emoji&quot;>📘</span>'">`;
    }
    return `<span class="mi-emoji">${WM.images.emojiForWord(word.word, word.tags)}</span>`;
  }

  // Сопоставление парами (общая для match-word и match-image)
  function renderMatch(t) {
    const withImages = t.sub === 'match-image';
    // пары берём только из идущих подряд заданий того же типа (важно для «Микса»)
    const limit = withImages ? 4 : 5;
    const chunk = [];
    for (let j = session.i; j < session.tasks.length && chunk.length < limit; j++) {
      if (session.tasks[j].sub !== t.sub) break;
      chunk.push(session.tasks[j].word);
    }

    session._match = { chunk, sel: null, wrong: new Set() };

    const leftHTML = chunk.map(w => withImages
      ? `<button class="match-item" data-left="${w.id}">${smallImage(w)}</button>`
      : `<button class="match-item" data-left="${w.id}">${esc(w.word)}</button>`).join('');
    const rightHTML = shuffle(chunk).map(w =>
      `<button class="match-item" data-right="${w.id}">${esc(w.translation)}</button>`).join('');

    area().innerHTML = `
      <div class="game-card">
        <div class="hint">${withImages ? 'Соедините картинку и перевод' : 'Соедините слово и перевод'}</div>
        <div class="match-grid">
          <div class="match-col">${leftHTML}</div>
          <div class="match-col">${rightHTML}</div>
        </div>
      </div>`;

    const grid = area().querySelector('.match-grid');
    grid.addEventListener('click', e => {
      const item = e.target.closest('.match-item');
      if (!item || item.classList.contains('done') || item.disabled) return;
      const side = item.dataset.left ? 'left' : 'right';
      const sel = session._match.sel;

      // повторный клик по выбранному — снимаем выбор; клик по той же стороне — переносим выбор
      if (sel) {
        sel.el.classList.remove('selected');
        if (sel.side === side) { session._match.sel = null; return; }
      }
      if (!sel || sel.side === side) {
        item.classList.add('selected');
        session._match.sel = { el: item, side };
        return;
      }

      // пара собрана: слева всегда элемент data-left, справа — data-right
      const l = sel.side === 'left' ? sel.el : item;
      const r = sel.side === 'left' ? item : sel.el;
      session._match.sel = null;
      const pairWord = chunk.find(w => w.id === l.dataset.left);
      const ok = l.dataset.left === r.dataset.right;
      if (ok) {
        l.classList.add('done'); r.classList.add('done');
        l.disabled = r.disabled = true;
        answerFeedback(true, `${pairWord.word} — ${pairWord.translation}`);
        recordAnswer(pairWord, !session._match.wrong.has(pairWord.id));
        WM.tts.speak(headForm(pairWord), session.lang);
        if (grid.querySelector('[data-left]:not(.done)') === null) {
          session.i += chunk.length;
          updateProgress();
          later(() => renderTask(), 600);
        }
      } else {
        session._match.wrong.add(l.dataset.left);
        l.classList.add('wrong'); r.classList.add('wrong');
        later(() => { l.classList.remove('wrong'); r.classList.remove('wrong'); }, 350);
        feedback('Не та пара — попробуйте ещё', false);
        WM.tts.speak(headForm(pairWord), session.lang);
      }
    });
  }

  function answerFeedback(ok, answer) {
    feedback(ok ? `✓ Верно · ${answer}` : `✗ Правильно: ${answer}`, ok);
  }

  // ---------- финал ----------

  function finish() {
    const pct = session.total ? Math.round((session.correct / session.total) * 100) : 0;
    WM.storage.addStats(WM.app.state.uid, {
      mode: session.mode, lang: session.lang,
      total: session.total, correct: session.correct, percent: pct,
    });

    $('#res-emoji').textContent = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '🙂';
    $('#res-percent').textContent = pct + '%';
    $('#res-line').textContent = `Верно ${session.correct} из ${session.total}`;

    const mistakes = [...session.mistakes.values()];
    const retryBtn = $('#btn-retry-mistakes');
    retryBtn.hidden = !mistakes.length;
    retryBtn.textContent = `Прогнать ошибки (${mistakes.length})`;
    $('#res-mistakes').innerHTML = mistakes.length
      ? `<h4>Ошибки (${mistakes.length})</h4>` +
        mistakes.map(w => `<div class="mistake-row"><span class="mw">${esc(w.word)}</span><span>${esc(w.translation)}</span></div>`).join('')
      : '<h4>Без ошибок — идеально!</h4>';

    WM.app.showView('results');
  }

  function exit() {
    session?.timers?.forEach(clearTimeout);
    session = null;
    WM.app.showView('app');
  }

  // ---------- инициализация ----------

  function init() {
    $('#btn-train').addEventListener('click', () => openSetup());
    $('#train-count').addEventListener('change', updateAvailability);
    $('#train-tag').addEventListener('change', updateAvailability);
    $('#btn-train-start').addEventListener('click', start);
    $('#btn-game-exit').addEventListener('click', async () => {
      const ok = await WM.app.confirm('Выйти из тренировки? Прогресс не сохранится.', 'Выйти');
      if (ok) exit();
    });
    $('#btn-again').addEventListener('click', () => {
      // повтор с той же настройкой, но заново перемешанный
      const { mode, count, preset } = lastConfig || {};
      let available;
      if (preset) {
        available = preset.words;
      } else {
        const tag = $('#train-tag') ? $('#train-tag').value : '';
        available = poolWords(WM.app.state.lang, tag);
      }
      if (!available.length) return exit();
      const lang = preset ? preset.lang : WM.app.state.lang;
      beginSession(mode, count, available, lang);
    });
    // перепройти только слова, которые не поддались в прошлой сессии
    $('#btn-retry-mistakes').addEventListener('click', () => {
      if (!session || !session.mistakes.size) return;
      beginSession(session.mode, null, [...session.mistakes.values()], session.lang);
    });
    $('#btn-finish').addEventListener('click', exit);
  }

  return { init, openSetup };
})();
