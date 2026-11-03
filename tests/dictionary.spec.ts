// Словарь: добавление/редактирование/удаление, поиск, теги, вкладки, озвучка, картинки, экспорт/импорт, тема.
import fs from 'node:fs';
import { test, expect } from './fixtures/app';
import { addWordViaModal, resolveConfirm, switchLang, openProfileMenu } from './helpers/actions';

test.describe('Словарь — добавление и карточка', () => {
  test('ручное добавление: слово, транскрипция, пример с флажком языка', async ({ appPage: page }) => {
    await addWordViaModal(page, {
      word: 'mela',
      transcription: 'ˈmɛːla',
      translation: 'яблоко',
      example: { text: 'La mela è dolce.', translation: 'Яблоко сладкое.' },
    });
    const card = page.locator('.word-card', { hasText: 'mela' });
    await expect(card).toBeVisible();
    await expect(card.locator('.w')).toHaveText('mela');
    await expect(card.locator('.t')).toHaveText('яблоко');
    await expect(card.locator('.ipa')).toHaveText('/ˈmɛːla/');
    await expect(card.locator('.word-example')).toContainText('La mela è dolce.');
    await expect(card.locator('.word-example')).toContainText('Яблоко сладкое.');
    // флажок языка на карточке убран, динамик — после текста примера
    await expect(card.locator('.ex-flag')).toHaveCount(0);
    await expect(card.locator('.word-example .icon-btn')).toBeVisible();
  });

  test('авто-картинка: мок Википедии возвращает миниатюру → <img> в карточке', async ({ appPage: page }) => {
    await addWordViaModal(page, { word: 'torre', translation: 'башня' });
    const img = page.locator('.word-card .word-img img');
    await expect(img).toBeVisible();
    // миниатюра — SVG data-URL со словом внутри (мок отдаёт без сетевого запроса)
    await expect(img).toHaveAttribute('src', /data:image\/svg\+xml.*torre/);
  });

  test('картинка: статьи нет (404) → фолбэк-эмодзи', async ({ appPage: page }) => {
    await addWordViaModal(page, { word: '__нет статьи__', translation: 'ничего' });
    await expect(page.locator('.word-card .word-img img')).toHaveCount(0);
    await expect(page.locator('.word-card .word-img')).toContainText('📘');
  });

  test('🔊 у слова озвучивает только слово (один вызов, текст = слово)', async ({ appPage: page }) => {
    await addWordViaModal(page, {
      word: 'mela',
      translation: 'яблоко',
      example: { text: 'La mela è dolce.', translation: 'Яблоко сладкое.' },
    });
    await page.locator('.word-card [aria-label="Озвучить слово"]').click();
    await expect.poll(async () => page.evaluate(() => (window as any).__ttsCalls?.length ?? 0))
      .toBeGreaterThanOrEqual(1);
    const calls = await page.evaluate(() => (window as any).__ttsCalls);
    expect(calls).toHaveLength(1);
    expect(calls[0].text).toBe('mela');
    expect(calls[0].lang).toBe('it-it');
  });
});

test.describe('Словарь — редактирование и удаление', () => {
  test('редактирование: правки сохраняются, флажки примеров остаются на местах', async ({ appPage: page }) => {
    await addWordViaModal(page, {
      word: 'mela',
      translation: 'яблоко',
      example: { text: 'La mela è dolce.', translation: 'Яблоко сладкое.' },
    });
    await page.locator('.word-card [aria-label="Редактировать"]').click();

    const rows = page.locator('#w-examples .example-row');
    await expect(rows).toHaveCount(1);
    await expect(rows.nth(0).locator('.ex-flag')).toHaveText('🇮🇹');

    await page.getByRole('button', { name: '+ Добавить пример' }).click();
    await rows.nth(1).locator('.ex-text').fill('Mangio una mela.');
    await rows.nth(1).locator('.ex-tr').fill('Я ем яблоко.');
    await page.locator('#modal-word').getByLabel('Перевод (русский)').fill('яблоко (фрукт)');
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await expect(page.locator('#modal-word')).not.toBeVisible();

    await page.locator('.word-card [aria-label="Редактировать"]').click();
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0).locator('.ex-text')).toHaveValue('La mela è dolce.');
    await expect(rows.nth(1).locator('.ex-text')).toHaveValue('Mangio una mela.');
    await expect(rows.nth(0).locator('.ex-flag')).toHaveText('🇮🇹');
    await expect(rows.nth(1).locator('.ex-flag')).toHaveText('🇮🇹');
    await page.locator('#modal-word .modal-head [data-close]').click();
    await expect(page.locator('.word-card .t')).toHaveText('яблоко (фрукт)');
  });

  test('язык примера сохраняется: у слова на EN-вкладке флажок 🇬🇧', async ({ appPage: page }) => {
    await switchLang(page, 'en');
    await addWordViaModal(page, {
      word: 'apple',
      translation: 'яблоко',
      example: { text: 'The apple is red.', translation: 'Яблоко красное.' },
    });
    await page.locator('.word-card [aria-label="Редактировать"]').click();
    await expect(page.locator('#w-examples .example-row .ex-flag')).toHaveText('🇬🇧');
    await page.locator('#modal-word .modal-head [data-close]').click();
  });

  test('удаление: отмена сохраняет слово, подтверждение удаляет', async ({ appPage: page }) => {
    await addWordViaModal(page, { word: 'mela', translation: 'яблоко' });

    await page.locator('.word-card [aria-label="Удалить"]').click();
    await expect(page.locator('#confirm-text')).toContainText('Удалить слово «mela»?');
    await resolveConfirm(page, false);
    await expect(page.locator('.word-card')).toHaveCount(1);

    await page.locator('.word-card [aria-label="Удалить"]').click();
    await resolveConfirm(page, true);
    await expect(page.locator('.word-card')).toHaveCount(0);
    await expect(page.locator('#empty-state')).toBeVisible();
  });
});

test.describe('Словарь — массовое добавление', () => {
  test('формат «слово|перевод|пример|перевод примера»', async ({ appPage: page }) => {
    await page.locator('[aria-label="Добавить списком"]').click();
    await page.locator('#bulk-text').fill([
      'gatto|кошка|Il gatto dorme.|Кошка спит.',
      'cane|пёс',
    ].join('\n'));
    await page.locator('#modal-bulk').getByRole('button', { name: 'Добавить', exact: true }).click();

    await expect(page.locator('#toast')).toContainText('Добавлено слов: 2');
    await expect(page.locator('.word-card', { hasText: 'gatto' })).toContainText('Il gatto dorme.');
    await expect(page.locator('.word-card', { hasText: 'cane' })).toBeVisible();
  });

  test('формат «слово - перевод»', async ({ appPage: page }) => {
    await page.locator('[aria-label="Добавить списком"]').click();
    await page.locator('#bulk-text').fill('pane - хлеб');
    await page.locator('#modal-bulk').getByRole('button', { name: 'Добавить', exact: true }).click();
    await expect(page.locator('#toast')).toContainText('Добавлено слов: 1');
    await expect(page.locator('.word-card .w')).toHaveText('pane');
  });
});

test.describe('Словарь — поиск и фильтры', () => {
  test.use({
    appOptions: {
      words: [
        { id: 'w1', word: 'mela', translation: 'яблоко',
          examples: [{ text: 'La mela è dolce.', translation: 'Яблоко сладкое.' }] },
        { id: 'w2', word: 'casa', translation: 'дом' },
        { id: 'w3', word: 'sole', translation: 'солнце', tags: ['природа'] },
      ],
    },
  });

  test('поиск по слову', async ({ appPage: page }) => {
    await page.getByPlaceholder('Поиск по слову или переводу…').fill('mela');
    await expect(page.locator('.word-card')).toHaveCount(1);
    await expect(page.locator('.word-card .w')).toHaveText('mela');
  });

  test('поиск по переводу', async ({ appPage: page }) => {
    await page.getByPlaceholder('Поиск по слову или переводу…').fill('дом');
    await expect(page.locator('.word-card')).toHaveCount(1);
    await expect(page.locator('.word-card .w')).toHaveText('casa');
  });

  test('поиск по тексту примера', async ({ appPage: page }) => {
    await page.getByPlaceholder('Поиск по слову или переводу…').fill('dolce');
    await expect(page.locator('.word-card')).toHaveCount(1);
    await expect(page.locator('.word-card .w')).toHaveText('mela');
  });

  test('фильтр по тегу через селект', async ({ appPage: page }) => {
    await page.locator('#sel-tag').selectOption('природа');
    await expect(page.locator('.word-card')).toHaveCount(1);
    await expect(page.locator('.word-card .w')).toHaveText('sole');
  });

  test('клик по тегу-чипу на карточке включает фильтр', async ({ appPage: page }) => {
    await page.locator('.word-card [data-tagchip="природа"]').click();
    await expect(page.locator('#sel-tag')).toHaveValue('природа');
    await expect(page.locator('.word-card')).toHaveCount(1);
    await expect(page.locator('.word-card .w')).toHaveText('sole');
  });
});

test.describe('Словарь — вкладки языков', () => {
  test.use({
    appOptions: {
      words: [{ id: 'w1', word: 'mela', translation: 'яблоко' }],
    },
  });

  test('слова и примеры фильтруются по языку вкладки', async ({ appPage: page }) => {
    // IT-вкладка: слово видно
    await expect(page.locator('.word-card .w')).toHaveText('mela');

    // EN-вкладка: пусто
    await switchLang(page, 'en');
    await expect(page.locator('#empty-state')).toBeVisible();
    await addWordViaModal(page, { word: 'apple', translation: 'яблоко' });
    await expect(page.locator('.word-card .w')).toHaveText('apple');

    // возврат на IT: по-прежнему только итальянское слово
    await switchLang(page, 'it');
    await expect(page.locator('.word-card .w')).toHaveText('mela');
  });
});

test.describe('Словарь — экспорт и импорт', () => {
  test.use({
    appOptions: {
      words: [
        { id: 'w1', word: 'mela', translation: 'яблоко' },
        { id: 'w2', word: 'casa', translation: 'дом' },
      ],
    },
  });

  test('экспорт JSON: структура { app, version, user, words }', async ({ appPage: page, profileName }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#btn-export').click(),
    ]);
    const path = await download.path();
    const payload = JSON.parse(fs.readFileSync(path!, 'utf8'));
    expect(payload.app).toBe('wordsMemory');
    expect(payload.version).toBe(1);
    expect(payload.user).toBe(profileName);
    expect(payload.words).toHaveLength(2);
    expect(payload.words[0].word).toBe('mela');
  });

  test('импорт: добавление и дедупликация повторных слов', async ({ appPage: page }) => {
    const payload = {
      app: 'wordsMemory',
      version: 1,
      words: [
        { lang: 'it', word: 'pane', translation: 'хлеб' },
        { lang: 'it', word: 'vino', translation: 'вино' },
      ],
    };
    const file = {
      name: 'import.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(payload), 'utf8'),
    };

    await page.locator('#file-import').setInputFiles(file);
    await expect(page.locator('#toast')).toContainText('добавлено 2');
    // 2 сида + 2 импортированных
    await expect(page.locator('.word-card')).toHaveCount(4);

    // повторный импорт — всё дедуплицируется
    await page.locator('#file-import').setInputFiles(file);
    await expect(page.locator('#toast')).toContainText('пропущено 2');
    await expect(page.locator('.word-card')).toHaveCount(4);
  });
});

test.describe('Словарь — тема', () => {
  test('переключение светлой/тёмной и персист после перезагрузки', async ({ appPage: page }) => {
    const theme = () => page.evaluate(() => document.documentElement.dataset.theme ?? '');
    const before = await theme();

    await openProfileMenu(page);
    await page.locator('#menu-theme').click();
    const after = await theme();
    expect(after).not.toBe(before);
    expect(['light', 'dark']).toContain(after);

    await page.reload();
    expect(await theme()).toBe(after);
  });
});
