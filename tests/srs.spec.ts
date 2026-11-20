// Повторение (SRS): выбор групп, карточка с 4 вариантами, свайп, ввод слова,
// озвучка после ответа, статусы интервалов, настройка направления свайпа.
import { test, expect } from './fixtures/app';

const openSrs = async (page: any) => {
  await page.locator('#nav-srs').click();
  await expect(page.locator('#page-srs .srs-head h2')).toContainText('Интервальное повторение');
};

const selectGroup = async (page: any, gid: string) => {
  await page.evaluate((id: string) => {
    const cb = [...document.querySelectorAll('.srs-group-check')].find(x => x.dataset.gid === id) as HTMLInputElement;
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  }, gid);
};

const currentWord = (page: any) => page.locator('.srs-w-text').textContent();

// перевод слова берём из данных набора (статус-списка в сессии больше нет)
const trOf = (page: any, gid: string, word: string) =>
  page.evaluate(({ gid, w }: { gid: string; w: string }) => {
    const g = (window as any).WM.groupsData.GROUPS.find((x: any) => x.id === gid);
    return g.words.find((x: any) => x.word === w)?.translation;
  }, { gid, w: word });

test.describe('Повторение — выбор групп', () => {
  test('страница: 35 групп, «Выбрать все» отмечает все чекбоксы', async ({ appPage: page }) => {
    await openSrs(page);
    await expect(page.locator('.srs-group-check')).toHaveCount(35);
    await page.locator('#srs-sel-all').click();
    await expect(page.locator('.srs-group-check:checked')).toHaveCount(35);
    await expect(page.locator('#srs-sel-count')).toContainText('35 из 35');
    await page.locator('#srs-sel-none').click();
    await expect(page.locator('.srs-group-check:checked')).toHaveCount(0);
    await expect(page.locator('#srs-start')).toBeDisabled();
  });

  test('выбор группы сохраняется в localStorage и переживает перезагрузку', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await expect(page.locator('#srs-sel-count')).toContainText('1 из 35');
    await page.reload();
    await page.locator('#nav-srs').click();
    await expect(page.locator('.srs-group-check[data-gid="colors"]')).toBeChecked();
  });
});

test.describe('Повторение — сессия', () => {
  test('карточка: 4 варианта, верный ответ двигает интервал, неверный сбрасывает на 15 мин', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    await expect(page.locator('.srs-card')).toBeVisible();
    await expect(page.locator('.srs-opt')).toHaveCount(4);

    // верный ответ: выбираем вариант, совпадающий с переводом из статус-списка
    const word1 = await currentWord(page);
    const tr1 = await trOf(page, 'colors', word1);
    await page.locator('.srs-opt', { hasText: tr1 }).click();
    await expect(page.locator('.srs-feedback')).toContainText('✓ Верно');

    // следующий шаг — неверный ответ
    await page.waitForTimeout(1000);
    const word2 = await currentWord(page);
    const tr2 = await trOf(page, 'colors', word2);
    await page.locator('.srs-opt').filter({ hasNotText: tr2 }).first().click();
    await expect(page.locator('.srs-feedback')).toContainText('✗ Правильно');
    // статус проверяем на главной странице повторения (в сессии его нет)
    await page.locator('#srs-exit').click();
    await expect(page.locator('.srs-word-row', { hasText: word2 }).locator('.srs-st'))
      .toContainText('15 мин');
  });

  test('ошибка сбрасывает слово на 15 мин и возвращает его в очередь сессии', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    const word1 = await currentWord(page);
    const tr1 = await trOf(page, 'colors', word1);
    await page.locator('.srs-opt').filter({ hasNotText: tr1 }).first().click();
    await expect(page.locator('.srs-feedback')).toContainText('✗ Правильно');
    // сброс на первый интервал — и слово приходит снова в этой же сессии
    // (добавлено в конец очереди)
    await expect(page.locator('.game-counter, .srs-session-head')).toBeVisible(); // сессия жива
    const seenAgain = await page.evaluate((w: string) => new Promise<string>(resolve => {
      const started = Date.now();
      const tick = () => {
        const cur = document.querySelector('.srs-w-text')?.textContent;
        if (cur === w && Date.now() - started < 8000) return resolve('again');
        if (Date.now() - started >= 8000) return resolve('no');
        setTimeout(tick, 300);
      };
      setTimeout(tick, 1200);
    }), word1);
    expect(seenAgain).toBe('again');
  });

  test('после ответа фокус снят: курсор не остаётся на нажатом варианте', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    await page.locator('.srs-opt').first().click();
    await expect(page.locator('.srs-feedback')).toBeVisible();
    const focused = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      cls: document.activeElement?.className ?? '',
    }));
    // фокус ушёл с кнопки-варианта (ничего не обведено)
    expect(focused.cls).not.toContain('srs-opt');
  });

  test('свайп вправо — «помню» (по умолчанию), влево — «не помню»', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    await expect(page.locator('.srs-hint-rem')).toContainText('→');
    await expect(page.locator('.srs-hint-forgot')).toContainText('←');

    // свайп влево — «не помню»: сброс на первый интервал
    await page.evaluate(() => {
      const card = document.getElementById('srs-card')!;
      const t = (x: number) => new Touch({ identifier: 1, target: card, clientX: x, clientY: 300 });
      card.dispatchEvent(new TouchEvent('touchstart', { touches: [t(300)], bubbles: true }));
      card.dispatchEvent(new TouchEvent('touchend', { changedTouches: [t(120)], bubbles: true }));
    });
    await expect(page.locator('.srs-feedback')).toContainText('✗ Правильно');

    // свайп вправо — «помню»: продвижение по интервалу
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      const card = document.getElementById('srs-card')!;
      const t = (x: number) => new Touch({ identifier: 1, target: card, clientX: x, clientY: 300 });
      card.dispatchEvent(new TouchEvent('touchstart', { touches: [t(300)], bubbles: true }));
      card.dispatchEvent(new TouchEvent('touchend', { changedTouches: [t(480)], bubbles: true }));
    });
    await expect(page.locator('.srs-feedback')).toContainText('✓ Верно');
  });

  test('режим ввода с клавиатуры удалён: панели ⌨️ на карточке нет', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    await expect(page.locator('#srs-type-toggle')).toHaveCount(0);
    await expect(page.locator('#srs-type')).toHaveCount(0);
    await expect(page.locator('.srs-opt')).toHaveCount(4);
  });

  test('после каждого ответа слово озвучивается (стаб TTS)', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    const word = await currentWord(page);
    const tr = await trOf(page, 'colors', word);
    await page.locator('.srs-opt', { hasText: tr }).click();
    await expect(page.locator('.srs-feedback')).toContainText('✓ Верно');
    // tts.speak стартует фразы через setTimeout 60мс — даём стабу записать вызов
    await page.waitForTimeout(300);
    const last = await page.evaluate(() => {
      const calls = (window as any).__ttsCalls;
      return calls[calls.length - 1];
    });
    expect(last?.text).toBe(word);
  });

  test('слово озвучивается при показе карточки; динамик у транскрипции проигрывает слово', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    const word = await currentWord(page);
    // озвучка при выпадении карточки (tts.speak срабатывает через 60мс)
    await page.waitForTimeout(300);
    const onShow = await page.evaluate(() => {
      const calls = (window as any).__ttsCalls;
      return calls[calls.length - 1];
    });
    expect(onShow?.text).toBe(word);
    // кнопка-динамик рядом с транскрипцией
    await expect(page.locator('#srs-w-speak')).toBeVisible();
    await page.locator('#srs-w-speak').click();
    await page.waitForTimeout(200);
    const afterBtn = await page.evaluate(() => {
      const calls = (window as any).__ttsCalls;
      return calls[calls.length - 1];
    });
    expect(afterBtn?.text).toBe(word);
    expect(afterBtn?.lang).toBe('it-it');
  });
});

test.describe('Повторение — настройки', () => {
  test('настройка направления свайпа сохраняется', async ({ appPage: page }) => {
    await page.locator('#btn-profile').click();
    await page.locator('#menu-settings').click();
    await expect(page.locator('#modal-settings')).toBeVisible();
    await expect(page.locator('input[name="swipe-dir"][value="right"]')).toBeChecked();
    await page.locator('input[name="swipe-dir"][value="left"]').check();
    await expect(page.locator('input[name="swipe-dir"][value="left"]')).toBeChecked();
    expect(await page.evaluate(() => localStorage.getItem('wm_srs_swipe'))).toBe('left');

    // подсказки на карточке меняют стороны
    await page.evaluate(() => document.getElementById('modal-settings')!.close());
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    await expect(page.locator('.srs-hint-rem')).toContainText('←');
    await expect(page.locator('.srs-hint-forgot')).toContainText('→');
  });

  test('кнопка ↺ сбрасывает прогресс слова', async ({ appPage: page }) => {
    await openSrs(page);
    await selectGroup(page, 'colors');
    await page.locator('#srs-start').click();
    const word = await currentWord(page);
    const tr = await trOf(page, 'colors', word);
    await page.locator('.srs-opt', { hasText: tr }).click();
    await page.locator('#srs-exit').click();
    await expect(page.locator('.srs-word-row', { hasText: word }).locator('.srs-st')).toContainText('1 ч');
    // блоки статуса свёрнуты — раскрываем группу со словами
    await page.evaluate(() => { document.querySelector('details.srs-status-group').open = true; });
    await page.locator('.srs-word-row', { hasText: word }).locator('.srs-reset').click();
    await expect(page.locator('.srs-word-row', { hasText: word }).locator('.srs-st')).toContainText('не начато');
  });
});
