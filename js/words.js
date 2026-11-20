// Словарь: список, вкладки, добавление/редактирование, теги, поиск
window.WM = window.WM || {};

WM.words = (() => {
  let imgDraft = 'auto'; // 'auto' | 'none' | {type, value}
  let editId = null;

  const $ = sel => document.querySelector(sel);

  const esc = s => WM.esc(String(s ?? ''));

  // флажок языка примера: у каждого примера свой lang (пример-перевод на втором языке)
  const langFlag = l => (l === 'en' ? '🇬🇧' : '🇮🇹');

  // ---------- фильтрация ----------

  function filtered() {
    const { uid: U, lang } = WM.app.state;
    const q = $('#inp-search').value.trim().toLowerCase();
    const tag = $('#sel-tag').value;
    return WM.storage.getWords(U).filter(w =>
      w.lang === lang &&
      (!tag || w.tags.includes(tag)) &&
      (!q ||
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        w.examples.some(e => e.text.toLowerCase().includes(q)))
    );
  }

  function allTags() {
    const { uid: U, lang } = WM.app.state;
    const set = new Set();
    WM.storage.getWords(U).filter(w => w.lang === lang).forEach(w => w.tags.forEach(t => set.add(t)));
    return [...set].sort((a, b) => a.localeCompare(b, 'ru'));
  }

  // ---------- рендер списка ----------

  function render() {
    const { uid: U, lang } = WM.app.state;
    const words = filtered();

    // селект тегов
    const sel = $('#sel-tag');
    const cur = sel.value;
    sel.innerHTML = '<option value="">Все теги</option>' +
      allTags().map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
    if ([...sel.options].some(o => o.value === cur)) sel.value = cur;

    // карточки
    $('#words-grid').innerHTML = words.map((w, i) => cardHTML(w, i)).join('');
    $('#empty-state').classList.toggle('hidden', words.length > 0);
    $('#words-grid').classList.toggle('hidden', words.length === 0);

    // действия карточек
    $('#words-grid').querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { act, id } = btn.dataset;
        const word = WM.storage.getWords(U).find(w => w.id === id);
        if (act === 'edit') openWordModal(word);
        if (act === 'delete') removeWord(word);
        if (act === 'speak') WM.tts.speak(word.word, word.lang);
      });
    });
    $('#words-grid').querySelectorAll('[data-tagchip]').forEach(chip => {
      chip.addEventListener('click', () => { sel.value = chip.dataset.tagchip; render(); });
    });
    $('#words-grid').querySelectorAll('[data-speak-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { text, lang: l } = btn.dataset;
        WM.tts.speak(text, l);
      });
    });
  }

  function cardHTML(w, i) {
    // верхняя строка: слово + транскрипция + озвучка; кнопка произносит только слово
    const ipa = w.transcription ? `<span class="ipa">/${esc(w.transcription)}/</span>` : '';
    const speakBtn = WM.tts.supported()
      ? `<button class="icon-btn w-speak" data-act="speak" data-id="${w.id}" aria-label="Озвучить слово" title="Озвучить слово">${ICONS.speaker}</button>`
      : '';
    // на карточке — только пример на языке слова; парный пример-перевод
    // остаётся в данных и виден в модалке редактирования
    const examples = w.examples
      .filter(e => (e.lang || w.lang) === w.lang)
      .map(e => {
        const l = e.lang || w.lang;
        return `
      <div class="word-example">
        <span class="ex-body">
          <span class="ex-text">${esc(e.text)}</span>
          ${e.translation ? `<span class="ex-tr">${esc(e.translation)}</span>` : ''}
        </span>
        <button class="icon-btn" data-speak-ex data-text="${esc(e.text)}" data-lang="${l}" aria-label="Озвучить пример">${ICONS.speaker}</button>
      </div>`;
      }).join('');
    const tags = w.tags.map(t => `<span class="tag" data-tagchip="${esc(t)}">${esc(t)}</span>`).join('');

    return `
    <article class="word-card" style="animation-delay:${Math.min(i * 30, 300)}ms">
      ${WM.images.renderPreview(w.image, w.word, w.tags)}
      <div class="word-body">
        <div class="word-title">
          <span class="w">${esc(w.word)}</span>
          ${ipa}
          ${speakBtn}
        </div>
        <span class="t">${esc(w.translation)}</span>
        <div class="word-examples">${examples}</div>
        <div class="word-tags">${tags}</div>
      </div>
      <div class="word-actions">
        <button class="icon-btn" data-act="edit" data-id="${w.id}" aria-label="Редактировать" title="Редактировать">${ICONS.pencil}</button>
        <button class="icon-btn" data-act="delete" data-id="${w.id}" aria-label="Удалить" title="Удалить">${ICONS.trash}</button>
      </div>
    </article>`;
  }

  // ---------- модалка слова ----------

  function openWordModal(word = null) {
    editId = word?.id ?? null;
    imgDraft = word ? (word.image ? { ...word.image } : 'none') : 'auto';
    $('#word-modal-title').textContent = word ? 'Редактировать слово' : 'Новое слово';
    $('#w-word').value = word?.word ?? '';
    $('#w-transcription').value = word?.transcription ?? '';
    $('#w-translation').value = word?.translation ?? '';
    $('#w-tags').value = word?.tags?.join(', ') ?? '';
    $('#w-examples').innerHTML = '';
    const examples = word?.examples?.length ? word.examples : [{}];
    examples.forEach(e => addExampleRow(e.text, e.translation, e.lang));
    drawImagePreview();
    $('#modal-word').showModal();
    $('#w-word').focus();
  }

  function addExampleRow(text = '', translation = '', lang = null, container = '#w-examples') {
    const l = lang || WM.app.state.lang;
    const row = document.createElement('div');
    row.className = 'example-row';
    row.dataset.lang = l; // язык примера сохраняется при редактировании
    row.innerHTML = `
      <span class="ex-flag" title="${l === 'en' ? 'Пример на английском' : 'Пример на итальянском'}">${langFlag(l)}</span>
      <input type="text" class="ex-text" placeholder="Пример…" maxlength="140" value="${esc(text)}">
      <input type="text" class="ex-tr" placeholder="Перевод" maxlength="140" value="${esc(translation)}">
      <button type="button" class="icon-btn" aria-label="Удалить пример">${ICONS.x}</button>`;
    row.querySelector('button').addEventListener('click', () => row.remove());
    $(container).appendChild(row);
  }

  function drawImagePreview() {
    const lang = WM.app.state.lang;
    if (imgDraft && imgDraft !== 'auto' && imgDraft !== 'none') {
      $('#w-image-preview').innerHTML = WM.images.renderPreview(imgDraft, $('#w-word').value, [], 'image-preview');
    } else {
      $('#w-image-preview').innerHTML = WM.images.emojiForWord($('#w-word').value, []);
    }
  }

  async function saveWord(e) {
    e.preventDefault();
    const { uid: U, lang } = WM.app.state;
    const word = $('#w-word').value.trim();
    const transcription = $('#w-transcription').value.trim();
    const translation = $('#w-translation').value.trim();
    if (!word || !translation) { WM.app.toast('Заполните слово и перевод', true); return; }

    const examples = [...$('#w-examples').querySelectorAll('.example-row')]
      .map(r => ({
        text: r.querySelector('.ex-text').value.trim(),
        translation: r.querySelector('.ex-tr').value.trim(),
        // у строки свой язык: парный пример-перевод не должен перезаписаться языком вкладки
        lang: r.dataset.lang || lang,
      }))
      .filter(x => x.text);
    const tags = $('#w-tags').value.split(',').map(t => t.trim()).filter(Boolean);

    const data = { lang, word, transcription, translation, examples, tags };
    let saved;

    if (editId) {
      const image = (imgDraft === 'auto' || imgDraft === 'none') ? null : imgDraft;
      saved = WM.storage.updateWord(U, editId, { ...data, image });
    } else {
      saved = WM.storage.addWord(U, { ...data, image: null });
    }

    $('#modal-word').close();
    render();
    WM.app.toast(editId ? 'Слово обновлено' : 'Слово добавлено');

    // автоподбор картинки — тихо, в фоне
    const needImage = (imgDraft === 'auto' && !editId) || (imgDraft === 'auto' && !saved.image);
    if (needImage) {
      const url = await WM.images.fetchImage(word, lang);
      if (url) {
        WM.storage.patchWordField(U, saved.id, { image: { type: 'url', value: url } });
        render();
      }
    }
  }

  async function removeWord(word) {
    const ok = await WM.app.confirm(`Удалить слово «${word.word}»?`);
    if (!ok) return;
    WM.storage.deleteWord(WM.app.state.uid, word.id);
    render();
    WM.app.toast('Слово удалено');
  }

  // ---------- массовое добавление ----------

  // построчный формат «слово | перевод [| пример | перевод примера]» —
  // используется созданием набора на странице «Группы» (grid-модалке словаря
  // не нужен: там значения уже по ячейкам)
  function parseBulkLine(line) {
    const parts = line.includes('|')
      ? line.split('|')
      : line.split(/\s+-\s+/);
    const cells = parts.map(p => p.trim());
    if (!cells[0]) return null;
    return {
      word: cells[0],
      translation: cells[1] || '',
      examples: cells[2] ? [{ text: cells[2], translation: cells[3] || '' }] : [],
    };
  }

  const BULK_COLS = 4;

  // собрать/обновить сетку: 20 строк по умолчанию, дорастает под вставку
  function buildBulkGrid(rows = 20) {
    const body = $('#bulk-grid-body');
    while (body.children.length < rows) {
      const tr = document.createElement('tr');
      for (let c = 0; c < BULK_COLS; c++) {
        const td = document.createElement('td');
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.dataset.col = c;
        inp.autocomplete = 'off';
        inp.spellcheck = false;
        td.appendChild(inp);
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
  }

  // ячейка [строка, колонка] сетки
  const bulkCell = (r, c) =>
    $('#bulk-grid-body').children[r]?.children[c]?.querySelector('input');

  // записать значение в ячейку, дорастив сетку
  function setBulkCell(r, c, value) {
    buildBulkGrid(r + 1);
    const inp = bulkCell(r, c);
    if (inp && !inp.value) inp.value = value;
  }

  // разбор одной строки буфера в ячейки; «слово | перевод» без табов тоже делится
  const bulkRowCells = line => {
    const cells = line.includes('\t')
      ? line.split('\t').map(s => s.trim())
      : line.split('|').map(s => s.trim());
    while (cells.length > 1 && !cells[cells.length - 1]) cells.pop();
    return cells;
  };

  // вставка таблицы (Ctrl+V) в любую ячейку: строки буфера — вниз, табы — по колонкам.
  // Строка заголовка («Слово / Фраза → Перевод …») отсеивается сразу, чтобы не попадала в сетку
  function bulkPaste(startRow, startCol, text) {
    let lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
    const first = bulkRowCells(lines[0] ?? '');
    if (first.length > 1 && /слово|фраза/i.test(first[0]) && /перевод/i.test(first[1])) lines = lines.slice(1);
    lines.forEach((line, i) => {
      const cells = bulkRowCells(line);
      cells.forEach((val, j) => {
        if (val) setBulkCell(startRow + i, Math.min(startCol + j, BULK_COLS - 1), val);
      });
    });
  }

  // строки из сетки: пустые пропускаются, заголовок таблицы — тоже
  function collectBulkRows() {
    const body = $('#bulk-grid-body');
    const rows = [];
    for (const tr of body.children) {
      const cells = [...tr.querySelectorAll('input')].map(i => i.value.trim());
      if (cells.some(v => v)) rows.push(cells);
    }
    // заголовок: «Слово / Фраза» + «Перевод» в первых колонках
    if (rows.length > 1 && /слово|фраза/i.test(rows[0][0]) && /перевод/i.test(rows[0][1])) rows.shift();
    return rows;
  }

  function saveBulk(e) {
    e.preventDefault();
    const { uid: U, lang } = WM.app.state;
    const rows = collectBulkRows().filter(cells => cells[0]);
    if (!rows.length) { WM.app.toast('Таблица пуста — заполните слово хотя бы в одной строке', true); return; }

    // дедупликация: повторная вставка той же таблицы не плодит копии
    const existing = new Set(WM.storage.getWords(U)
      .filter(w => w.lang === lang)
      .map(w => `${w.word.trim().toLowerCase()}|${(w.translation || '').trim().toLowerCase()}`));
    const addedWords = [];
    let skipped = 0;
    for (const cells of rows) {
      const key = `${cells[0].toLowerCase()}|${(cells[1] || '').trim().toLowerCase()}`;
      if (existing.has(key)) { skipped++; continue; }
      existing.add(key);
      const parsed = {
        word: cells[0],
        translation: cells[1] || '',
        examples: cells[2] ? [{ text: cells[2], translation: cells[3] || '' }] : [],
      };
      WM.storage.addWord(U, { lang, ...parsed, image: null, tags: [] });
      addedWords.push(parsed.word);
    }
    $('#modal-bulk').close();
    buildBulkGrid(20);
    [...$('#bulk-grid-body').querySelectorAll('input')].forEach(i => { i.value = ''; });
    render();
    WM.app.toast(`Добавлено слов: ${addedWords.length}${skipped ? ` · уже были: ${skipped}` : ''}`);

    // фоновый автоподбор картинок для первых 8 слов без картинки — как в группах
    if (addedWords.length) {
      (async () => {
        const fresh = addedWords.slice(0, 8);
        for (const word of fresh) {
          const url = await WM.images.fetchImage(word, lang);
          if (!url) continue;
          const saved = WM.storage.getWords(U).find(x =>
            x.lang === lang && x.word.toLowerCase() === word.toLowerCase() && !x.image);
          if (saved) WM.storage.patchWordField(U, saved.id, { image: { type: 'url', value: url } });
        }
        render();
      })();
    }
  }

  // ---------- инициализация ----------

  function init() {
    $('#btn-add-example').addEventListener('click', () => addExampleRow());
    $('#form-word').addEventListener('submit', saveWord);
    $('#form-bulk').addEventListener('submit', saveBulk);
    $('#w-word').addEventListener('input', drawImagePreview);
    $('#inp-search').addEventListener('input', render);
    $('#sel-tag').addEventListener('change', render);
    // «+» — вставка таблицы/списка (основной путь добавления);
    // одиночная форма доступна по ссылке в модалке и маленькой кнопке тулбара
    $('#btn-add-word').addEventListener('click', () => $('#modal-bulk').showModal());
    $('#btn-add-first').addEventListener('click', () => $('#modal-bulk').showModal());
    $('#btn-bulk-single').addEventListener('click', () => {
      $('#modal-bulk').close();
      openWordModal();
    });

    // сетка таблицы: первичная сборка, Ctrl+V и Enter
    buildBulkGrid(20);
    $('#bulk-grid').addEventListener('paste', e => {
      const text = e.clipboardData?.getData('text/plain');
      if (!text) return;
      e.preventDefault();
      const cell = e.target.closest('td')?.querySelector('input');
      const all = [...$('#bulk-grid-body').querySelectorAll('tr')];
      const row = cell ? all.indexOf(cell.closest('tr')) : 0;
      const col = cell ? Number(cell.dataset.col) : 0;
      bulkPaste(row, col, text);
    });
    $('#bulk-grid').addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const cell = e.target.closest('td')?.querySelector('input');
      if (!cell) return;
      e.preventDefault();
      const all = [...$('#bulk-grid-body').querySelectorAll('tr')];
      const below = bulkCell(all.indexOf(cell.closest('tr')) + 1, Number(cell.dataset.col));
      below?.focus();
    });

    $('#btn-image-upload').addEventListener('click', () => $('#file-image').click());
    $('#file-image').addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const base64 = await WM.images.imageToBase64(file);
        imgDraft = { type: 'base64', value: base64 };
        drawImagePreview();
      } catch (err) {
        WM.app.toast(err.message, true);
      }
      e.target.value = '';
    });
    $('#btn-image-remove').addEventListener('click', () => {
      imgDraft = 'none';
      drawImagePreview();
    });

    // очистка всего словаря
    $('#btn-clear-words').innerHTML = ICONS.trash;
    $('#btn-clear-words').addEventListener('click', async () => {
      const { uid: U } = WM.app.state;
      const total = WM.storage.getWords(U).length;
      if (!total) { WM.app.toast('Словарь уже пуст', true); return; }
      const ok = await WM.app.confirm(`Удалить все слова (${total}, оба языка)? Действие необратимо.`);
      if (!ok) return;
      WM.storage.setWords(U, []);
      render();
      WM.app.toast('Словарь очищен');
    });

    // маленькая кнопка тулбара — одиночная форма слова (транскрипция, картинка)
    const single = document.createElement('button');
    single.className = 'icon-btn';
    single.title = 'Добавить слово';
    single.setAttribute('aria-label', 'Добавить слово');
    single.innerHTML = ICONS.pencil;
    single.addEventListener('click', () => openWordModal());
    $('#btn-export').before(single);
  }

  return { init, render, openWordModal, allTags, parseBulkLine, addExampleRow };
})();
