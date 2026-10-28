// Озвучка: Web Speech API. В Chromium — голоса Google (встроенные «compact»-
// голоса macOS там искажаются: глухой тембр и ускоренный темп), в Safari —
// лучшие локальные голоса Apple
window.WM = window.WM || {};

WM.tts = (() => {
  let voices = [];
  let warned = false;
  let chainToken = 0;

  const CHROMIUM = /Chrom|Edg\//.test(navigator.userAgent);
  const exact = lang => (lang === 'it' ? 'it-it' : 'en-us');

  function refreshVoices() { voices = speechSynthesis.getVoices(); }

  function init() {
    refreshVoices();
    speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
  }

  // роботизированные и «шутливые» голоса macOS — звучат глухо и неестественно
  const BAD = /eloquence|novelty|whisper|bells|organ|cello|zarvox|trinoids|albert|bad news|good news|jester|wobble|hysterical|boing|bubbles|bahh|deranged|funny|superstar|eddy|fred|flo|rocko|reed|sandy|shelley|grandma|grandpa|ralph|junior|aaron|agnes|kathy/i;

  const normLang = v => v.lang.toLowerCase().replace('_', '-');

  function pickVoice(lang) {
    const prefix = lang === 'it' ? 'it' : 'en';
    const ok = voices.filter(v =>
      normLang(v).startsWith(prefix) && !BAD.test(v.name.toLowerCase()));
    if (!ok.length) return null;

    if (CHROMIUM) {
      const google = ok.find(v => /^google/i.test(v.name));
      if (google) return google;
    }

    const score = v => {
      let s = 0;
      const n = v.name.toLowerCase();
      if (normLang(v) === exact(lang)) s += 2;
      if (/enhanced|premium/.test(n)) s += 4;   // чистое звучание
      if (/alice|samantha|daniel|karen|moira|tessa/.test(n)) s += 1;
      if (v.localService) s += 1;
      return s;
    };
    return ok.sort((a, b) => score(b) - score(a))[0];
  }

  // имя выбранного голоса — для диагностики в статистике
  const currentVoice = lang => pickVoice(lang)?.name || null;

  function makeUtterance(text, lang) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = exact(lang);
    const v = pickVoice(lang);
    if (v) u.voice = v;
    return u;
  }

  function stop() {
    chainToken++; // прерывает идущую цепочку фраз
    speechSynthesis.cancel();
  }

  function speak(text, lang = 'it') {
    if (!text || !('speechSynthesis' in window)) return;
    refreshVoices(); // голоса могли догрузиться после старта страницы
    stop();
    const u = makeUtterance(text, lang);
    if (!u.voice && voices.length && !warned) {
      warned = true;
      WM.app?.toast?.(`Системный голос для языка «${lang}» не найден — озвучка может звучать неточно`);
    }
    // без паузы после cancel движок иногда стартует фразу с искажениями
    setTimeout(() => speechSynthesis.speak(u), 60);
  }

  // слово, затем примеры — строго по очереди: в Chromium фразы из общей
  // очереди проигрываются с ускорением, поэтому запускаем следующую
  // только после onend предыдущей
  function speakSequence(items) {
    if (!Array.isArray(items)) items = [items];
    items = items.filter(it => it?.text);
    if (!items.length) return;
    refreshVoices();
    stop();
    const token = chainToken;
    let i = 0;
    const step = () => {
      if (token !== chainToken) return;
      const u = makeUtterance(items[i].text, items[i].lang);
      const next = () => {
        if (token === chainToken && ++i < items.length) setTimeout(step, 30);
      };
      u.onend = next;
      u.onerror = next;
      speechSynthesis.speak(u);
    };
    setTimeout(step, 60);
  }

  const supported = () => 'speechSynthesis' in window;

  return { init, speak, speakSequence, supported, currentVoice };
})();
