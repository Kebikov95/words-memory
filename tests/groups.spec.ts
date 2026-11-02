// Группы: каталог, фильтры, просмотр набора, добавление слов, тренировка из набора.
import { test, expect } from './fixtures/app';
import { openGroup, resolveConfirm } from './helpers/actions';
import { expectCounter, matchPair, solveAssemble, waitForAssembleWord } from './helpers/games';

test.describe('Группы — каталог', () => {
  test('в каталоге 35 готовых наборов', async ({ appPage: page }) => {
    await page.getByRole('button', { name: /Группы/ }).click();
    await expect(page.locator('.group-card')).toHaveCount(35);
  });

  test('фильтр по языку: 🇬🇧 / 🇮🇹 / все', async ({ appPage: page }) => {
    await page.getByRole('button', { name: /Группы/ }).click();
    await expect(page.locator('.group-card')).toHaveCount(35);

    await page.locator('.lang-chips [data-lf="en"]').click();
    const enCards = page.locator('.group-card');
    await expect(enCards).toHaveCount(18);
    for (let i = 0; i < await enCards.count(); i++) {
      await expect(enCards.nth(i)).toContainText('EN');
    }

    await page.locator('.lang-chips [data-lf="it"]').click();
    const itCards = page.locator('.group-card');
    await expect(itCards).toHaveCount(17);
    for (let i = 0; i < await itCards.count(); i++) {
      await expect(itCards.nth(i)).toContainText('IT');
    }

    await page.locator('.lang-chips [data-lf=""]').click();
    await expect(page.locator('.group-card')).toHaveCount(35);
  });
});

test.describe('Группы — просмотр набора', () => {
  test('строки набора: чекбокс, картинка (мок), транскрипция, перевод, пример, динамики', async ({ appPage: page }) => {
    await openGroup(page, '100 самых частотных глаголов', 'it');
    const firstRow = page.locator('.g-row').first();
    await expect(firstRow.locator('.g-check')).toBeVisible();
    await expect(firstRow.locator('.g-img img')).toBeVisible();
    await expect(firstRow.locator('.g-ipa')).toContainText('/');
    await expect(firstRow.locator('.g-tr')).not.toBeEmpty();
    await expect(firstRow.locator('.g-ex').first()).toBeVisible();
    await expect(firstRow.locator('[aria-label="Озвучить слово"]')).toBeVisible();
    await expect(firstRow.locator('[aria-label="Озвучить пример"]').first()).toBeVisible();
    await expect(page.locator('.g-row')).toHaveCount(100);
  });

  test('поиск внутри набора фильтрует строки', async ({ appPage: page }) => {
    await openGroup(page, '100 самых частотных глаголов', 'it');
    await page.locator('#g-search').fill('essere');
    await expect(page.locator('.g-row')).toHaveCount(1);
    await expect(page.locator('.g-word')).toHaveText('essere');
  });

  test('выбор чекбоксами меняет счётчик кнопки добавления', async ({ appPage: page }) => {
    await openGroup(page, '100 самых частотных глаголов', 'it');
    const addBtn = page.locator('#g-add-selected');
    await expect(addBtn).toContainText('(0)');
    await page.locator('.g-check').nth(0).check();
    await page.locator('.g-check').nth(1).check();
    await expect(addBtn).toContainText('(2)');
  });
});

test.describe('Группы — добавление в словарь', () => {
  test('«Добавить все» → тост и метки «уже в словаре»', async ({ appPage: page }) => {
    await openGroup(page, '20 ключевых глаголов');
    await page.locator('#g-add-all').click();
    await expect(page.locator('#toast')).toContainText('Добавлено: 20');
    await expect(page.locator('.g-inmark')).toHaveCount(20);
    await expect(page.locator('.g-row.in-dict')).toHaveCount(20);
  });

  test('«Добавить выбранные» и повторное добавление → «уже были в словаре»', async ({ appPage: page }) => {
    await openGroup(page, '20 ключевых глаголов');
    await page.locator('.g-check').nth(0).check();
    await page.locator('.g-check').nth(1).check();
    await page.locator('#g-add-selected').click();
    await expect(page.locator('#toast')).toContainText('Добавлено: 2');

    // повторное добавление — дедупликация
    await page.locator('#g-add-all').click();
    // 18 новых + 2 уже добавленных выше
    await expect(page.locator('#toast')).toContainText('Добавлено: 18');
    await expect(page.locator('#toast')).toContainText('уже были в словаре: 2');
  });
});

test.describe('Группы — тренировка из набора', () => {
  test('«Тренировать набор» открывает настройку с пулом набора', async ({ appPage: page }) => {
    await openGroup(page, '20 ключевых глаголов');
    await page.locator('#g-train-all').click();
    await expect(page.locator('#modal-train')).toBeVisible();
    await expect(page.locator('#train-available')).toContainText('доступно слов: 20');
    // тег при тренировке из набора скрыт
    await expect(page.locator('#train-tag').locator('xpath=..')).toBeHidden();
  });

  test('«Тренировать выбранные» — пул из выбранных строк', async ({ appPage: page }) => {
    await openGroup(page, '100 самых частотных глаголов', 'it');
    await page.locator('.g-check').nth(0).check();
    await page.locator('.g-check').nth(1).check();
    await page.locator('#g-train-selected').click();
    await expect(page.locator('#train-available')).toContainText('доступно слов: 2');
  });

  test('тренировка набора форм: сборка использует только инфинитив', async ({ appPage: page }) => {
    // свой набор из двух форм — детерминированно (пул «100 неправильных глаголов» перемешивается)
    await page.getByRole('button', { name: /Группы/ }).click();
    await page.getByRole('button', { name: '+ Создать набор' }).click();
    await page.getByLabel('Название').fill('Формы: сборка');
    await page.getByLabel('Язык').selectOption('en');
    await page.getByLabel('Слова', { exact: true }).fill([
      'be — was/were — been|быть',
      'go — went — gone|идти',
    ].join('\n'));
    await page.getByRole('button', { name: 'Создать набор', exact: true }).click();
    await expect(page.locator('#toast')).toContainText('создан');

    await page.locator('.group-card', { hasText: 'Формы: сборка' }).click();
    await page.locator('#g-train-all').click();
    // в пуле 2 слова — сессия будет из 2 заданий при любом лимите
    await page.getByRole('button', { name: /Начать/ }).click();
    await expect(page.locator('#view-game')).toBeVisible();

    // оба задания собираются по инфинитиву: слотов ровно по длине инфинитива,
    // плиток с тире и словарными формами нет; синхронизация — по пулу (анаграмма)
    const seeds = [
      { id: 'be', word: 'be', translation: 'быть' },
      { id: 'go', word: 'go', translation: 'идти' },
    ];
    for (let done = 0; done < 2; done++) {
      const seed = await waitForAssembleWord(page, seeds, done, 2);
      await expect(page.locator('#as-slots .letter-slot')).toHaveCount(seed.word.length);
      await solveAssemble(page, seed.word, true);
    }
    await expect(page.locator('#res-percent')).toHaveText('100%');
  });

  test('тренировка набора форм: сопоставление по инфинитиву и переводу', async ({ appPage: page }) => {
    // свой набор с составными словами форм
    await page.getByRole('button', { name: /Группы/ }).click();
    await page.getByRole('button', { name: '+ Создать набор' }).click();
    await page.getByLabel('Название').fill('Формы глаголов');
    await page.getByLabel('Язык').selectOption('en');
    await page.getByLabel('Слова', { exact: true }).fill([
      'go — went — gone|идти',
      'write — wrote — written|писать',
    ].join('\n'));
    await page.getByRole('button', { name: 'Создать набор', exact: true }).click();
    await expect(page.locator('#toast')).toContainText('создан');

    await page.locator('.group-card', { hasText: 'Формы глаголов' }).click();
    await page.locator('#g-train-all').click();
    await page.locator('.mode-item', { hasText: 'Слово ↔ перевод' }).click();
    await page.getByRole('button', { name: /Начать/ }).click();
    await expect(page.locator('.match-grid')).toBeVisible();

    // левая колонка — инфинитивы (набор тренируется по первой форме); порядок — из шафла
    const left = page.locator('.match-grid [data-left]');
    await expect(left).toHaveCount(2);
    const texts = (await left.allTextContents()).map(t => t.trim()).sort();
    expect(texts).toEqual(['go', 'write']);
    // id сгенерированы — пары работают (без data-left="undefined")
    for (let i = 0; i < 2; i++) {
      await expect(left.nth(i)).not.toHaveAttribute('data-left', 'undefined');
    }

    // соединяем пары: инфинитив → перевод
    await page.locator('.match-grid [data-left]', { hasText: 'go' }).click();
    await page.locator('.match-grid [data-right]', { hasText: 'идти' }).click();
    await page.locator('.match-grid [data-left]', { hasText: 'write' }).click();
    await page.locator('.match-grid [data-right]', { hasText: 'писать' }).click();
    await expect(page.locator('#res-percent')).toBeVisible();
  });
});
