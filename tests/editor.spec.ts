// Редактор картинок: открытие из меню аватара при наведении, каталог всех
// групп с раскрытием, «Другая» и «Убрать» применяются к слову и его тёзкам
// в другом языке, кеш групп обновляется.
import { expect, test } from './fixtures/app';
import type { Page } from '@playwright/test';
import type { SeedWord } from './helpers/app';

const seeds: SeedWord[] = [
  { id: 'w1', word: 'pasta', translation: 'паста', lang: 'it', tags: ['еда'] },
  { id: 'w2', word: 'pasta', translation: 'pasta', lang: 'en', tags: ['еда'] },
];

test.use({ appOptions: { words: seeds } });

async function openEditor(page: Page) {
  await page.locator('#btn-profile').hover();
  await expect(page.locator('#menu-images')).toBeVisible();
  await page.locator('#menu-images').click();
  await expect(page.locator('#page-images')).toBeVisible();
}

test('каталог: общие группы первыми, затем 🇬🇧 и 🇮🇹; группа раскрывается', async ({ appPage: page }) => {
  await openEditor(page);

  // порядок секций: общие → 🇬🇧 → 🇮🇹
  const common = await page.locator('.ed-flag-head', { hasText: 'Общие группы' }).boundingBox();
  const enHead = await page.locator('.ed-flag-head', { hasText: 'Только английские' }).boundingBox();
  const itHead = await page.locator('.ed-flag-head', { hasText: 'Только итальянские' }).boundingBox();
  expect(common!.y).toBeLessThan(enHead!.y);
  expect(enHead!.y).toBeLessThan(itHead!.y);

  // блок = файл data/*.json: «Цвета» и «Пословицы» содержат слова обоих
  // языков и потому общие — по одному блоку с флагами 🇮🇹🇬🇧
  await expect(page.locator('.ed-g-name', { hasText: 'Цвета' })).toHaveCount(1);
  await expect(page.locator('.ed-g-name', { hasText: 'Пословицы' })).toHaveCount(1);

  // общая группа «Еда» свёрнута по умолчанию и раскрывается кликом
  const food = page.locator('.ed-g-block', { hasText: 'Еда' });
  await expect(food.locator('.ed-g-body')).toBeHidden();
  await food.locator('.ed-g-head').click();
  await expect(food.locator('.ed-g-body')).toBeVisible();

  // pasta — общее слово пары: одна строка с двумя флагами
  const pasta = food.locator('.ed-row[data-w="pasta"]');
  await expect(pasta).toHaveCount(1);
  await expect(pasta).toContainText('🇮🇹');
  await expect(pasta).toContainText('🇬🇧');
});

test('«Другая» пишет картинку в словарь (оба языка) и в постоянный кеш групп', async ({ appPage: page }) => {
  await openEditor(page);
  const food = page.locator('.ed-g-block', { hasText: 'Еда' });
  await food.locator('.ed-g-head').click();
  await food.locator('.ed-row[data-w="pasta"] [data-ed="next"]').click();

  // обе «пасты» словаря получили картинку (стаб возвращает data-URL со словом)
  await expect.poll(async () => page.evaluate(() => {
    const words = JSON.parse(localStorage.getItem('wm_words_uid-e2e')!);
    return words.filter((w: { word: string }) => w.word === 'pasta')
      .every((w: { image?: { type: string; value: string } }) =>
        w.image?.type === 'url' && w.image.value.includes('pasta'));
  })).toBe(true);

  // кеш групп обновлён для обоих языков
  const cache = await page.evaluate(() => JSON.parse(localStorage.getItem('wm_group_images')!));
  expect(cache['it:pasta']).toBeTruthy();
  expect(cache['en:pasta']).toBeTruthy();

  const pasta = food.locator('.ed-row[data-w="pasta"]');
  await expect(pasta.locator('.ed-img img')).toBeVisible();
  await expect(pasta.locator('.ed-state')).toHaveText('из Википедии');
});

test('«Убрать» снимает картинку и из словаря, и из кеша групп', async ({ appPage: page }) => {
  await openEditor(page);
  const food = page.locator('.ed-g-block', { hasText: 'Еда' });
  await food.locator('.ed-g-head').click();
  await food.locator('.ed-row[data-w="pasta"] [data-ed="next"]').click();
  await expect(food.locator('.ed-row[data-w="pasta"] .ed-img img')).toBeVisible();

  await food.locator('.ed-row[data-w="pasta"] [data-ed="remove"]').click();
  await expect.poll(async () => page.evaluate(() => {
    const words = JSON.parse(localStorage.getItem('wm_words_uid-e2e')!);
    return words.filter((w: { word: string }) => w.word === 'pasta')
      .every((w: { image: unknown }) => w.image === null);
  })).toBe(true);

  const cache = await page.evaluate(() => JSON.parse(localStorage.getItem('wm_group_images')!));
  // «Убрать» пишет постоянную пометку «нет картинки» — она перекрывает img из data/*.json
  expect(cache['it:pasta']).toEqual({ type: 'none' });
  expect(cache['en:pasta']).toEqual({ type: 'none' });

  // превью снова эмодзи-заглушка (у «pasta» — 🍝 по тегу «еда»)
  await expect(food.locator('.ed-row[data-w="pasta"] .ed-img img')).toHaveCount(0);
  await expect(food.locator('.ed-row[data-w="pasta"] .ed-img')).toContainText('🍝');
});

test('зеркальная пара («Цвета»): одна строка с обоими словами, картинка для обоих языков', async ({ appPage: page }) => {
  await openEditor(page);
  const colors = page.locator('.ed-g-block', { hasText: 'Цвета' });
  await expect(colors).toHaveCount(1);
  await colors.locator('.ed-g-head').click();

  // rosso/red — разные слова одного смысла: одна строка, оба флага и оба слова
  const row = colors.locator('.ed-row[data-w="rosso"]');
  await expect(row).toHaveCount(1);
  await expect(row).toContainText('rosso');
  await expect(row).toContainText('red');
  await expect(row).toContainText('🇮🇹');
  await expect(row).toContainText('🇬🇧');

  await row.locator('[data-ed="next"]').click();

  // картинка записана в кеш для обоих языков (it:rosso и en:red)
  await expect.poll(async () => page.evaluate(() => {
    const c = JSON.parse(localStorage.getItem('wm_group_images') ?? 'null');
    return !!(c && c['it:rosso'] && c['en:red']);
  })).toBe(true);
  const cache = await page.evaluate(() => JSON.parse(localStorage.getItem('wm_group_images')));
  expect(cache['it:rosso'].type).toBe('url');
  expect(cache['en:red'].type).toBe('url');
  await expect(row.locator('.ed-img img')).toBeVisible();
});
