// Игры: настройка, 5 режимов, экран результатов, статистика.
import { expect, test, testWithWords } from './fixtures/app';
import {
  expectCounter,
  matchPair,
  matchWrong,
  solveAllTasks,
  solveAssemble,
  solveDictation,
  solveMatchPairs,
  waitForAssembleWord,
  waitForSpokenWord,
  type SeedEntry,
} from './helpers/games';
import { SEED_WORDS_IT } from './helpers/app';
import { resolveConfirm } from './helpers/actions';

function openTrainModal(page: import('@playwright/test').Page) {
  return page.getByRole('button', { name: /Тренировка/ }).click();
}

function selectMode(page: import('@playwright/test').Page, modeName: string) {
  return page.locator('.mode-item', { hasText: modeName }).click();
}

async function start(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Начать/ }).click();
  await expect(page.locator('#view-game')).toBeVisible();
}

test.describe('Игры — настройка', () => {
  testWithWords('модалка: 5 режимов, выбор количества слов, доступность пула', async ({ appPage: page }) => {
    await openTrainModal(page);
    await expect(page.locator('.mode-item')).toHaveCount(5);
    for (const name of ['Собери слово', 'Диктант', 'Слово ↔ перевод', 'Картинка ↔ перевод', 'Микс']) {
      await expect(page.locator('.mode-item', { hasText: name })).toBeVisible();
    }
    await expect(page.locator('#train-available')).toContainText('Доступно слов: 5');
    await expect(page.locator('#train-count')).toHaveValue('10');
    await page.locator('#train-count').selectOption('5');
    await expect(page.locator('#train-available')).toContainText('Доступно слов: 5');
  });

  test('пустой словарь — настройка предупреждает и старт блокируется', async ({ appPage: page }) => {
    await openTrainModal(page);
    await expect(page.locator('#train-available')).toContainText('Нет слов для тренировки');
    await page.getByRole('button', { name: /Начать/ }).click();
    await expect(page.locator('#toast')).toContainText('Нет слов для тренировки');
    await expect(page.locator('#view-game')).not.toBeVisible();
  });
});

test.describe('Игры — Собери слово', () => {
  testWithWords('верная сборка: 5/5, без ошибок', async ({ appPage: page }) => {
    await openTrainModal(page);
    await page.locator('#train-count').selectOption('5');
    await start(page);

    // синхронизация по пулу: буквы плиток однозначно задают текущее слово
    const seeds: SeedEntry[] = SEED_WORDS_IT.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
    for (let done = 0; done < 5; done++) {
      const seed = await waitForAssembleWord(page, seeds, done, 5);
      await solveAssemble(page, seed.word, true);
    }
    await expect(page.locator('#res-percent')).toHaveText('100%');
    await expect(page.locator('#res-line')).toHaveText('Верно 5 из 5');
    await expect(page.locator('#res-mistakes')).toContainText('Без ошибок');
  });

  testWithWords('неверная сборка фиксируется в ошибках', async ({ appPage: page }) => {
    await openTrainModal(page);
    await page.locator('#train-count').selectOption('5');
    await start(page);

    const seeds: SeedEntry[] = SEED_WORDS_IT.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
    // первое задание собираем неверно (реверс), остальные — верно
    const first = (await waitForAssembleWord(page, seeds, 0, 5)).word;
    await solveAssemble(page, first, false);
    await expect(page.locator('#game-feedback')).toContainText('Правильно:');
    await solveAllTasks(page, seeds, 5);
    await expect(page.locator('#res-percent')).toHaveText('80%');
    await expect(page.locator('.mistake-row')).toHaveCount(1);
    await expect(page.locator('.mistake-row .mw')).toHaveText(first);
  });
});

test.describe('Игры — Диктант', () => {
  testWithWords('озвучка через стаб TTS, верный и неверный ввод', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Диктант');
    await page.locator('#train-count').selectOption('5');
    await start(page);

    // первое слово — с ошибкой, остальные — верно;
    // каждое задание озвучивается ровно один раз: ждём новую озвучку по счёту вызовов
    let seen = 0;
    let firstSpoken = '';
    for (let done = 0; done < 5; done++) {
      await expectCounter(page, done, 5);
      const spoken = await waitForSpokenWord(page, ++seen);
      if (done === 0) firstSpoken = spoken;
      await solveDictation(page, done === 0 ? 'zzz' : spoken);
    }
    await expect(page.locator('#res-percent')).toHaveText('80%');
    await expect(page.locator('.mistake-row .mw')).toHaveText(firstSpoken);

    // слово озвучено стабом: минимум 5 вызовов (по одному на задание)
    const calls = await page.evaluate(() => (window as any).__ttsCalls.length);
    expect(calls).toBeGreaterThanOrEqual(5);
  });
});

test.describe('Игры — сопоставления', () => {
  testWithWords('Слово ↔ перевод: все пары верны', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Слово ↔ перевод');
    await page.locator('#train-count').selectOption('5');
    await start(page);
    const pairs = [
      { id: 'w1' }, { id: 'w2' }, { id: 'w3' }, { id: 'w4' }, { id: 'w5' },
    ];
    for (const p of pairs) await matchPair(page, p.id);
    await expect(page.locator('#res-percent')).toHaveText('100%');
  });

  testWithWords('Слово ↔ перевод: неверная пара → ошибка', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Слово ↔ перевод');
    await page.locator('#train-count').selectOption('5');
    await start(page);
    await matchWrong(page, 'w1', 'w2');
    await matchPair(page, 'w1');
    await matchPair(page, 'w2');
    await matchPair(page, 'w3');
    await matchPair(page, 'w4');
    await matchPair(page, 'w5');
    await expect(page.locator('#res-percent')).toHaveText('80%');
    await expect(page.locator('.mistake-row .mw')).toHaveText('mela');
  });

  testWithWords('Картинка ↔ перевод: пары по эмодзи-заглушкам', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Картинка ↔ перевод');
    await page.locator('#train-count').selectOption('5');
    await start(page);
    // сетка показывает чанки по 4 пары — решаем все чанки по id
    await solveMatchPairs(['w1', 'w2', 'w3', 'w4', 'w5']);
    await expect(page.locator('#res-percent')).toHaveText('100%');
  });
});

test.describe('Игры — Микс и результаты', () => {
  testWithWords('Микс: задания всех типов, включая квиз', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Микс');
    await page.locator('#train-count').selectOption('5');
    await start(page);
    const seeds: SeedEntry[] = SEED_WORDS_IT.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
    await solveAllTasks(page, seeds, 5);
    await expect(page.locator('#res-percent')).toHaveText('100%');
  });

  testWithWords('результаты: «Пройти ещё раз» и выход', async ({ appPage: page }) => {
    await openTrainModal(page);
    await page.locator('#train-count').selectOption('5');
    await start(page);
    const seeds: SeedEntry[] = SEED_WORDS_IT.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
    for (let done = 0; done < 5; done++) {
      const seed = await waitForAssembleWord(page, seeds, done, 5);
      await solveAssemble(page, seed.word, true);
    }
    await expect(page.locator('#res-percent')).toHaveText('100%');

    // ещё раз — новая сессия с нуля
    await page.locator('#btn-again').click();
    await expectCounter(page, 0, 5);

    // выход с подтверждением
    await page.locator('#btn-game-exit').click();
    await resolveConfirm(page, true);
    await expect(page.locator('#view-app')).toBeVisible();
  });

  testWithWords('статистика пополняется после тренировки', async ({ appPage: page }) => {
    await openTrainModal(page);
    await page.locator('#train-count').selectOption('5');
    await start(page);
    const seeds: SeedEntry[] = SEED_WORDS_IT.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
    for (let done = 0; done < 5; done++) {
      const seed = await waitForAssembleWord(page, seeds, done, 5);
      await solveAssemble(page, seed.word, true);
    }
    await expect(page.locator('#res-percent')).toBeVisible();

    // со страницы результатов возвращаемся в приложение — кнопка статистики в шапке
    await page.locator('#btn-finish').click();
    await expect(page.locator('#view-app')).toBeVisible();

    await page.locator('#btn-stats').click();
    await expect(page.locator('#modal-stats')).toBeVisible();
    await expect(page.locator('#stats-content')).toContainText('Тренировок пройдено');
    await expect(page.locator('#stats-content')).toContainText('100% (5/5)');
  });
});
