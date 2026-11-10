// Пакетная заливка img в data/*.json: для каждой записи без картинки ищет
// thumbnail первой статьи Википедии (та же логика, что WM.images.fetchImage:
// it-слово → it.wikipedia, en-слово → en.wikipedia; запись со словами обоих
// языков получает одну общую картинку — сначала it, при промахе en).
// Повторный запуск безопасен: записи с непустым img не трогаются, прогресс
// периодически сбрасывается в файлы. Википедия лимитирует частоту — скрипт
// ходит небыстро (пара воркеров с паузами) и замедляется при 429.
// Запуск: node tools/fetch-images.mjs [воркеров=2]
// Картинки форм глаголов («be — was/were — been») не подбираются — как в приложении.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'data');
const WORKERS = Number(process.argv[2] || 2);
const HOST = { it: 'it.wikipedia.org', en: 'en.wikipedia.org' };
const UA = 'WordsMemory-image-builder/1.0 (https://github.com/kebikov95/words-memory; contact: local-user)';

const hasForms = w => String(w).includes(' — '); // карточка форм — картинка не нужна
const sleep = ms => new Promise(r => setTimeout(r, ms));

// пауза между запросами одного воркера; растёт при 429 (общая для всех)
let pauseMs = 600;

async function fetchThumb(word, lang) {
  const url = `https://${HOST[lang]}/w/api.php?action=query&format=json`
    + `&generator=search&gsrsearch=${encodeURIComponent(word)}&gsrlimit=1`
    + `&prop=pageimages&piprop=thumbnail&pithumbsize=480`;
  for (let attempt = 1; attempt <= 5; attempt++) {
    let res;
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10000) });
    } catch {
      await sleep(1500 * attempt);
      continue;
    }
    if (res.status === 429) {
      // лимит частоты: ждём Retry-After (или «на глаз») и притормаживаем на будущее
      const ra = Number(res.headers.get('retry-after')) || 0;
      pauseMs = Math.min(pauseMs + 300, 2500);
      console.log(`  429, пауза ${ra || pauseMs}с, темп → ${pauseMs}мс`);
      await sleep(((ra || Math.ceil(pauseMs / 100)) + 1) * 1000);
      continue;
    }
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
    return pages[0]?.thumbnail?.source || null;
  }
  return null;
}

async function main() {
  const files = fs.readdirSync(DATA).filter(f => f.endsWith('.json'));
  const data = new Map(files.map(f => [f, JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'))]));

  // кеш по уникальным словам (слова повторяются между наборами)
  const cache = new Map();     // 'lang:word' → url | null (null — искали, не нашли)
  let targets = 0, filled = 0, notFound = 0;
  const queue = [];

  for (const f of files) {
    for (const [key, entry] of Object.entries(data.get(f))) {
      if (key === '_meta' || entry.img) continue;
      const words = [];
      if (entry.it?.word && !hasForms(entry.it.word)) words.push({ lang: 'it', word: entry.it.word });
      if (entry.en?.word && !hasForms(entry.en.word)) words.push({ lang: 'en', word: entry.en.word });
      if (!words.length) continue;
      targets++;
      queue.push({ f, key, words });
    }
  }
  console.log(`Записей без картинки: ${targets}`);

  const flush = () => {
    for (const f of files) {
      fs.writeFileSync(path.join(DATA, f), JSON.stringify(data.get(f), null, 2) + '\n');
    }
  };

  let done = 0;
  async function worker() {
    while (queue.length) {
      const job = queue.shift();
      let url = null;
      for (const { lang, word } of job.words) {
        const k = `${lang}:${word.toLowerCase()}`;
        if (!cache.has(k)) {
          await sleep(pauseMs);
          cache.set(k, await fetchThumb(word, lang));
        }
        url = cache.get(k);
        if (url) break; // сначала it-слово, при промахе — en
      }
      if (url) { data.get(job.f)[job.key].img = url; filled++; }
      else notFound++;
      done++;
      if (done % 50 === 0) {
        flush(); // прогресс не теряется при остановке
        console.log(`  ${done}/${targets} · найдено ${filled}, мимо ${notFound}, темп ${pauseMs}мс`);
      }
    }
  }
  await Promise.all(Array.from({ length: WORKERS }, worker));
  flush();

  console.log(`Готово: записей с новой картинкой ${filled}, не найдено ${notFound}`);
}

main();
