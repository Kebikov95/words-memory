// Хранилище: профили, слова, статистика (localStorage, изоляция по пользователю)
window.WM = window.WM || {};

WM.storage = (() => {
  const K_USERS = 'wm_users';
  const K_CURRENT = 'wm_current';
  const kWords = uid => `wm_words_${uid}`;
  const kStats = uid => `wm_stats_${uid}`;

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const genId = () =>
    (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2));

  async function hashPin(pin) {
    const data = new TextEncoder().encode('wm:' + pin);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ---- пользователи ----

  const getUsers = () => read(K_USERS, []);

  async function createUser(name, pin) {
    const users = getUsers();
    if (users.some(u => u.name.toLowerCase() === name.trim().toLowerCase())) {
      throw new Error('Профиль с таким именем уже есть');
    }
    const user = { id: genId(), name: name.trim(), pin: pin ? await hashPin(pin) : null, createdAt: Date.now() };
    users.push(user);
    write(K_USERS, users);
    return user;
  }

  async function verifyPin(user, pin) {
    if (!user.pin) return true;
    return (await hashPin(pin)) === user.pin;
  }

  const currentUserId = () => read(K_CURRENT, null);
  const setCurrentUser = id => write(K_CURRENT, id);
  const clearCurrentUser = () => localStorage.removeItem(K_CURRENT);

  // ---- слова ----

  const getWords = uid => read(kWords(uid), []);
  const setWords = (uid, words) => write(kWords(uid), words);

  function addWord(uid, word) {
    const words = getWords(uid);
    const full = {
      id: genId(),
      lang: 'it',
      word: '',
      transcription: '',
      translation: '',
      examples: [],
      tags: [],
      image: null,          // {type:'url'|'base64'|'emoji', value}
      createdAt: new Date().toISOString().slice(0, 10),
      ...word,
    };
    if (!full.id) full.id = genId();
    words.push(full);
    setWords(uid, words);
    return full;
  }

  function updateWord(uid, id, patch) {
    const words = getWords(uid);
    const i = words.findIndex(w => w.id === id);
    if (i === -1) return null;
    words[i] = { ...words[i], ...patch, id };
    setWords(uid, words);
    return words[i];
  }

  function patchWordField(uid, id, patch) { return updateWord(uid, id, patch); }

  function deleteWord(uid, id) {
    setWords(uid, getWords(uid).filter(w => w.id !== id));
  }

  // импорт с защитой от дублей и конфликтов id
  function importWords(uid, incoming) {
    const words = getWords(uid);
    const norm = w => `${(w.lang || '').toLowerCase()}|${(w.word || '').trim().toLowerCase()}|${(w.translation || '').trim().toLowerCase()}`;
    const existingIds = new Set(words.map(w => w.id));
    const existingNorms = new Set(words.map(norm));
    let added = 0, skipped = 0;

    for (const raw of incoming) {
      if (!raw || !String(raw.word || '').trim()) { skipped++; continue; }
      const lang = raw.lang === 'en' ? 'en' : 'it';
      const item = {
        id: genId(),
        lang,
        word: String(raw.word).trim(),
        transcription: String(raw.transcription || '').trim(),
        translation: String(raw.translation || '').trim(),
        examples: Array.isArray(raw.examples)
          ? raw.examples
              .map(e => ({
                text: String(e?.text || '').trim(),
                translation: String(e?.translation || '').trim(),
                // lang примера: у двуязычных примеров может отличаться от языка слова
                lang: e?.lang === 'en' || e?.lang === 'it' ? e.lang : lang,
              }))
              .filter(e => e.text)
          : [],
        tags: Array.isArray(raw.tags) ? raw.tags.map(t => String(t).trim()).filter(Boolean) : [],
        image: raw.image && ['url', 'base64', 'emoji'].includes(raw.image.type)
          ? raw.image : null,
        createdAt: raw.createdAt || new Date().toISOString().slice(0, 10),
      };
      const key = norm(item);
      if (existingNorms.has(key)) { skipped++; continue; }
      existingNorms.add(key);
      existingIds.add(item.id);
      words.push(item);
      added++;
    }
    setWords(uid, words);
    return { added, skipped };
  }

  // ---- статистика ----

  const getStats = uid => read(kStats(uid), []);

  function addStats(uid, session) {
    const stats = getStats(uid);
    stats.push({ date: new Date().toISOString(), ...session });
    write(kStats(uid), stats.slice(-100));
  }

  // ---- правки слов в готовых наборах (персональные переопределения) ----
  // { [groupId]: { [исходное слово в нижнем регистре]: {word, transcription, translation, examples} } }

  const kOverrides = uid => `wm_group_overrides_${uid}`;
  const getGroupOverrides = uid => read(kOverrides(uid), {});

  function setWordOverride(uid, groupId, origWord, patch) {
    const all = getGroupOverrides(uid);
    const g = all[groupId] || (all[groupId] = {});
    g[String(origWord).trim().toLowerCase()] = patch;
    write(kOverrides(uid), all);
  }

  // ---- пользовательские наборы слов (страница «Группы») ----

  const kGroups = uid => `wm_groups_${uid}`;
  const getUserGroups = uid => read(kGroups(uid), []);

  function addUserGroup(uid, group) {
    const groups = getUserGroups(uid);
    const full = {
      id: genId(),
      lang: 'it',
      icon: '📗',
      name: '',
      desc: '',
      tag: '',
      words: [],
      createdAt: Date.now(),
      ...group,
    };
    groups.push(full);
    write(kGroups(uid), groups);
    return full;
  }

  function updateUserGroup(uid, id, patch) {
    const groups = getUserGroups(uid);
    const g = groups.find(x => x.id === id);
    if (!g) return null;
    Object.assign(g, patch, { id });
    write(kGroups(uid), groups);
    return g;
  }

  return {
    uid: genId, getUsers, createUser, verifyPin,
    currentUserId, setCurrentUser, clearCurrentUser,
    getWords, setWords, addWord, updateWord, patchWordField, deleteWord, importWords,
    getStats, addStats,
    getUserGroups, addUserGroup, updateUserGroup,
    getGroupOverrides, setWordOverride,
  };
})();
