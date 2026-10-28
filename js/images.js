// Картинки: автоподбор через открытый API Википедии (без ключа) + эмодзи-фолбэк
window.WM = window.WM || {};

WM.images = (() => {
  const WIKI = { it: 'it.wikipedia.org', en: 'en.wikipedia.org' };

  const EMOJI_BY_TAG = {
    'еда': '🍝', 'еда ': '🍽️', 'напитки': '☕', 'фрукты': '🍎', 'овощи': '🥕',
    'животные': '🐾', 'глаголы': '🏃', 'путешествия': '✈️', 'город': '🏙️',
    'дом': '🏠', 'семья': '👨‍👩‍👧', 'работа': '💼', 'искусство': '🎨',
    'спорт': '⚽', 'футбол': '⚽', 'числа': '🔢', 'время': '⏰', 'погода': '🌤️',
    'тело': '🖐️', 'части тела': '🖐️', 'одежда': '👕', 'транспорт': '🚗',
    'природа': '🌿', 'цвета': '🎨', 'эмоции': '🙂', 'учёба': '📖', 'музыка': '🎵',
    'частотные': '⭐', 'топ-1000': '📈', 'топ-3000': '🏔️', 'фразовые глаголы': '🔗',
    'пословицы': '💬', 'ИТ': '💻', 'финансы': '💰', 'прилагательные': '📏',
    'цифры': '🔢', 'бизнес': '💼',
  };

  function emojiForWord(word, tags = []) {
    for (const t of tags) {
      const e = EMOJI_BY_TAG[String(t).toLowerCase().trim()];
      if (e) return e;
    }
    const w = String(word).toLowerCase();
    if (/calcio|football|soccer|partita/.test(w)) return '⚽';
    if (/pizza|pasta|risotto/.test(w)) return '🍝';
    return '📘';
  }

  // ищет первую картинку статьи по слову в соответствующей Википедии
  async function fetchImage(word, lang = 'it') {
    const host = WIKI[lang] || WIKI.en;
    const url = `https://${host}/w/api.php?action=query&format=json&origin=*` +
      `&generator=search&gsrsearch=${encodeURIComponent(word)}&gsrlimit=3` +
      `&prop=pageimages&piprop=thumbnail&pithumbsize=480`;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) return null;
      const data = await res.json();
      const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
      for (const p of pages) {
        if (p.thumbnail?.source) return p.thumbnail.source;
      }
    } catch { /* сеть недоступна или ничего не нашли */ }
    return null;
  }

  // HTML картинки для карточки: base64 → url (с фолбэком) → эмодзи
  function renderPreview(image, word, tags, cls = 'word-img') {
    const emoji = image?.type === 'emoji' ? image.value : emojiForWord(word, tags);
    if (image?.type === 'base64') {
      return `<div class="${cls}"><img src="${image.value}" alt=""></div>`;
    }
    if (image?.type === 'url') {
      return `<div class="${cls}"><img src="${image.value}" alt="" loading="lazy"
        onerror="this.parentElement.textContent='${emoji}'"></div>`;
    }
    return `<div class="${cls}">${emoji}</div>`;
  }

  function imageToBase64(file, maxSize = 400) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Это не изображение'));
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  return { emojiForWord, fetchImage, renderPreview, imageToBase64 };
})();
