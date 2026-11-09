// Редактор картинок: все группы каталога, открывается из меню аватара.
// Группы-пары с общими словами (ит+ен) или с одинаковыми списками переводов
// (зеркальные словари: бизнес, части тела, прилагательные, цвета…) идут
// первыми слитно — картинка меняется для обоих языков сразу; остальные —
// под 🇬🇧 и 🇮🇹. Группы раскрываются, у слов: «Другая» листает варианты
// из Википедии, «Своя» — файл, «Убрать» — эмодзи-заглушка. Выбор
// сохраняется в слове словаря (если оно есть) и в постоянном кеше групп.
window.WM = window.WM || {};

WM.editor = (() => {
  const $ = sel => document.querySelector(sel);
  // app.js определяет WM.esc позже (editor.js подключён раньше) — вызываем лениво
  const esc = s => WM.esc(s);
  const FLAG = { it: '🇮🇹', en: '🇬🇧' };
  const norm = s => s.trim().toLowerCase();

  let variants = new Map();    // 'lang:word' → { list: [], i: -1 } — подбор «Другой»
  let query = '';
  let uploadTarget = null;     // слово, ждущее файл из #ed-file
  let expanded = new Set();    // ключи раскрытых блоков (на сессию)
  let blockByKey = new Map();  // ключ блока → блок (для ленивой отрисовки)
  let rowSpecs = new Map();    // rowKey → spec (обработка кнопок строки)

  // ---------- структура каталога ----------

  // пара ит+ен «общая», если есть слова-тёзки (одинаковое написание) или
  // одинаковые множества переводов — зеркальные словари: каждый смысл
  // представлен словом в обоих языках, картинка ставится обоим сразу
  function isCommonPair(it, en) {
    const itW = it.words.map(w => norm(w.word));
    if (itW.some(w => en.words.some(x => norm(x.word) === w))) return true;
    const tIt = it.words.map(w => norm(w.translation)).sort();
    const tEn = en.words.map(w => norm(w.translation)).sort();
    return tIt.length > 0 && JSON.stringify(tIt) === JSON.stringify(tEn);
  }

  function buildStructure() {
    const byTag = new Map();
    for (const g of WM.groupsData.GROUPS) {
      if (!byTag.has(g.tag)) byTag.set(g.tag, { it: null, en: null });
      byTag.get(g.tag)[g.lang] = g;
    }
    const common = [], enGroups = [], itGroups = [];
    for (const [tag, p] of byTag) {
      if (p.it && p.en) {
        if (isCommonPair(p.it, p.en)) common.push({ type: 'common', tag, key: `c:${tag}`, it: p.it, en: p.en });
        else { enGroups.push(p.en); itGroups.push(p.it); }
      } else if (p.en) enGroups.push(p.en);
      else itGroups.push(p.it);
    }
    const byName = (a, b) => a.tag.localeCompare(b.tag, 'ru');
    common.sort(byName);
    enGroups.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    itGroups.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    return { common, enGroups, itGroups };
  }

  // строки блока: для пары — слияние по слову-тёзке (одинаковое написание,
  // как pasta у еда) и по переводу (зеркальные словари: it-слово и en-слово
  // одного смысла, как forchetta/fork); для одиночной группы — её слова
  function blockWords(block) {
    const specs = [];
    const byWord = new Map();  // normWord → spec (тёзки)
    const byTr = new Map();    // 'normTranslation#вхождение' → spec (зеркальные)
    const trSeen = new Map();  // 'lang:translation' → сколько таких уже было
    const langs = block.type === 'common' ? ['it', 'en'] : [block.lang];
    for (const L of langs) {
      const g = block.type === 'common' ? block[L] : block;
      for (const w of g.words) {
        const nw = norm(w.word), nt = norm(w.translation);
        // второй «компания» в языке — отдельное вхождение: пары сопоставляются
        // по порядку (azienda↔company, società↔corporation)
        const occ = trSeen.get(`${L}:${nt}`) ?? 0;
        trSeen.set(`${L}:${nt}`, occ + 1);
        const trKey = `${nt}#${occ}`;
        let spec = byWord.get(nw);
        if (!spec || spec.langs.includes(L)) {
          spec = byTr.get(trKey);
          if (!spec || spec.langs.includes(L)) {
            spec = {
              rowKey: `${block.key}:${nw}:${specs.length}`,
              words: {}, translation: w.translation.trim(),
              langs: [], fetchLang: L,
            };
            specs.push(spec);
            if (!byTr.has(trKey)) byTr.set(trKey, spec);
          }
        }
        if (!spec.words[L]) spec.words[L] = w.word;
        if (!spec.langs.includes(L)) spec.langs.push(L);
        byWord.set(nw, spec);
      }
    }
    for (const s of specs) s.primary = s.words[s.langs[0]] ?? Object.values(s.words)[0];
    return specs.sort((a, b) => a.translation.localeCompare(b.translation, 'ru'));
  }

  // ---------- картинки слова ----------

  // картинка слова строки: словарное слово любого языка строки → его
  // картинка; иначе постоянный кеш групп; иначе null (эмодзи-заглушка)
  function imageFor(spec) {
    const dict = WM.storage.getWords(WM.app.state.uid)
      .find(x => spec.langs.includes(x.lang) &&
        spec.langs.some(L => spec.words[L] && norm(spec.words[L]) === norm(x.word)) && x.image);
    if (dict) return dict.image;
    for (const L of spec.langs) {
      const w = spec.words[L];
      if (!w) continue;
      const c = WM.groups.lookupImage?.(L, w);
      if (c?.type === 'url') return c;
    }
    return null;
  }

  // картинка ставится словам строки во всех языках (и тёзкам из словаря);
  // кеш групп обновляется для каждой пары язык:слово, чтобы страницы групп
  // и карточки показали её сразу
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

  // ---------- отрисовка ----------

  function open() {
    WM.app.showPage('images');
  }

  function render() {
    rowSpecs.clear();
    blockByKey = new Map();
    const struct = buildStructure();
    $('#page-images').innerHTML = `
      <div class="ed-head">
        <div class="ed-head-row">
          <button class="btn btn-ghost btn-sm" id="ed-back">← Назад</button>
          <h3>Редактор картинок</h3>
        </div>
        <p class="hint">Картинки настраиваются заранее и действуют на карточках, в группах и в тренировке.
        «Другая» листает варианты из Википедии. В общих группах 🇮🇹🇬🇧 картинка меняется для обоих языков сразу.</p>
        <input type="search" class="select" id="ed-search" placeholder="Поиск по группе или слову…" value="${esc(query)}">
      </div>
      <div id="ed-body">${sectionsHTML(struct)}</div>
      <input type="file" id="ed-file" accept="image/*" hidden>
    `;
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
      html += struct.enGroups.map(g => blockHTML({ type: 'single', key: `en:${g.tag}`, ...g })).join('');
    }
    if (struct.itGroups.length) {
      html += `<div class="ed-flag-head">🇮🇹 <span>Только итальянские</span></div>`;
      html += struct.itGroups.map(g => blockHTML({ type: 'single', key: `it:${g.tag}`, ...g })).join('');
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
    const g = block.type === 'common' ? block.it : block;
    const body = open
      ? `<div class="ed-g-body">${filtered.map(rowHTML).join('')}</div>`
      : '<div class="ed-g-body hidden" data-lazy="1"></div>';
    return `
      <div class="ed-g-block${open ? ' open' : ''}" data-block="${esc(block.key)}">
        <button class="ed-g-head" type="button">
          <span class="ed-g-arrow">▸</span>
          <span class="ed-g-icon">${g.icon}</span>
          <span class="ed-g-name">${esc(g.name)}</span>
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
