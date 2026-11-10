// Редактор картинок: все группы каталога, открывается из меню аватара.
// Блоки = файлы data/*.json, строки = записи (ключ — русское слово), поэтому
// 🇮🇹🇬🇧 общие группы идут первыми и картинка меняется для обоих языков сразу;
// одиночные наборы — под 🇬🇧 и 🇮🇹. У слов: «Другая» листает варианты из
// Википедии, «Своя» — файл, «Убрать» — эмодзи-заглушка. Выбор сохраняется
// в слове словаря (если оно есть) и в постоянном кеше групп, а img записи —
// в памяти данных; кнопка «Выгрузить изменения» скачивает изменённые
// data/*.json, чтобы ими заменить файлы в папке data.
window.WM = window.WM || {};

WM.editor = (() => {
  const $ = sel => document.querySelector(sel);
  // app.js определяет WM.esc позже (editor.js подключён раньше) — вызываем лениво
  const esc = s => WM.esc(s);
  const FLAG = { it: '🇮🇹', en: '🇬🇧' };
  const norm = s => s.trim().toLowerCase();

  let variants = new Map();    // 'lang:word' → { list: [], i: -1 } — подбор «Другая»
  let query = '';
  let uploadTarget = null;     // слово, ждущее файл из #ed-file
  let expanded = new Set();    // ключи раскрытых блоков (на сессию)
  let blockByKey = new Map();  // ключ блока → блок (для ленивой отрисовки)
  let rowSpecs = new Map();    // rowKey → spec (обработка кнопок строки)

  // ---------- структура каталога ----------

  // блок = файл данных; общий, если в записи есть слова обоих языков,
  // иначе файл попадает в секцию 🇬🇧 или 🇮🇹
  function buildStructure() {
    const common = [], enGroups = [], itGroups = [];
    for (const fileId of WM.groupsData.FILES) {
      const raw = WM.groupsData.files.get(fileId);
      if (!raw) continue;
      const entries = Object.entries(raw).filter(([k]) => k !== '_meta');
      const hasIt = entries.some(([, v]) => v.it);
      const hasEn = entries.some(([, v]) => v.en);
      const block = { fileId, entries, meta: raw._meta || {}, key: `f:${fileId}` };
      if (hasIt && hasEn) common.push({ ...block, type: 'common' });
      else if (hasEn) enGroups.push({ ...block, type: 'single' });
      else itGroups.push({ ...block, type: 'single' });
    }
    const byName = (a, b) => a.meta.name.localeCompare(b.meta.name, 'ru');
    common.sort(byName);
    enGroups.sort(byName);
    itGroups.sort(byName);
    return { common, enGroups, itGroups };
  }

  // строки блока — напрямую из записей JSON: один смысл = одна строка,
  // слова обоих языков уже спарены русским ключом
  function blockWords(block) {
    const specs = block.entries.map(([k, v]) => ({
      rowKey: `${block.key}:${k}`,
      words: { it: v.it?.word, en: v.en?.word },
      langs: [v.it ? 'it' : null, v.en ? 'en' : null].filter(Boolean),
      translation: WM.groupsData.stripMarker(k),
      fetchLang: v.it ? 'it' : 'en',
      src: { file: block.fileId, key: k },
    }));
    for (const s of specs) s.primary = s.words[s.langs[0]] ?? Object.values(s.words)[0];
    return specs.sort((a, b) => a.translation.localeCompare(b.translation, 'ru'));
  }

  // ---------- картинки слова ----------

  // картинка строки: словарное слово любого языка строки → его картинка;
  // иначе постоянный кеш групп (включая пометку «нет»); иначе img из data/*.json
  function imageFor(spec) {
    const dict = WM.storage.getWords(WM.app.state.uid)
      .find(x => spec.langs.includes(x.lang) &&
        spec.langs.some(L => spec.words[L] && norm(spec.words[L]) === norm(x.word)) && x.image);
    if (dict) return dict.image;
    for (const L of spec.langs) {
      const c = WM.groups.lookupImage?.(L, spec.words[L]);
      if (c) return c; // url или пометка «нет картинки» — перекрывает img из данных
    }
    return WM.groupsData.imgOf?.(spec.src) || null;
  }

  // картинка ставится словам строки во всех языках (и тёзкам из словаря),
  // в кеш групп для каждой пары язык:слово и в img записи данных
  function applyImage(spec, image) {
    const U = WM.app.state.uid;
    const touched = new Set(); // 'lang:word'
    for (const L of spec.langs) {
      const w = spec.words[L];
      if (!w) continue;
      touched.add(`${L}:${norm(w)}`);
      for (const t of WM.storage.getWords(U)) {
        if (norm(t.word) !== norm(w)) continue;
        WM.storage.patchWordField(U, t.id, { image });
        touched.add(`${t.lang}:${norm(t.word)}`);
      }
    }
    for (const k of touched) {
      const i = k.indexOf(':');
      WM.groups.updateImageCache?.(k.slice(0, i), k.slice(i + 1), image);
    }
    // в данные пишутся только url/эмодзи — base64 слишком тяжёлый для JSON
    WM.groupsData.setImage?.(spec.src, image);
    document.querySelectorAll(`.ed-row[data-row-key="${CSS.escape(spec.rowKey)}"]`)
      .forEach(row => refreshRow(row, image));
    WM.app.toast(image?.type === 'url' ? 'Картинка сохранена'
      : image ? 'Своя картинка сохранена' : 'Картинка убрана');
  }

  function stateText(image) {
    if (image?.type === 'base64') return 'своя картинка';
    if (image?.type === 'url') return 'из Википедии';
    if (image?.type === 'emoji') return 'эмодзи';
    return 'эмодзи-заглушка';
  }

  function refreshRow(row, image) {
    const img = row.querySelector('.ed-img');
    const word = row.querySelector('.ed-word b')?.textContent || '';
    img.innerHTML = WM.images.renderPreview(image, word, [], 'ed-img-box');
    row.querySelector('.ed-state').textContent = stateText(image);
  }

  // «Другая»: следующий вариант из Википедии (ищем словом языка строки);
  // когда локальный список кончился — дозапрос через gsroffset
  async function nextImage(spec, btn) {
    const searchWord = spec.words[spec.fetchLang] || spec.primary;
    const k = `${spec.fetchLang}:${norm(searchWord)}`;
    let v = variants.get(k);
    if (!v) { v = { list: [], i: -1 }; variants.set(k, v); }
    btn.disabled = true;
    try {
      if (v.i + 1 >= v.list.length) {
        const more = await WM.images.fetchImageList(searchWord, spec.fetchLang, { offset: v.list.length });
        const have = new Set(v.list);
        for (const u of more) if (!have.has(u)) v.list.push(u);
      }
      const current = imageFor(spec)?.value;
      let url = null;
      while (v.i + 1 < v.list.length) {
        v.i++;
        url = v.list[v.i];
        if (url !== current) break;
        url = null;
      }
      if (!url) { WM.app.toast('Других вариантов в Википедии нет', true); return; }
      applyImage(spec, { type: 'url', value: url });
    } finally {
      btn.disabled = false;
    }
  }

  async function onFile(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || !uploadTarget) return;
    try {
      const base64 = await WM.images.imageToBase64(file);
      applyImage(uploadTarget, { type: 'base64', value: base64 });
    } catch (err) {
      WM.app.toast(err.message, true);
    }
    uploadTarget = null;
  }

  // «Выгрузить изменения»: скачать изменённые data/*.json — ими заменяют
  // файлы в папке data, чтобы настройки картинок сохранились навсегда
  function exportChanged() {
    const changed = WM.groupsData.changedFiles();
    if (!changed.length) { WM.app.toast('Изменённых файлов нет'); return; }
    for (const { file, json } of changed) {
      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = file;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }
    WM.app.toast(`Скачано файлов: ${changed.length} — замените ими файлы в папке data`);
  }

  // ---------- отрисовка ----------

  function open() {
    WM.app.showPage('images');
  }

  function render() {
    rowSpecs.clear();
    blockByKey = new Map();
    const back = `<button class="btn btn-ghost btn-sm" id="ed-back">← Назад</button>`;

    if (WM.groupsData.state === 'loading') {
      $('#page-images').innerHTML = `<div class="ed-head"><div class="ed-head-row">${back}<h3>Редактор картинок</h3></div></div>
        <p class="hint" style="padding:20px 0">Загрузка наборов…</p>`;
      $('#ed-back').addEventListener('click', () => WM.app.showPage('words'));
      WM.groupsData.ready.then(() => { if (WM.groupsData.state === 'ok') render(); });
      return;
    }
    if (WM.groupsData.state === 'error') {
      $('#page-images').innerHTML = `<div class="ed-head"><div class="ed-head-row">${back}<h3>Редактор картинок</h3></div></div>
        <p class="hint" style="padding:20px 0">Наборы не загрузились — страница открыта без локального сервера (file://).</p>`;
      $('#ed-back').addEventListener('click', () => WM.app.showPage('words'));
      return;
    }

    const struct = buildStructure();
    $('#page-images').innerHTML = `
      <div class="ed-head">
        <div class="ed-head-row">
          ${back}
          <h3>Редактор картинок</h3>
          <button class="btn btn-ghost btn-sm" id="ed-export" style="margin-left:auto"
            title="Скачать изменённые файлы data/*.json — замените ими файлы в папке data">
            ${ICONS.download}<span> Выгрузить изменения</span>
          </button>
        </div>
        <p class="hint">Картинки настраиваются заранее и действуют на карточках, в группах и в тренировке.
        «Другая» листает варианты из Википедии. В общих группах 🇮🇹🇬🇧 картинка меняется для обоих языков сразу.
        Кнопка «Выгрузить изменения» скачивает обновлённые data/*.json.</p>
        <input type="search" class="select" id="ed-search" placeholder="Поиск по группе или слову…" value="${esc(query)}">
      </div>
      <div id="ed-body">${sectionsHTML(struct)}</div>
      <input type="file" id="ed-file" accept="image/*" hidden>
    `;
    $('#ed-export').addEventListener('click', exportChanged);
    bind();
  }

  function sectionsHTML(struct) {
    let html = '';
    if (struct.common.length) {
      html += `<div class="ed-flag-head">🇮🇹🇬🇧 <span>Общие группы · картинка меняется для обоих языков</span></div>`;
      html += struct.common.map(blockHTML).join('');
    }
    if (struct.enGroups.length) {
      html += `<div class="ed-flag-head">🇬🇧 <span>Только английские</span></div>`;
      html += struct.enGroups.map(blockHTML).join('');
    }
    if (struct.itGroups.length) {
      html += `<div class="ed-flag-head">🇮🇹 <span>Только итальянские</span></div>`;
      html += struct.itGroups.map(blockHTML).join('');
    }
    if (!html) html = '<div class="hint ed-empty">Группы не найдены</div>';
    return html;
  }

  function blockHTML(block) {
    blockByKey.set(block.key, block);
    const words = blockWords(block);
    const q = query.trim().toLowerCase();
    const filtered = q
      ? words.filter(s => s.primary.toLowerCase().includes(q) || s.translation.toLowerCase().includes(q))
      : words;
    if (q && !filtered.length) return '';
    const open = q ? true : expanded.has(block.key);
    const body = open
      ? `<div class="ed-g-body">${filtered.map(rowHTML).join('')}</div>`
      : '<div class="ed-g-body hidden" data-lazy="1"></div>';
    return `
      <div class="ed-g-block${open ? ' open' : ''}" data-block="${esc(block.key)}">
        <button class="ed-g-head" type="button">
          <span class="ed-g-arrow">▸</span>
          <span class="ed-g-icon">${esc(block.meta.icon)}</span>
          <span class="ed-g-name">${esc(block.meta.name)}</span>
          <span class="ed-g-count">${filtered.length} слов</span>
        </button>
        ${body}
      </div>`;
  }

  // подпись слова строки: у тёзок — «🇮🇹🇬🇧 pasta», у зеркальных — «🇮🇹 forchetta 🇬🇧 fork»
  function wordHTML(spec) {
    if (spec.langs.every(L => norm(spec.words[L]) === norm(spec.primary))) {
      return `<span class="ed-flags">${spec.langs.map(L => FLAG[L]).join('')}</span> <b>${esc(spec.primary)}</b>`;
    }
    return spec.langs
      .map(L => `<span class="ed-flags">${FLAG[L]}</span> <b>${esc(spec.words[L] ?? '')}</b>`)
      .join(' ');
  }

  function rowHTML(spec) {
    const image = imageFor(spec);
    rowSpecs.set(spec.rowKey, spec);
    return `
      <div class="ed-row" data-row-key="${esc(spec.rowKey)}" data-w="${esc(norm(spec.primary))}" data-langs="${spec.langs.join(',')}" data-lang="${spec.fetchLang}">
        <div class="ed-img">${WM.images.renderPreview(image, spec.primary, [], 'ed-img-box')}</div>
        <div class="ed-info">
          <div class="ed-word">${wordHTML(spec)} <span class="ed-tr">${esc(spec.translation)}</span></div>
          <div class="ed-state">${stateText(image)}</div>
        </div>
        <div class="ed-actions">
          <button class="btn btn-ghost btn-sm" data-ed="next">Другая</button>
          <button class="btn btn-ghost btn-sm" data-ed="upload">Своя</button>
          <button class="btn btn-ghost btn-sm" data-ed="remove">Убрать</button>
        </div>
      </div>`;
  }

  function bind() {
    $('#ed-back').addEventListener('click', () => WM.app.showPage('words'));
    $('#ed-search').addEventListener('input', e => {
      query = e.target.value;
      render(); // поиск перестраивает секции: совпадающие блоки раскрыты
    });
    $('#ed-body').addEventListener('click', onBodyClick);
    $('#ed-file').addEventListener('change', onFile);
  }

  async function onBodyClick(e) {
    const head = e.target.closest('.ed-g-head');
    if (head) {
      const blockEl = head.closest('.ed-g-block');
      const key = blockEl.dataset.block;
      const body = blockEl.querySelector('.ed-g-body');
      const open = blockEl.classList.toggle('open');
      if (open) {
        expanded.add(key);
        if (body.dataset.lazy) {
          body.innerHTML = blockWords(blockByKey.get(key)).map(rowHTML).join('');
          delete body.dataset.lazy;
        }
        body.classList.remove('hidden');
      } else {
        expanded.delete(key);
        body.classList.add('hidden');
      }
      return;
    }

    const btn = e.target.closest('[data-ed]');
    if (!btn) return;
    const row = btn.closest('.ed-row');
    const spec = rowSpecs.get(row.dataset.rowKey);
    if (!spec) return;
    if (btn.dataset.ed === 'next') await nextImage(spec, btn);
    else if (btn.dataset.ed === 'upload') { uploadTarget = spec; $('#ed-file').click(); }
    else if (btn.dataset.ed === 'remove') applyImage(spec, null);
  }

  return { open, render };
})();
