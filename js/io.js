// Импорт/экспорт словаря в JSON
window.WM = window.WM || {};

WM.io = (() => {

  function exportJSON(user, words, langLabel) {
    const payload = {
      app: 'wordsMemory',
      version: 1,
      exportedAt: new Date().toISOString(),
      user: user.name,
      lang: langLabel,
      count: words.length,
      words,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `wordsmemory-${user.name.replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  async function importJSON(file, uid) {
    const text = await file.text();
    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error('Файл не является корректным JSON'); }

    const incoming = Array.isArray(data) ? data : data.words;
    if (!Array.isArray(incoming)) {
      throw new Error('В файле нет массива слов (ожидался { "words": [...] })');
    }
    return WM.storage.importWords(uid, incoming);
  }

  return { exportJSON, importJSON };
})();
