// Общая фикстура: моки сети и TTS + сиды профиля/словаря + открытая страница приложения.
import { test as base, expect, type Page } from '@playwright/test';
import { SEED_WORDS_IT, toStorageWord, uniqueName, type SeedWord } from '../helpers/app';

export { expect };


/** Миниатюра-заглушка: SVG data-URL со словом внутри (рендерится без сети). */
const thumbFor = (word: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320">` +
    `<rect width="100%" height="100%" fill="#8a8f98"/>` +
    `<text x="50%" y="52%" fill="#fff" font-size="48" text-anchor="middle" dominant-baseline="central">${word}</text></svg>`)}`;

/** Моки внешнего мира: Википедия (детерминированные миниатюры) и шрифты. Ни одного реального запроса.
 *  Важно: только regex-маршруты — Playwright-глобы со звёздочкой в середине URL не матчатся на http://127.0.0.1. */
async function mockNetwork(page: Page) {
  // шрифты — не нужны в тестах
  await page.route(/fonts\.googleapis\.com\//, route => route.abort());
  await page.route(/fonts\.gstatic\.com\//, route => route.abort());

  // API Википедии: по gsrsearch отдаём детерминированную миниатюру-заглушку.
  // Это data-URL со словом внутри — картинка рендерится без сетевого запроса,
  // поэтому тест не зависит от загрузки изображений.
  // Слово «__нет статьи__» имитирует отсутствие страницы → фолбэк-эмодзи
  await page.route(/wikipedia\.org\/w\/api\.php/, route => {
    const url = new URL(route.request().url());
    const word = url.searchParams.get('gsrsearch') ?? '';
    if (word === '__нет статьи__') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ query: { pages: {} } }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        query: {
          pages: { 100: { title: word, thumbnail: { source: thumbFor(word), width: 480, height: 320 } } },
        },
      }),
    });
  });
}

/** Стаб Web Speech API: фиксированные голоса it-IT/en-US, запись вызовов в window.__ttsCalls. */
async function stubTts(page: Page) {
  await page.addInitScript(() => {
    const calls: { text: string; lang: string }[] = [];
    (window as any).__ttsCalls = calls;

    const voices = [
      { name: 'Google italiano', lang: 'it-IT', localService: false, default: true },
      { name: 'Google US English', lang: 'en-US', localService: false, default: false },
    ];

    const synth = {
      pending: false,
      speaking: false,
      paused: false,
      onvoiceschanged: null as null,
      addEventListener(type: string, fn: (ev: Event) => void) {
        if (type === 'voiceschanged') (this as any).onvoiceschanged = fn;
      },
      removeEventListener() {},
      dispatchEvent() { return true; },
      getVoices() { return voices; },
      speak(u: any) {
        calls.push({ text: u.text, lang: u.lang });
        // onend асинхронно — иначе цепочки фраз и режим «Диктант» не продолжаются
        setTimeout(() => u.onend?.(), 5);
      },
      cancel() {},
      pause() {},
      resume() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: synth });

    class FakeUtterance {
      text: string;
      lang = '';
      voice: any = null;
      rate = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) { this.text = text; }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: FakeUtterance });
  });
}

export type AppOptions = {
  /** Имя профиля. По умолчанию — уникальное. */
  profileName?: string;
  /** Слова словаря, засеянные до старта приложения. */
  words?: SeedWord[];
};

/** Сид профиля и словаря: выполняется до подключения скриптов приложения. */
function seed(page: Page, profileName: string, words: SeedWord[]) {
  const wordList = words.map(toStorageWord);
  page.addInitScript(({ name, list }) => {
    const uid = 'uid-e2e';
    localStorage.setItem('wm_users', JSON.stringify([
      { id: uid, name, pin: null, createdAt: 0 },
    ]));
    // wm_current читается через JSON.parse — храним как JSON-строку
    localStorage.setItem('wm_current', JSON.stringify(uid));
    localStorage.setItem(`wm_words_${uid}`, JSON.stringify(list));
  }, { name: profileName, list: wordList });
  return wordList.length;
}

export const test = base.extend<{ appPage: Page; appOptions: AppOptions; profileName: string }>({
  appOptions: [{ words: [] }, { option: true }],

  profileName: [async ({ appOptions }, use) => {
    await use(appOptions.profileName ?? uniqueName('Тестер'));
  }, { option: true }],

  appPage: async ({ page, appOptions, profileName }, use) => {
    await mockNetwork(page);
    await stubTts(page);
    seed(page, profileName, appOptions.words ?? []);
    await page.goto('/');
    await expect(page.locator('#view-app')).toBeVisible({ timeout: 10_000 });
    await use(page);
  },
});

/** Сид пяти итальянских слов — стандартный пул для тренировок. */
export const testWithWords = test.extend<{ appOptions: AppOptions }>({
  appOptions: { words: SEED_WORDS_IT },
});
