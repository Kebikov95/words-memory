// Страница «Повторение»: интервальное повторение выбранных групп.
// Карточка: картинка → слово → 4 варианта перевода; свайп («помню»/«не помню»,
// направление настраивается) или ввод слова целиком (кнопка ⌨️).
// После каждого ответа слово озвучивается. Под тренировкой — список слов
// выбранных групп с текущим статусом интервала.
window.WM = window.WM || {};

WM.srsPage = (() => {
  const $ = sel => document.querySelector(sel);
  const esc = s => WM.esc(String(s ?? ''));

  let pool = [];            // выбранные слова: {key, lang, word, transcription, translation, image, groupName}
  let queue = [];           // карточки текущей сессии (due-слова)
  let session = null;       // { idx, correct, wrong, mistakes: [] }
  let card = null;          // текущая карточка
  let selVersion = 0;       // перерисовка списка статусов без сброса ввода

  const selKey = () => `wm_srs_sel_${WM.app.state.uid}`;
  const readSel = () => { try { return JSON.parse(localStorage.getItem(selKey())) || []; } catch { return []; } };
  const writeSel = ids => { try { localStorage.setItem(selKey(), JSON.stringify(ids)); } catch {} };

  // направление свайпа: 'right' (по умолчанию) — вправо «помню», влево «не помню»
  const swipeSetting = () => localStorage.getItem('wm_srs_swipe') === 'left' ? 'left' : 'right';

  // ---------- пул слов из выбранных групп ----------

  // каталог с пользовательскими правками — общий с группами (dedup по аудиту)
  const allGroups = () => WM.groups.allGroups();

  function buildPool() {
    const sel = new Set(readSel());
    const seen = new Set();
    pool = [];
    for (const g of allGroups()) {
      if (!sel.has(g.id)) continue;
      for (const w of g.words) {
        const k = WM.srs.key(g.lang, w.word);
        if (seen.has(k)) continue;
        seen.add(k);
        pool.push({
          key: k, lang: g.lang, word: w.word,
          transcription: w.transcription || '',
          translation: w.translation || '',
          image: w.image || WM.groups.lookupImage(g.lang, w.word) || null,
          example: (w.examples || []).find(e => e.lang === g.lang) || null,
          groupName: g.name,
        });
      }
    }
  }

  const norm = s => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

  // ---------- страница ----------

  async function render() {
    const box = $('#page-srs');
    if (session) return renderSession(box);

    if (WM.groupsData.state === 'loading') {
      box.innerHTML = '<p class="hint" style="padding:20px 0">Загрузка наборов…</p>';
      WM.groupsData.ready.then(render);
      return;
    }
    if (WM.groupsData.state === 'error') {
      box.innerHTML = '<p class="hint">Наборы не загрузились: откройте приложение через http-сервер (python3 -m http.server 8080).</p>';
      return;
    }

    buildPool();
    const sel = new Set(readSel());
    const due = WM.srs.dueOf(pool);
    const learned = pool.filter(w => WM.srs.isLearned(w.lang, w.word)).length;
    const learning = pool.filter(w => WM.srs.isKnown(w.lang, w.word) && !WM.srs.isLearned(w.lang, w.word)).length;

    const LADDER_TEXT = 'Слова показываются по кривой забывания: 15 мин → 1 ч → 8 ч → 1 д → 2 д → 4 д → 8 д → ' +
      '16 д → 1 мес → 3 мес → 6 мес → 12 мес. Ошибка возвращает слово в начало. ' +
      'После верного ответа на шаге «12 мес» слово считается выученным.';

    // выпадающие списки групп, разбивка по языкам
    const langBlock = (lang, title) => {
      const groups = allGroups().filter(g => g.lang === lang);
      if (!groups.length) return '';
      return `
        <details class="srs-lang-block" data-lang="${lang}">
          <summary>
            <span class="srs-lang-title">${title}</span>
            <span class="srs-lang-count" data-langcnt="${lang}"></span>
          </summary>
          <div class="srs-lang-list">
            ${groups.map(g => `
              <label class="srs-group-item">
                <input type="checkbox" class="srs-group-check" data-gid="${esc(g.id)}" data-lang="${lang}" ${sel.has(g.id) ? 'checked' : ''}>
                <span class="srs-group-icon">${esc(g.icon)}</span>
                <span class="srs-group-name">${esc(g.name)}</span>
                <span class="srs-group-count">${g.words.length}</span>
              </label>`).join('')}
          </div>
        </details>`;
    };

    box.innerHTML = `
      <div class="srs-head">
        <h2>🔄 Интервальное повторение
          <span class="srs-info" tabindex="0" role="note" aria-label="${esc(LADDER_TEXT)}">ⓘ<span class="srs-info-pop">${esc(LADDER_TEXT)}</span></span>
        </h2>
        <div class="srs-stats">
          <div class="stat-line"><span>Готово к повторению</span><b>${due.length}</b></div>
          <div class="stat-line"><span>Учится</span><b>${learning}</b></div>
          <div class="stat-line"><span>Выучено</span><b>✅ ${learned}</b></div>
        </div>
        <div class="srs-select-row">
          <button class="btn btn-ghost btn-sm" id="srs-sel-all">Выбрать все группы</button>
          <button class="btn btn-ghost btn-sm" id="srs-sel-none">Снять выбор</button>
          <span class="hint" id="srs-sel-count"></span>
        </div>
        <div class="srs-groups">
          ${langBlock('it', '🇮🇹 Итальянский')}
          ${langBlock('en', '🇬🇧 Английский')}
        </div>
        <button class="btn btn-accent btn-block" id="srs-start" ${due.length ? '' : 'disabled'}>
          Начать повторение${due.length ? ` (${due.length})` : ''}
        </button>
        ${due.length ? '' : '<p class="hint">Нет слов, готовых к показу. Загляните позже — слова «дозреют» по своим интервалам.</p>'}
      </div>
      <div id="srs-status"></div>`;

    renderStatus();

    const updateCount = () => {
      const checked = [...box.querySelectorAll('.srs-group-check:checked')];
      $('#srs-sel-count').textContent = `Выбрано групп: ${checked.length} из ${allGroups().length}`;
      for (const lang of ['it', 'en']) {
        const el = box.querySelector(`[data-langcnt="${lang}"]`);
        if (!el) continue;
        const total = box.querySelectorAll(`.srs-group-check[data-lang="${lang}"]`).length;
        const n = box.querySelectorAll(`.srs-group-check[data-lang="${lang}"]:checked`).length;
        el.textContent = `выбрано ${n} из ${total}`;
      }
    };
    updateCount();

    box.querySelectorAll('.srs-group-check').forEach(cb =>
      cb.addEventListener('change', () => {
        const ids = [...box.querySelectorAll('.srs-group-check:checked')].map(x => x.dataset.gid);
        writeSel(ids);
        buildPool();
        updateCount();
        $('#srs-start').disabled = !WM.srs.dueOf(pool).length;
        renderStatus();
      }));
    $('#srs-sel-all').addEventListener('click', () => toggleAll(true));
    $('#srs-sel-none').addEventListener('click', () => toggleAll(false));
    $('#srs-start').addEventListener('click', startSession);
  }

  function toggleAll(on) {
    const ids = on ? allGroups().map(g => g.id) : [];
    writeSel(ids);
    boxChecks(ids);
    buildPool();
    $('#srs-sel-count').textContent = `Выбрано групп: ${ids.length} из ${allGroups().length}`;
    $('#srs-start').disabled = !WM.srs.dueOf(pool).length;
    renderStatus();
  }

  function boxChecks(ids) {
    const sel = new Set(ids);
    document.querySelectorAll('#page-srs .srs-group-check')
      .forEach(cb => { cb.checked = sel.has(cb.dataset.gid); });
  }

  // ---------- список статусов по группам ----------

  function renderStatus() {
    const box = $('#srs-status');
    if (!box) return;
    const sel = new Set(readSel());
    const html = allGroups().filter(g => sel.has(g.id)).map(g => {
      const rows = g.words.map(w => {
        const st = WM.srs.statusLabel(g.lang, w.word);
        const cls = st.startsWith('✅') ? 'st-done' : st.startsWith('📅') ? 'st-wait' : st.startsWith('⏳') ? 'st-due' : 'st-new';
        return `
          <div class="srs-word-row">
            <span class="srs-w">${esc(w.word)}</span>
            <span class="srs-tr">${esc(w.translation)}</span>
            <span class="srs-st ${cls}">${st}</span>
            ${WM.srs.isKnown(g.lang, w.word)
              ? `<button class="icon-btn srs-reset" data-reset-lang="${g.lang}" data-reset-word="${esc(w.word)}"
                   aria-label="Сбросить прогресс" title="Сбросить прогресс">↺</button>`
              : '<span class="srs-reset-spacer"></span>'}
          </div>`;
      }).join('');
      // сводка в заголовке: сколько слов на каком этапе
      const n = { done: 0, wait: 0, due: 0, fresh: 0 };
      for (const w of g.words) {
        const st = WM.srs.statusLabel(g.lang, w.word);
        if (st.startsWith('✅')) n.done++;
        else if (st.startsWith('📅')) n.wait++;
        else if (st.startsWith('⏳')) n.due++;
        else n.fresh++;
      }
      return `
        <details class="srs-status-group">
          <summary>
            <span class="srs-status-name">${esc(g.icon)} ${esc(g.name)} <span class="srs-group-lang">${g.lang === 'en' ? '🇬🇧' : '🇮🇹'}</span></span>
            <span class="srs-status-brief">
              ${n.done ? `<span class="st-done">✅ ${n.done}</span>` : ''}
              ${n.due ? `<span class="st-due">⏳ ${n.due}</span>` : ''}
              ${n.wait ? `<span class="st-wait">📅 ${n.wait}</span>` : ''}
              <span class="st-new">${n.fresh} из ${g.words.length}</span>
            </span>
          </summary>
          <div class="srs-status-rows">${rows || '<p class="hint">Набор пуст</p>'}</div>
        </details>`;
    }).join('');
    box.innerHTML = html ? `<h2 class="srs-status-title">Статус слов</h2>${html}` : '';
    box.querySelectorAll('[data-reset-word]').forEach(btn =>
      btn.addEventListener('click', () => {
        WM.srs.reset(btn.dataset.resetLang, btn.dataset.resetWord);
        renderStatus();
        const page = $('#page-srs');
        if (page) WM.srsPage.render();
      }));
  }

  // ---------- сессия ----------

  function startSession() {
    buildPool();
    queue = WM.srs.dueOf(pool);
    if (!queue.length) return;
    session = { idx: 0, correct: 0, wrong: 0, mistakes: [] };
    render();
  }

  function endSession() {
    const s = session;
    session = card = null;
    const box = $('#page-srs');
    const pct = s.correct + s.wrong
      ? Math.round(s.correct * 100 / (s.correct + s.wrong))
      : 100;
    box.innerHTML = `
      <div class="srs-done">
        <div class="results-emoji">${pct >= 80 ? '🎉' : '💪'}</div>
        <div class="results-percent">${pct}%</div>
        <div class="results-line">Верно ${s.correct} из ${s.correct + s.wrong}</div>
        <div class="srs-done-actions">
          <button class="btn btn-accent" id="srs-again">Повторять дальше</button>
        </div>
      </div>`;
    $('#srs-again').addEventListener('click', render);
  }

  function renderSession(box) {
    if (session.idx >= queue.length) return endSession();
    card = queue[session.idx];
    const w = card;
    const opts = optionsFor(w);

    box.innerHTML = `
      <div class="srs-session-head">
        <button class="icon-btn" id="srs-exit" aria-label="Закончить сессию" title="Закончить">${'←'}</button>
        <div class="progress-wrap"><div class="progress-bar" id="srs-progress"
          style="width:${Math.round(session.idx * 100 / queue.length)}%"></div></div>
        <div class="game-counter">${session.idx} / ${queue.length}</div>
      </div>
      <div class="srs-card-zone">
        <div class="srs-card" id="srs-card">
          <div class="srs-card-img">${WM.images.renderPreview(w.image, w.word, [], 'srs-img')}</div>
          <div class="srs-card-word">
            <span class="srs-w-text">${esc(w.word)}</span>
            ${w.transcription ? `<span class="srs-w-ipa">/${esc(w.transcription)}/</span>` : ''}
            <button class="icon-btn srs-w-speak" id="srs-w-speak" aria-label="Озвучить слово" title="Озвучить слово">${ICONS.speaker}</button>
          </div>
          <div class="srs-opts" id="srs-opts">
            ${opts.map(o => `<button class="srs-opt" data-tr="${esc(o)}">${esc(o)}</button>`).join('')}
          </div>
        </div>
        <div class="srs-swipe-hints">
          <span class="srs-hint-forgot">${swipeSetting() === 'right' ? '←' : '→'} не помню</span>
          <span class="srs-hint-rem">${swipeSetting() === 'right' ? '→' : '←'} помню</span>
        </div>
        <div class="srs-feedback hidden" id="srs-feedback"></div>
      </div>`;

    bindCard(box);
    // слово озвучивается сразу при выпадении карточки
    WM.tts.speak(w.word, w.lang);
  }

  // 4 варианта: верный перевод + 3 случайных из того же языка
  function optionsFor(w) {
    const distract = pool
      .filter(x => x.lang === w.lang && x.key !== w.key && norm(x.translation) !== norm(w.translation))
      .map(x => x.translation);
    const picked = [];
    while (picked.length < 3 && distract.length) {
      const i = Math.floor(Math.random() * distract.length);
      picked.push(distract.splice(i, 1)[0]);
    }
    const opts = [...picked, w.translation];
    // перемешивание Фишера–Йетса
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }

  function answer(isCorrect) {
    const w = card;
    if (!w) return;
    card = null; // защита от двойного ответа
    document.activeElement?.blur?.(); // снять фокус/курсор с нажатого варианта
    WM.tts.speak(w.word, w.lang); // озвучка после каждого ответа
    WM.srs[isCorrect ? 'correct' : 'wrong'](w.lang, w.word);
    isCorrect ? session.correct++ : session.wrong++;
    if (!isCorrect) session.mistakes.push(w);
    // ошибочное слово возвращается в конец очереди — ещё одно повторение в этой же сессии
    // (стадия при этом сброшена движком на первый интервал — 15 мин)
    if (!isCorrect) queue.push(w);

    const fb = $('#srs-feedback');
    fb.innerHTML = `
      <div>${isCorrect ? '✓' : '✗'} ${isCorrect ? `Верно — ${esc(w.word)} — ${esc(w.translation)}` : `Правильно: ${esc(w.word)} — ${esc(w.translation)}`}</div>
      ${w.example ? `<div class="srs-feedback-ex">${w.lang === 'en' ? '🇬🇧' : '🇮🇹'} ${esc(w.example.text)} — ${esc(w.example.translation)}</div>` : ''}`;
    fb.className = `srs-feedback ${isCorrect ? 'fb-ok' : 'fb-err'}`;
    $('#srs-card').classList.add(isCorrect ? 'answered-ok' : 'answered-err');
    const bar = $('#srs-progress');
    if (bar) bar.style.width = `${Math.round((session.idx + 1) * 100 / queue.length)}%`;

    session.idx++;
    setTimeout(() => renderSession($('#page-srs')), 900);
  }

  function bindCard(box) {
    // варианты перевода
    box.querySelectorAll('.srs-opt').forEach(btn =>
      btn.addEventListener('click', () => {
        if (!card) return;
        answer(norm(btn.dataset.tr) === norm(card.translation));
      }));

    // свайп по карточке
    const zone = $('#srs-card');
    let x0 = null;
    zone.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    zone.addEventListener('touchend', e => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) < 60) return;
      const rememberRight = swipeSetting() === 'right';
      const remembered = (dx > 0) === rememberRight;
      answer(remembered);
    }, { passive: true });
    zone.addEventListener('touchmove', e => {
      if (x0 == null) return;
      const dx = e.touches[0].clientX - x0;
      zone.style.transform = `translateX(${Math.max(-40, Math.min(40, dx))}px)`;
    }, { passive: true });
    zone.addEventListener('touchcancel', () => { x0 = null; zone.style.transform = ''; });

    $('#srs-exit').addEventListener('click', () => { session = card = null; render(); });

    $('#srs-w-speak').addEventListener('click', () => {
      if (card) WM.tts.speak(card.word, card.lang);
    });
  }

  function init() {}

  return { init, render };
})();
