// Страница «Группы»: каталог готовых наборов, просмотр и добавление в словарь
window.WM = window.WM || {};

WM.groups = (() => {
  const $ = sel => document.querySelector(sel);
  const esc = s => WM.esc(String(s ?? ''));

  let currentGroupId = null;
  let selection = new Set();
  let langFilter = '';   // '' | 'it' | 'en'
  let query = '';

  const norm = w => `${w.lang}|${(w.word || '').trim().toLowerCase()}|${(w.translation || '').trim().toLowerCase()}`;

  // все наборы: сначала пользовательские, затем готовые из каталога.
  // В готовых наборах применяются персональные правки слов (wm_group_overrides_<uid>)
  const allGroups = () => {
    const uid = WM.app.state.uid;
    const overrides = WM.storage.getGroupOverrides(uid);
    return [
      ...WM.storage.getUserGroups(uid).map(g => ({ ...g, own: true })),
      ...WM.groupsData.GROUPS.map(g => {
        const ov = overrides[g.id] || {};
        return {
          ...g,
          words: g.words.map(w => {
            const key = w.word.trim().toLowerCase();
            const patch = ov[key];
            return patch ? { ...w, ...patch, _key: key } : { ...w, _key: key };
          }),
        };
      }),
    ];
  };

  const findGroup = id => allGroups().find(g => g.id === id);

  // карточка содержит формы глагола («be — was/were — been») — авто-картинку не подбираем
  const hasForms = w => w.word.includes(' — ');

  // для тренировки — только первая форма глагола (инфинитив), без форм и пунктуации
  const trainWord = (w, lang) => ({
    ...w,
    lang,
    translation: w.translation || '',
    word: hasForms(w) ? w.word.split(' — ')[0].trim() : w.word,
  });

  // «1 слово / 2 слова / 5 слов»
  const pluralWords = n => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'слово';
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'слова';
    return 'слов';
  };

  function existingKeys() {
    return new Set(WM.storage.getWords(WM.app.state.uid).map(norm));
  }

  // ---- картинки слов в списке набора ----
  // кеш url'ов в localStorage (общий для профилей: картинка зависит только от слова),
  // в памяти — ещё и пометки «не найдено», чтобы не дёргать Википедию повторно
  const IMG_KEY = 'wm_group_images';
  const imgMem = new Map();       // 'lang:word' → {type:'url',value} | {type:'none'}
  const imgInflight = new Set();  // слова, запрос которых уже идёт
  let imgToken = 0;               // отмена загрузки при перерисовке списка

  const imgCacheRead = () => { try { return JSON.parse(localStorage.getItem(IMG_KEY)) || {}; } catch { return {}; } };

  function cachedImage(lang, word) {
    const k = `${lang}:${word.toLowerCase()}`;
    if (imgMem.has(k)) return imgMem.get(k);
    const stored = imgCacheRead()[k];
    if (stored) { imgMem.set(k, stored); return stored; }
    return null;
  }

  function rememberImage(lang, word, val) {
    const k = `${lang}:${word.toLowerCase()}`;
    imgMem.set(k, val);
    if (val.type !== 'url') return; // «не найдено» живёт только в памяти сессии
    const store = imgCacheRead();
    store[k] = val;
    const keys = Object.keys(store);
    if (keys.length > 800) delete store[keys[0]]; // не разрастаемся бесконечно
    try { localStorage.setItem(IMG_KEY, JSON.stringify(store)); } catch { /* переполнение — не критично */ }
  }

  // правка кеша извне (редактор картинок): url — пишем в localStorage,
  // null/своя base64 — пометка «не автокартинка» только в памяти сессии
  function updateImageCache(lang, word, image) {
    const k = `${lang}:${word.toLowerCase()}`;
    const store = imgCacheRead();
    if (image?.type === 'url') {
      imgMem.set(k, image);
      store[k] = image;
      const keys = Object.keys(store);
      if (keys.length > 800) delete store[keys[0]];
    } else {
      imgMem.set(k, { type: 'none' });
      delete store[k];
    }
    try { localStorage.setItem(IMG_KEY, JSON.stringify(store)); } catch { /* переполнение — не критично */ }
  }

  // чтение кеша извне (редактор картинок): память сессии → localStorage
  function lookupImage(lang, word) {
    return cachedImage(lang, word);
  }

  function paintImageIntoRow(lang, word) {
    const val = imgMem.get(`${lang}:${word.toLowerCase()}`);
    if (!val || val.type !== 'url') return;
    document.querySelectorAll(`.g-img[data-gimg="${CSS.escape(word)}"]`).forEach(box => {
      box.innerHTML = `<div class="g-img-box"><img src="${val.value}" alt="" loading="lazy"></div>`;
    });
  }

  // фоновая догрузка картинок: 3 параллельных запроса, сначала свои из словаря
  function loadGroupImages(g, rows, dictImgs) {
    const token = ++imgToken;
    const queue = rows.filter(w => {
      const k = `${g.lang}:${w.word.toLowerCase()}`;
      // карточки форм глаголов («be — was/were — been») без авто-картинки
      return !hasForms(w) && !imgMem.has(k) && !imgInflight.has(k);
    });
    let cursor = 0;
    const worker = async () => {
      while (cursor < queue.length && token === imgToken) {
        const w = queue[cursor++];
        const k = `${g.lang}:${w.word.toLowerCase()}`;
        if (imgInflight.has(k)) continue;
        imgInflight.add(k);
        try {
          const own = dictImgs.get(w.word.toLowerCase());
          const url = own?.type === 'url' ? own.value : await WM.images.fetchImage(w.word, g.lang);
          rememberImage(g.lang, w.word, url ? { type: 'url', value: url } : { type: 'none' });
        } catch { rememberImage(g.lang, w.word, { type: 'none' }); }
        finally { imgInflight.delete(k); }
        if (token !== imgToken) return;
        paintImageIntoRow(g.lang, w.word);
      }
    };
    for (let i = 0; i < 3 && i < queue.length; i++) worker();
  }

  // ---------- каталог ----------

  function render() {
    const box = $('#page-groups');
    if (currentGroupId) return renderDetail(box);

    const groups = allGroups()
      .filter(g => !langFilter || g.lang === langFilter)
      .filter(g => !query || g.name.toLowerCase().includes(query));

    box.innerHTML = `
      <div class="groups-head">
        <div class="groups-title-row">
          <h2>Готовые наборы</h2>
          <button class="btn btn-primary btn-sm" id="g-create">+ Создать набор</button>
        </div>
        <p class="hint">Выберите набор — просмотрите слова и добавьте нужные в свой словарь.
          Каждое слово получит тег набора автоматически.</p>
        <div class="lang-chips">
          <button class="tag chip-btn${langFilter === '' ? ' active-chip' : ''}" data-lf="">Все языки</button>
          <button class="tag chip-btn${langFilter === 'it' ? ' active-chip' : ''}" data-lf="it" aria-label="Italiano" title="Italiano">🇮🇹</button>
          <button class="tag chip-btn${langFilter === 'en' ? ' active-chip' : ''}" data-lf="en" aria-label="English" title="English">🇬🇧</button>
        </div>
      </div>
      <div class="groups-grid">
        ${groups.map(g => cardHTML(g)).join('')}
      </div>`;

    box.querySelectorAll('[data-open]').forEach(card =>
      card.addEventListener('click', () => {
        const id = card.dataset.open;
        history.pushState({ group: id }, '', '#group=' + encodeURIComponent(id));
        currentGroupId = id;
        selection = new Set();
        render();
      }));
    box.querySelectorAll('[data-lf]').forEach(chip =>
      chip.addEventListener('click', () => { langFilter = chip.dataset.lf; render(); }));
    $('#g-create').addEventListener('click', () => $('#modal-new-group').showModal());
  }

  function cardHTML(g) {
    const size = g.size ? ` из ${g.size}` : '';
    const badge = g.lang === 'en' ? '🇬🇧 EN' : '🇮🇹 IT';
    return `
      <article class="group-card" data-open="${g.id}">
        <div class="group-top">
          <span class="group-icon">${esc(g.icon)}</span>
          <span class="tag">${esc(g.tag)}</span>
          ${g.own ? '<span class="badge-user">мой набор</span>' : ''}
          <span class="badge-lang">${badge}</span>
        </div>
        <h3 class="group-name">${esc(g.name)}</h3>
        <p class="group-desc">${esc(g.desc)}</p>
        <div class="group-foot">
          <span class="group-count">${g.words.length}${size} ${pluralWords(g.words.length)}</span>
        </div>
      </article>`;
  }

  // ---------- просмотр набора ----------

  function renderDetail(box) {
    const g = findGroup(currentGroupId);
    const existing = existingKeys();
    const q = query.trim().toLowerCase();
    const rows = g.words.filter(w =>
      !q || w.word.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q));
    const inDictCount = g.words.filter(w =>
      existing.has(norm({ lang: g.lang, word: w.word, translation: w.translation }))).length;
    // свои картинки из словаря — чтобы не качать то, что уже скачано
    const dictImgs = new Map(WM.storage.getWords(WM.app.state.uid)
      .filter(x => x.lang === g.lang && x.image)
      .map(x => [x.word.toLowerCase(), x.image]));

    const rowsHTML = rows.map(w => {
      const inDict = existing.has(norm({ lang: g.lang, word: w.word, translation: w.translation }));
      const checked = selection.has(w.word) ? 'checked' : '';
      const img = w.image || cachedImage(g.lang, w.word) || dictImgs.get(w.word.toLowerCase()) || null;
      return `
      <div class="g-row${inDict ? ' in-dict' : ''}">
        <input type="checkbox" class="g-check" data-word="${esc(w.word)}" ${checked}>
        <div class="g-img" data-gimg="${esc(w.word)}">${WM.images.renderPreview(img, w.word, [g.tag], 'g-img-box')}</div>
        <div class="g-texts">
          <div class="g-top">
            <span class="g-word">${esc(w.word)}</span>
            ${w.transcription ? `<span class="g-ipa">/${esc(w.transcription)}/</span>` : ''}
            <button class="icon-btn g-speak" data-say="${esc(w.word)}" aria-label="Озвучить слово" title="Озвучить слово">${ICONS.speaker}</button>
            ${inDict ? '<span class="g-inmark" title="Уже в словаре">✓ в словаре</span>' : ''}
          </div>
          <span class="g-tr">${esc(w.translation)}</span>
          ${w.examples.filter(e => e.lang === g.lang).map(e => `<span class="g-ex">${e.lang === 'en' ? '🇬🇧' : '🇮🇹'} <span class="g-ex-text">${esc(e.text)}</span><button class="icon-btn g-speak-ex" data-say="${esc(e.text)}" aria-label="Озвучить пример" title="Озвучить пример">${ICONS.speaker}</button></span>`).join('')}
        </div>
        <button type="button" class="icon-btn g-edit" data-gwidx="${g.words.indexOf(w)}" aria-label="Изменить слово" title="Изменить слово">${ICONS.pencil}</button>
      </div>`;
    }).join('');

    box.innerHTML = `
      <div class="group-detail-head">
        <button class="icon-btn" id="g-back" aria-label="Назад к наборам" title="Назад">${'←'}</button>
        <div class="group-detail-title">
          <h2>${g.icon} ${esc(g.name)}</h2>
          <div class="group-meta">
            <span class="tag">${esc(g.tag)}</span>
            <span class="badge-lang">${g.lang === 'en' ? '🇬🇧 EN' : '🇮🇹 IT'}</span>
            <span class="hint">${g.words.length}${g.size ? ` из ${g.size}` : ''} ${pluralWords(g.words.length)} · уже в словаре: ${inDictCount}</span>
          </div>
        </div>
      </div>
      <div class="group-toolbar">
        <input type="search" id="g-search" placeholder="Поиск в наборе…" value="${esc(query)}">
        <button class="btn btn-primary btn-sm" id="g-add-selected" ${selection.size ? '' : 'disabled'}>
          Добавить выбранные (${selection.size})
        </button>
        <button class="btn btn-ghost btn-sm" id="g-add-all">Добавить все</button>
        <span class="toolbar-sep"></span>
        <button class="btn btn-accent btn-sm" id="g-train-selected" aria-label="Тренировать выбранные (${selection.size})" title="Тренировать выбранные (${selection.size})" ${selection.size ? '' : 'disabled'}>
          ${ICONS.play}
        </button>
        <button class="btn btn-ghost btn-sm" id="g-train-all" aria-label="Тренировать набор" title="Тренировать набор">${ICONS.play}</button>
      </div>
      <div class="g-list">${rowsHTML || '<p class="hint" style="padding:20px 0">Ничего не найдено</p>'}</div>`;

    // картинки подтягиваются в фоне после отрисовки строк
    loadGroupImages(g, rows, dictImgs);

    $('#g-back').addEventListener('click', () => {
      // если набор открыт из истории браузера — обычный «назад»,
      // иначе (набор открыт прямым URL) просто возвращаемся к каталогу
      if (history.state && history.state.group) history.back();
      else { history.replaceState(null, '', location.pathname + location.search); applyRoute(); }
    });

    box.querySelectorAll('.g-check[data-word]').forEach(cb =>
      cb.addEventListener('change', () => {
        cb.checked ? selection.add(cb.dataset.word) : selection.delete(cb.dataset.word);
        const add = $('#g-add-selected');
        const train = $('#g-train-selected');
        add.textContent = `Добавить выбранные (${selection.size})`;
        add.disabled = selection.size === 0;
        train.innerHTML = ICONS.play;
        train.setAttribute('aria-label', `Тренировать выбранные (${selection.size})`);
        train.title = `Тренировать выбранные (${selection.size})`;
        train.disabled = selection.size === 0;
      }));

    box.querySelectorAll('[data-say]').forEach(btn =>
      btn.addEventListener('click', () => WM.tts.speak(btn.dataset.say, g.lang)));

    box.querySelectorAll('.g-edit').forEach(btn =>
      btn.addEventListener('click', () => openGroupWordModal(g, Number(btn.dataset.gwidx))));

    const doSearch = e => { query = e.target.value; renderDetail(box); const inp = $('#g-search'); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); };
    $('#g-search').addEventListener('input', doSearch);

    $('#g-add-selected').addEventListener('click', () => {
      const chosen = g.words.filter(w => selection.has(w.word));
      addWords(g, chosen);
    });
    $('#g-add-all').addEventListener('click', () => addWords(g, g.words));

    $('#g-train-selected').addEventListener('click', () => {
      const chosen = g.words
        .filter(w => selection.has(w.word))
        .map(w => trainWord(w, g.lang));
      WM.games.openSetup(chosen, g.lang, g.name);
    });
    $('#g-train-all').addEventListener('click', () => {
      WM.games.openSetup(g.words.map(w => trainWord(w, g.lang)), g.lang, g.name);
    });
  }

  // ---------- история браузера ----------
  // Набор слов открывается как отдельная запись истории (pushState),
  // чтобы «назад» в браузере возвращал к каталогу, а «вперёд» — снова в набор.

  function routeGroup() {
    if (history.state && history.state.group) return history.state.group;
    const m = location.hash.match(/^#group=([^&]+)/);
    if (!m) return null;
    const id = decodeURIComponent(m[1]);
    return findGroup(id) ? id : null;
  }

  function applyRoute() {
    const id = routeGroup();
    if (id === currentGroupId) return;
    currentGroupId = id;
    selection = new Set();
    if (!id) query = '';
    render();
  }

  // ---------- создание набора ----------

  function saveNewGroup(e) {
    e.preventDefault();
    const { uid: U } = WM.app.state;
    const lang = $('#ng-lang').value === 'en' ? 'en' : 'it';
    const name = $('#ng-name').value.trim();
    const words = $('#ng-words').value.split('\n').map(l => l.trim()).filter(Boolean)
      .map(l => WM.words.parseBulkLine(l))
      .filter(Boolean)
      .map(w => ({ ...w, transcription: '', examples: w.examples.map(ex => ({ ...ex, lang })) }));

    if (!name || !words.length) {
      WM.app.toast('Укажите название и хотя бы одно слово', true);
      return;
    }

    WM.storage.addUserGroup(U, {
      lang,
      name,
      desc: $('#ng-desc').value.trim(),
      tag: $('#ng-tag').value.trim() || name,
      icon: $('#ng-icon').value.trim() || '📗',
      words,
    });

    $('#modal-new-group').close();
    $('#form-new-group').reset();
    currentGroupId = null;
    selection = new Set();
    render();
    WM.app.toast(`Набор «${name}» создан: ${words.length} слов`);
  }

  // ---------- правка слова в наборе ----------

  let editGroup = null;
  let editWordIdx = -1;
  let gwImgDraft = null;   // null = авто-подбор, {type,value} = своя картинка

  function drawGwImagePreview() {
    const wordText = $('#gw-word').value;
    $('#gw-image-preview').innerHTML = gwImgDraft
      ? WM.images.renderPreview(gwImgDraft, wordText, [], 'image-preview')
      : WM.images.emojiForWord(wordText, []);
  }

  function openGroupWordModal(group, idx) {
    editGroup = group;
    editWordIdx = idx;
    const w = group.words[idx];
    $('#gw-word').value = w.word;
    $('#gw-transcription').value = w.transcription || '';
    $('#gw-translation').value = w.translation || '';
    $('#gw-examples-list').innerHTML = '';
    const examples = (w.examples && w.examples.length) ? w.examples : [{}];
    examples.forEach(e => WM.words.addExampleRow(e.text || '', e.translation || '', e.lang, '#gw-examples-list'));
    $('#gw-tags').value = (w.tags || []).join(', ');
    gwImgDraft = w.image ? { ...w.image } : null;
    drawGwImagePreview();
    $('#modal-group-word').showModal();
    $('#gw-word').focus();
  }

  function saveGroupWord(e) {
    e.preventDefault();
    if (!editGroup || editWordIdx < 0) return;
    const word = $('#gw-word').value.trim();
    const translation = $('#gw-translation').value.trim();
    if (!word || !translation) { WM.app.toast('Заполните слово и перевод', true); return; }

    const examples = [...$('#gw-examples-list').querySelectorAll('.example-row')]
      .map(r => ({
        text: r.querySelector('.ex-text').value.trim(),
        translation: r.querySelector('.ex-tr').value.trim(),
        lang: r.dataset.lang || editGroup.lang,
      }))
      .filter(x => x.text);
    const tags = $('#gw-tags').value.split(',').map(t => t.trim()).filter(Boolean);

    const patch = {
      word,
      transcription: $('#gw-transcription').value.trim(),
      translation,
      examples,
      tags,
      image: gwImgDraft ? { ...gwImgDraft } : null,
    };

    if (editGroup.own) {
      const words = [...editGroup.words];
      words[editWordIdx] = { ...words[editWordIdx], ...patch };
      WM.storage.updateUserGroup(WM.app.state.uid, editGroup.id, { words });
    } else {
      // в готовом наборе правка сохраняется как персональное переопределение
      // и накладывается на исходное слово при каждом открытии
      WM.storage.setWordOverride(WM.app.state.uid, editGroup.id, editGroup.words[editWordIdx]._key, patch);
    }

    $('#modal-group-word').close();
    renderDetail($('#page-groups'));
    WM.app.toast('Слово обновлено');
  }

  async function addWords(group, words) {
    const U = WM.app.state.uid;
    const before = existingKeys();
    const payload = words.map(w => {
      // картинка из набора, иначе — заранее настроенная в редакторе (кеш групп)
      const cached = cachedImage(group.lang, w.word);
      return {
        lang: group.lang, word: w.word, transcription: w.transcription || '',
        translation: w.translation, examples: w.examples,
        tags: (w.tags && w.tags.length) ? w.tags : [group.tag],
        image: w.image || (cached?.type === 'url' ? cached : null),
      };
    });
    const { added, skipped } = WM.storage.importWords(U, payload);
    WM.app.toast(`Добавлено: ${added}${skipped ? ` · уже были в словаре: ${skipped}` : ''}`);

    // фоновый автоподбор картинок для новых слов (первые 8, чтобы не штормить Википедию)
    const fresh = words.filter(w =>
      !hasForms(w) &&
      !before.has(norm({ lang: group.lang, word: w.word, translation: w.translation }))).slice(0, 8);
    (async () => {
      for (const w of fresh) {
        const url = await WM.images.fetchImage(w.word, group.lang);
        if (!url) continue;
        const saved = WM.storage.getWords(U).find(x =>
          x.lang === group.lang && x.word.toLowerCase() === w.word.toLowerCase() && x.tags.includes(group.tag));
        if (saved && !saved.image) WM.storage.patchWordField(U, saved.id, { image: { type: 'url', value: url } });
      }
    })();

    render(); // перерисуем с пометками «уже в словаре»
  }

  function init() {
    window.addEventListener('popstate', applyRoute);
    window.addEventListener('hashchange', applyRoute);
    $('#form-new-group').addEventListener('submit', saveNewGroup);
    $('#form-group-word').addEventListener('submit', saveGroupWord);
    $('#gw-word').addEventListener('input', drawGwImagePreview);
    $('#btn-gw-add-example').addEventListener('click', () =>
      WM.words.addExampleRow('', '', editGroup?.lang || null, '#gw-examples-list'));
    $('#btn-gw-image-upload').addEventListener('click', () => $('#gw-file-image').click());
    $('#gw-file-image').addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        gwImgDraft = { type: 'base64', value: await WM.images.imageToBase64(file) };
        drawGwImagePreview();
      } catch (err) {
        WM.app.toast(err.message, true);
      }
      e.target.value = '';
    });
    $('#btn-gw-image-remove').addEventListener('click', () => { gwImgDraft = null; drawGwImagePreview(); });
    applyRoute(); // открываем набор, если hash уже в URL
  }

  return { init, render, updateImageCache, lookupImage };
})();
