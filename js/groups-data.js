// Загрузчик каталога готовых наборов: собирает группы из файлов данных
// WM.DATA_IT (js/data-it.js) и WM.DATA_EN (js/data-en.js), подключаемых
// в index.html ДО этого файла. Здесь только парсинг и порядок каталога.
// Формат строки слов — см. заголовок data-файлов:
//   слово|транскрипция (МФА)|перевод|пример на языке набора|пример на втором языке|перевод примера на русский
window.WM = window.WM || {};

WM.groupsData = (() => {
  const list = (str, lang) => {
    const other = lang === 'it' ? 'en' : 'it';
    return str.trim().split('\n').map(line => {
      const f = line.split('|').map(x => x.trim());
      // 6 полей — с транскрипцией; 5 — старый формат без неё
      const [word, ipa, translation, exA, exB, exRu] =
        f.length >= 6 ? f : [f[0], '', ...f.slice(1)];
      const examples = [];
      if (exA) examples.push({ text: exA, translation: exRu || '', lang });
      if (exB) examples.push({ text: exB, translation: exRu || '', lang: other });
      return { word, transcription: ipa, translation: translation || '', examples };
    }).filter(x => x.word);
  };

  const build = (data, lang) => (data || []).map(g => ({
    ...g,
    lang,
    words: list(g.words, lang),
  }));

  const GROUPS = [...build(WM.DATA_IT, 'it'), ...build(WM.DATA_EN, 'en')];

  // итальянские и английские карточки идут парами в одном порядке
  const ORDER = [
    'top-verbs', 'key-verbs', 'top-verbs-en', 'irregular-verbs-en',
    'top-words', 'top-words-en',
    'top-300', 'top-300-en',
    'top-1000', 'top-1000-en',
    'food', 'food-en',
    'clothes', 'clothes-en',
    'body', 'body-en',
    'phrasal',
    'proverbs', 'proverbs-en',
    'business', 'business-en',
    'it', 'it-en',
    'travel', 'travel-en',
    'finance', 'finance-en',
    'adjectives', 'adjectives-en',
    'colors', 'colors-en',
    'numbers', 'numbers-en',
    'sport', 'sport-en',
  ];
  GROUPS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

  const get = id => GROUPS.find(g => g.id === id);

  return { GROUPS, get };
})();
