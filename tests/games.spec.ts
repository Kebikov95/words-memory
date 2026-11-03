// Игры: настройка, 5 режимов, экран результатов, статистика.
import { expect, test, testWithWords } from './fixtures/app';
import {
  expectCounter,
  matchPair,
  matchPairReverse,
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
import { resolveConfirm, openProfileMenu } from './helpers/actions';

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
  testWithWords('модалка: 5 режимов, выбор количества слов, опция «Все слова»', async ({ appPage: page }) => {
    await openTrainModal(page);
    await expect(page.locator('.mode-item')).toHaveCount(5);
    for (const name of ['Собери слово', 'Диктант', 'Слово ↔ перевод', 'Картинка ↔ перевод', 'Микс']) {
      await expect(page.locator('.mode-item', { hasText: name })).toBeVisible();
    }
    await expect(page.locator('#train-count')).toHaveValue('10');
    await expect(page.locator('#train-count')).toContainText('Все слова');
    // лейбл «Доступно слов…» убран: подсказка пуста, пока слова есть
    await expect(page.locator('#train-available')).toHaveText('');
    await page.locator('#train-count').selectOption('5');
    await expect(page.locator('#train-available')).toHaveText('');
  });

  test('пустой словарь — настройка предупреждает и старт блокируется', async ({ appPage: page }) => {
    await openTrainModal(page);
    await expect(page.locator('#train-available')).toContainText('Нет слов для тренировки');
    await page.getByRole('button', { name: /Начать/ }).click();
    await expect(page.locator('#toast')).toContainText('Нет слов для тренировки');
    await expect(page.locator('#view-game')).not.toBeVisible();
  });

  testWithWords('«Все слова» — сессия на весь словарь вкладки', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Диктант');
    await page.locator('#train-count').selectOption('all');
    await start(page);
    // в словаре ровно 5 сид-слов — все уходят в сессию
    await expectCounter(page, 0, 5);
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
  testWithWords('озвучка через стаб TTS: старт задания + ответ, верный и неверный ввод', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Диктант');
    await page.locator('#train-count').selectOption('5');
    await start(page);

    // первое слово — с ошибкой, остальные — верно.
    // У каждого задания ровно две озвучки (старт + ответ), поэтому стартовое
    // слово ждём по порогу 2*done + 1: предыдущие задания уже внесли по две
    let firstSpoken = '';
    for (let done = 0; done < 5; done++) {
      await expectCounter(page, done, 5);
      const spoken = await waitForSpokenWord(page, 2 * done + 1);
      if (done === 0) firstSpoken = spoken;
      await solveDictation(page, done === 0 ? 'zzz' : spoken);
    }
    await expect(page.locator('#res-percent')).toHaveText('80%');
    await expect(page.locator('.mistake-row .mw')).toHaveText(firstSpoken);

    // по две озвучки на задание: старт + ответ
    const calls = await page.evaluate(() => (window as any).__ttsCalls.length);
    expect(calls).toBeGreaterThanOrEqual(10);
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

  testWithWords('Слово ↔ перевод: можно начинать с правой колонки', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Слово ↔ перевод');
    await page.locator('#train-count').selectOption('5');
    await start(page);
    await matchPairReverse(page, 'w1');
    await expect(page.locator('#game-feedback')).toContainText('mela — яблоко');
    await expectCounter(page, 1, 5);
    for (const id of ['w2', 'w3', 'w4', 'w5']) await matchPair(page, id);
    await expect(page.locator('#res-percent')).toHaveText('100%');
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
  testWithWords('Микс: каждое слово проходит все режимы по порядку', async ({ appPage: page }) => {
    await openTrainModal(page);
    await selectMode(page, 'Микс');
    await page.locator('#train-count').selectOption('5');
    await start(page);
    const seeds: SeedEntry[] = SEED_WORDS_IT.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
    // 5 слов × 4 режима = 20 заданий; фазы идут подряд —
    // сначала «картинка↔перевод» по всем словам, затем «слово↔перевод», сборка, диктант
    const seen = await solveAllTasks(page, seeds, 20);
    await expect(page.locator('#res-percent')).toHaveText('100%');
    expect([...new Set(seen)].sort()).toEqual(['assemble', 'dictation', 'match-image', 'match-word']);
    // порядок фаз: все «картинки» раньше всех «сборок», сборки раньше диктантов
    const firstOf = (t: string) => seen.indexOf(t);
    expect(firstOf('match-image')).toBeLessThan(firstOf('match-word'));
    expect(firstOf('match-word')).toBeLessThan(firstOf('assemble'));
    expect(firstOf('assemble')).toBeLessThan(firstOf('dictation'));
  });

  // сценарий «одно слово в словаре»: микс прогоняет его через все 4 режима по порядку
  test.describe('Микс с одним словом', () => {
    const one = SEED_WORDS_IT.slice(0, 1);
    test.use({ appOptions: { words: one } });

    test('единственное слово проходит картинка → слово → сборка → диктант', async ({ appPage: page }) => {
      await openTrainModal(page);
      await selectMode(page, 'Микс');
      await page.locator('#train-count').selectOption('all');
      await start(page);
      const seeds: SeedEntry[] = one.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
      const seen = await solveAllTasks(page, seeds, 4);
      await expect(page.locator('#res-percent')).toHaveText('100%');
      expect(seen).toEqual(['match-image', 'match-word', 'assemble', 'dictation']);
    });
  });

  testWithWords('результаты: «Прогнать ошибки» — сессия только из ошибок', async ({ appPage: page }) => {
    await openTrainModal(page);
    await page.locator('#train-count').selectOption('5');
    await start(page);
    const seeds: SeedEntry[] = SEED_WORDS_IT.map(s => ({ id: s.id!, word: s.word, translation: s.translation }));
    // первое задание собираем неверно, остальные — верно
    const first = (await waitForAssembleWord(page, seeds, 0, 5)).word;
    await solveAssemble(page, first, false);
    await solveAllTasks(page, seeds, 5);
    await expect(page.locator('#res-percent')).toHaveText('80%');
    await expect(page.locator('.mistake-row')).toHaveCount(1);

    const retry = page.locator('#btn-retry-mistakes');
    await expect(retry).toBeVisible();
    await expect(retry).toContainText('(1)');
    await retry.click();
    await expectCounter(page, 0, 1);

    // в новой сессии то самое слово — собираем верно
    const only = seeds.filter(s => s.word === first);
    const retrySeed = await waitForAssembleWord(page, only, 0, 1);
    await solveAssemble(page, retrySeed.word, true);
    await expect(page.locator('#res-percent')).toHaveText('100%');
    await expect(retry).toBeHidden();
    await expect(page.locator('#res-mistakes')).toContainText('Без ошибок');
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

    // со страницы результатов возвращаемся в приложение — статистика в меню профиля
    await page.locator('#btn-finish').click();
    await expect(page.locator('#view-app')).toBeVisible();

    await openProfileMenu(page);
    await page.locator('#menu-stats').click();
    await expect(page.locator('#modal-stats')).toBeVisible();
    await expect(page.locator('#stats-content')).toContainText('Тренировок пройдено');
    await expect(page.locator('#stats-content')).toContainText('100% (5/5)');
  });
});
