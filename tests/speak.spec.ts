// Режим «Скажи слово»: произношение перевода через SpeechRecognition.
// Стаб распознавания в fixtures/app.ts читает window.__speakScript — очередь
// «сказанных» фраз; без сети и реального микрофона.
import { test, expect, testWithWords } from './fixtures/app';
import { SEED_WORDS_IT } from './helpers/app';
import { waitForSpokenWord } from './helpers/games';

// пул перемешивается — текущее слово берём из карточки (перевод → сид-слово)
const currentSeed = async (page: any) => {
  const tr = await page.locator('.game-word').textContent();
  return SEED_WORDS_IT.find(w => w.translation === tr.trim())!;
};

const startSpeakSession = async (page: any) => {
  await page.getByRole('button', { name: /Тренировка/ }).click();
  await page.locator('.mode-item', { hasText: 'Скажи слово' }).locator('input').check();
  await page.getByRole('button', { name: /Начать/ }).click();
  try {
    await expect(page.locator('#view-game')).toBeVisible({ timeout: 3000 });
  } catch (e) {
    const dbg = await page.evaluate(() => ({
      toast: document.getElementById('toast')?.textContent,
      available: document.getElementById('train-available')?.textContent,
      modeChecked: document.querySelector('input[name="train-mode"]:checked')?.value,
      modalOpen: document.getElementById('modal-train')?.open,
      words: JSON.parse(localStorage.getItem('wm_words_uid-e2e') || '[]').length,
      sr: !!(window as any).SpeechRecognition,
    }));
    throw new Error('SESSION DID NOT START: ' + JSON.stringify(dbg));
  }
};

test.describe('Скажи слово — модалка', () => {
  testWithWords('режим есть в списке (6 режимов) и выбирается', async ({ appPage: page }) => {
    await page.locator('#btn-train').click();
    await expect(page.locator('#train-modes .mode-item')).toHaveCount(6);
    await expect(page.locator('.mode-item', { hasText: 'Скажи слово' })).toBeVisible();
    await page.locator('.mode-item', { hasText: 'Скажи слово' }).click();
    await page.locator('#btn-train-start').click();
    await expect(page.locator('#view-game')).toBeVisible();
    // показан русский перевод
    await expect(page.locator('.game-word')).not.toBeEmpty();
    await expect(page.locator('#sp-mic')).toBeVisible();
  });
});

test.describe('Скажи слово — сессия (сид: mela, casa, sole, vino, pane)', () => {

  testWithWords('верное произношение: «сказал» целевое слово — засчитано, слово озвучено', async ({ appPage: page }) => {
    await startSpeakSession(page);
    const seed = await currentSeed(page);
    await page.evaluate((w: string) => { (window as any).__speakScript = [w]; }, seed.word);
    await page.locator('#sp-mic').click();
    await expect(page.locator('#game-feedback')).toContainText(`✓ Верно · ${seed.word} — ${seed.translation}`);
    await expect(page.locator('.game-counter')).toHaveText('1 / 5');
    // слово озвучивается после ответа
    await waitForSpokenWord(page, 1);
  });

  testWithWords('терпимое сравнение: слово с лишним словом распознаётся как верное', async ({ appPage: page }) => {
    await startSpeakSession(page);
    const seed = await currentSeed(page);
    await page.evaluate((w: string) => { (window as any).__speakScript = ['la ' + w]; }, seed.word);
    await page.locator('#sp-mic').click();
    await expect(page.locator('#game-feedback')).toContainText('✓ Верно');
  });

  testWithWords('неверное произношение: фидбек с тем, что «вы сказали»', async ({ appPage: page }) => {
    await startSpeakSession(page);
    const seed = await currentSeed(page);
    await page.evaluate(() => { (window as any).__speakScript = ['tavolo']; });
    await page.locator('#sp-mic').click();
    await expect(page.locator('#game-feedback')).toContainText(`✗ Правильно: ${seed.word} — ${seed.translation}`);
    await expect(page.locator('#game-feedback')).toContainText('вы сказали: «tavolo»');
    await expect(page.locator('.game-counter')).toHaveText('1 / 5');
  });

  testWithWords('пропуск: засчитывается как ошибка и идёт дальше', async ({ appPage: page }) => {
    await startSpeakSession(page);
    const seed = await currentSeed(page);
    await page.locator('#sp-skip').click();
    await expect(page.locator('#game-feedback')).toContainText(`✗ Правильно: ${seed.word} — ${seed.translation}`);
    await expect(page.locator('.game-counter')).toHaveText('1 / 5');
    await waitForSpokenWord(page, 1);
  });

  testWithWords('браузер без SpeechRecognition: подсказка вместо микрофона', async ({ appPage: page }) => {
    // удаляем API на живой странице: games.js проверяет поддержку при отрисовке карточки
    await page.evaluate(() => {
      delete (window as any).SpeechRecognition;
      delete (window as any).webkitSpeechRecognition;
    });
    await startSpeakSession(page);
    await expect(page.locator('#sp-mic')).toHaveCount(0);
    await expect(page.locator('.speak-state')).toContainText('не поддерживается');
    await page.locator('#sp-skip').click();
    await expect(page.locator('#game-feedback')).toContainText('✗ Правильно');
  });
});
