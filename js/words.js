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
    // транскрипция — рядом с кнопкой озвучки слова; кнопка произносит только слово
    const ipa = w.transcription ? `<span class="ipa">/${esc(w.transcription)}/</span>` : '';
    const speakBtn = WM.tts.supported()
      ? `<button class="icon-btn" data-act="speak" data-id="${w.id}" aria-label="Озвучить слово" title="Озвучить слово">${ICONS.speaker}</button>`
      : '';
    const speakers = (speakBtn || ipa)
      ? `<div class="word-speakers">${speakBtn}${ipa}</div>`
      : '';
    // на карточке — только пример на языке слова; парный пример-перевод
    // остаётся в данных и виден в модалке редактирования
    const examples = w.examples
      .filter(e => (e.lang || w.lang) === w.lang)
      .map(e => {
        const l = e.lang || w.lang;
        return `
      <div class="word-example">
        <button class="icon-btn" data-speak-ex data-text="${esc(e.text)}" data-lang="${l}" aria-label="Озвучить пример">${ICONS.speaker}</button>
        <span class="ex-flag">${langFlag(l)}</span>
        ${esc(e.text)} <span class="ex-tr">— ${esc(e.translation)}</span>
      </div>`;
      }).join('');
    const tags = w.tags.map(t => `<span class="tag" data-tagchip="${esc(t)}">${esc(t)}</span>`).join('');

    return `
    <article class="word-card" style="animation-delay:${Math.min(i * 30, 300)}ms">
      ${WM.images.renderPreview(w.image, w.word, w.tags)}
      <div class="word-body">
        <div class="word-title"><span class="w">${esc(w.word)}</span><span class="t">${esc(w.translation)}</span></div>
        ${speakers}
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

  function parseBulkLine(line) {
    let parts = line.includes('|')
      ? line.split('|')
      : line.split(/\s+-\s+/);
    parts = parts.map(p => p.trim());
    if (!parts[0]) return null;
    return {
      word: parts[0],
      translation: parts[1] || '',
      examples: parts[2] ? [{ text: parts[2], translation: parts[3] || '' }] : [],
    };
  }

  function saveBulk(e) {
    e.preventDefault();
    const { uid: U, lang } = WM.app.state;
    const lines = $('#bulk-text').value.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) { WM.app.toast('Список пуст', true); return; }

    let added = 0;
    for (const line of lines) {
      const parsed = parseBulkLine(line);
      if (!parsed) continue;
      WM.storage.addWord(U, { lang, ...parsed, image: null, tags: [] });
      added++;
    }
    $('#modal-bulk').close();
    $('#bulk-text').value = '';
    render();
    WM.app.toast(`Добавлено слов: ${added}`);
  }

  // ---------- инициализация ----------

  function init() {
    $('#btn-add-example').addEventListener('click', () => addExampleRow());
    $('#form-word').addEventListener('submit', saveWord);
    $('#form-bulk').addEventListener('submit', saveBulk);
    $('#w-word').addEventListener('input', drawImagePreview);
    $('#inp-search').addEventListener('input', render);
    $('#sel-tag').addEventListener('change', render);
    $('#btn-add-word').addEventListener('click', () => openWordModal());
    $('#btn-add-first').addEventListener('click', () => openWordModal());

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

    // кнопка «списком» — добавим в тулбар вторую маленькую кнопку через JS,
    // чтобы не раздувать index.html
    const bulk = document.createElement('button');
    bulk.className = 'icon-btn';
    bulk.title = 'Добавить списком';
    bulk.setAttribute('aria-label', 'Добавить списком');
    bulk.innerHTML = ICONS.plus;
    bulk.addEventListener('click', () => $('#modal-bulk').showModal());
    $('#btn-export').before(bulk);
  }

  return { init, render, openWordModal, allTags, parseBulkLine, addExampleRow };
})();
