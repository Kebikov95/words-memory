// Движок интервального повторения (SRS).
// Лестница интервалов основана на кривой забывания Эббингауза и упрощённом
// SM-2/Leitner: успех → шаг вверх, ошибка → возврат на первый интервал.
// Слово считается выученным после верного ответа на шаге «16 д» и дальше
// (шаги-месяцы — закрепление) и больше не попадает в буфер повторения.
// Состояние: localStorage wm_srs_<uid> → { "<lang>:<слово>": { s, due, done } }
window.WM = window.WM || {};

WM.srs = (() => {
  // s — индекс шага, due — timestamp следующего показа, done — выучено
  const LADDER = [
    { ms: 15 * 60 * 1000,        label: '15 мин' },
    { ms: 60 * 60 * 1000,        label: '1 ч' },
    { ms: 8 * 60 * 60 * 1000,    label: '8 ч' },
    { ms: 24 * 60 * 60 * 1000,   label: '1 д' },
    { ms: 2 * 24 * 60 * 60 * 1000,  label: '2 д' },
    { ms: 4 * 24 * 60 * 60 * 1000,  label: '4 д' },
    { ms: 8 * 24 * 60 * 60 * 1000,  label: '8 д' },
    { ms: 16 * 24 * 60 * 60 * 1000, label: '16 д' },
    { ms: 30 * 24 * 60 * 60 * 1000,  label: '1 мес' },
    { ms: 90 * 24 * 60 * 60 * 1000,  label: '3 мес' },
    { ms: 180 * 24 * 60 * 60 * 1000, label: '6 мес' },
    { ms: 365 * 24 * 60 * 60 * 1000, label: '12 мес' },
  ];

  // выучено = верный ответ на этом шаге или дальше (16 д)
  const LEARNED_AT = 7;

  const key = (lang, word) => `${lang}:${(word || '').trim().toLowerCase()}`;

  const storeKey = () => `wm_srs_${WM.app.state.uid}`;

  const read = () => { try { return JSON.parse(localStorage.getItem(storeKey())) || {}; } catch { return {}; } };
  const write = data => {
    try { localStorage.setItem(storeKey(), JSON.stringify(data)); }
    catch { /* переполнение localStorage — не критично */ }
  };

  // запись слова: существующая или «новое» (доступно сразу, шаг 0)
  function entry(lang, word) {
    const data = read();
    return data[key(lang, word)] || { s: 0, due: 0, done: false };
  }

  // верный ответ: шаг вверх; на шаге LEARNED_AT и дальше — слово выучено
  function correct(lang, word) {
    const data = read();
    const k = key(lang, word);
    const e = data[k] || { s: 0, due: 0, done: false };
    e.s += 1;
    if (e.s > LEARNED_AT) {
      e.done = true;
      e.due = 0;
    } else {
      e.due = Date.now() + LADDER[e.s].ms;
    }
    data[k] = e;
    write(data);
    return e;
  }

  // ошибка: слово возвращается на первый интервал (15 мин)
  function wrong(lang, word) {
    const data = read();
    const k = key(lang, word);
    data[k] = { s: 0, due: Date.now() + LADDER[0].ms, done: false };
    write(data);
    return data[k];
  }

  // ручной сброс прогресса слова (крестик в списке статусов)
  function reset(lang, word) {
    const data = read();
    delete data[key(lang, word)];
    write(data);
  }

  const isLearned = (lang, word) => !!entry(lang, word).done;
  const isKnown = (lang, word) => {
    const e = entry(lang, word);
    return e.done || e.s > 0 || e.due > 0;
  };

  // текст статуса для списка: '15 мин' … '16 д', '1 мес' …, '✅ выучено', '—'
  function statusLabel(lang, word) {
    const e = entry(lang, word);
    if (e.done) return '✅ выучено';
    if (e.s === 0 && e.due === 0) return '— не начато';
    if (e.due <= Date.now()) return '⏳ пора повторить';
    return `📅 ${LADDER[e.s].label}`;
  }

  // слова, готовые к показу сейчас: не выученные и с наступившим сроком
  function dueOf(entries) {
    const data = read();
    const now = Date.now();
    return entries.filter(e => {
      const st = data[e.key];
      return !st?.done && (st?.due ?? 0) <= now;
    });
  }

  return { LADDER, LEARNED_AT, key, entry, correct, wrong, reset,
           isLearned, isKnown, statusLabel, dueOf };
})();
