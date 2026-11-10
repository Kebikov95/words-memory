// Загрузчик каталога готовых наборов: тянет data/<файл>.json (ключ записи —
// русское слово, внутри блоки языков en/it и общая img) и собирает группы
// каталога. Загрузка через fetch — страница должна быть открыта по http
// (локальный сервер, IDE или GitHub Pages); с file:// наборы недоступны.
// Схема файла данных:
//   { "_meta": { id, name, icon, tag, desc, size?, "id-en"?, "name-en"?, … },
//     "<русское слово>": {
//       "en": { "word": "because", "transcription": "bɪˈkɔːz",
//               "examples": [{ "text": "…", "translation": "…" }] },
//       "it": { "word": "perché", "transcription": "perˈke", "examples": […] },
//       "img": "ссылка или эмодзи, общая для обоих языков" } }
// Повторный русский перевод внутри файла получает ключ с суффиксом « ·2»
// (stripMarker снимает его при показе). Примеры — массив объектов или
// просто строка/массив строк. img: '' — нет, http(s) — url, иное — эмодзи.
window.WM = window.WM || {};

WM.groupsData = (() => {
  // порядок файлов = порядок групп в каталоге; внутри файла сначала it-группа, затем en
  const FILES = [
    'key-verbs', 'top-verbs', 'irregular-verbs', 'top-words', 'top-300', 'top-1000',
    'food', 'clothes', 'body', 'phrasal', 'proverbs', 'business', 'it', 'travel',
    'finance', 'adjectives', 'colors', 'numbers', 'sport',
  ];

  const GROUPS = [];            // каталог, заполняется после загрузки
  const files = new Map();      // файл → распарсенный JSON (редактор правит img здесь)
  const originals = new Map();  // файл → исходный текст (экспорт только изменённого)
  let state = 'loading';        // loading | ok | error
  let loadError = null;

  const stripMarker = k => k.replace(/\s·\d+$/, '');

  // examples: строка | {text, translation} | массив того и другого → массив {text, translation, lang}
  const normalizeExamples = (raw, lang) =>
    (raw == null ? [] : Array.isArray(raw) ? raw : [raw])
      .map(e => typeof e === 'string'
        ? { text: e.trim(), translation: '', lang }
        : { text: String(e?.text || '').trim(), translation: String(e?.translation || '').trim(), lang })
      .filter(e => e.text);

  // img записи → {type:'url'|'emoji', value} | null
  const normalizeImage = v => {
    const s = String(v || '').trim();
    if (!s) return null;
    return /^https?:\/\//i.test(s) ? { type: 'url', value: s } : { type: 'emoji', value: s };
  };

  function build(raw, fileId) {
    const meta = raw._meta || {};
    const entries = Object.entries(raw).filter(([k]) => k !== '_meta');
    const hasIt = entries.some(([, v]) => v.it);
    const hasEn = entries.some(([, v]) => v.en);

    const mkGroup = (lang, id, name, size) => ({
      id,
      lang,
      name,
      icon: meta.icon,
      tag: lang === 'en' ? (meta['tag-en'] ?? meta.tag) : meta.tag,
      desc: lang === 'en' ? (meta['desc-en'] ?? meta.desc) : meta.desc,
      ...(size != null ? { size } : {}),
      words: entries.filter(([, v]) => v[lang]).map(([k, v]) => {
        const b = v[lang];
        return {
          word: b.word,
          transcription: b.transcription || '',
          translation: stripMarker(k),
          examples: normalizeExamples(b.examples, lang),
          image: normalizeImage(v.img),
          src: { file: fileId, key: k }, // запись исходного JSON — для редактора картинок
        };
      }),
    });

    const out = [];
    if (hasIt) out.push(mkGroup('it', meta.id, meta.name, meta.size));
    if (hasEn) {
      // у en-«одиночек» (phrasal, irregular-verbs-en) id и имя заданы в _meta напрямую
      const enId = hasIt ? (meta['id-en'] || `${meta.id}-en`) : meta.id;
      out.push(mkGroup('en', enId, meta['name-en'] || meta.name, meta['size-en'] ?? meta.size));
    }
    return out;
  }

  async function load() {
    try {
      const loaded = await Promise.all(FILES.map(async f => {
        const res = await fetch(`data/${f}.json?t=${Date.now()}`);
        if (!res.ok) throw new Error(`${f}.json → HTTP ${res.status}`);
        const text = await res.text();
        return [f, text, JSON.parse(text)];
      }));
      for (const [f, text, raw] of loaded) {
        files.set(f, raw);
        originals.set(f, text);
        GROUPS.push(...build(raw, f));
      }
      state = 'ok';
    } catch (err) {
      state = 'error';
      loadError = err;
      console.error('Не удалось загрузить наборы слов:', err);
    }
  }

  const ready = load();

  // ---- записи исходных JSON (редактор картинок) ----

  const entryOf = src => (src && files.get(src.file))?.[src.key] || null;
  const imgOf = src => normalizeImage(entryOf(src)?.img);
  // url/эмодзи пишутся в данные (попадают в экспорт), base64 — слишком тяжёлый для JSON
  function setImage(src, image) {
    const e = entryOf(src);
    if (!e) return;
    e.img = image && (image.type === 'url' || image.type === 'emoji') ? image.value : '';
  }

  // изменённые файлы данных: [{ file, json }] — редактор выгружает их в data/
  function changedFiles() {
    const out = [];
    for (const f of FILES) {
      if (!files.has(f)) continue;
      const json = JSON.stringify(files.get(f), null, 2) + '\n';
      if (json !== originals.get(f)) out.push({ file: `${f}.json`, json });
    }
    return out;
  }

  return { ready, FILES, GROUPS, files, get: id => GROUPS.find(g => g.id === id),
           imgOf, setImage, changedFiles, stripMarker,
           get state() { return state; }, get error() { return loadError; } };
})();
