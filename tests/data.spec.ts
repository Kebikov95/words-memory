// Данные и целостность: структура GROUPS, полнота слов, изоляция профилей, экранирование.
import { test, expect } from './fixtures/app';
import { uniqueName } from './helpers/app';
import { addWordViaModal } from './helpers/actions';

test.describe('Данные — каталог наборов', () => {
  // каталог вырос: добавились «ключевые глаголы» (it), «неправильные глаголы» (en) и пара «топ-300»
  const SINGLES = ['phrasal', 'key-verbs', 'irregular-verbs-en'];

  test('35 групп: пары it/en идут рядом, одиночные наборы на месте', async ({ appPage: page }) => {
    const info = await page.evaluate(() => {
      const groups = (window as any).WM.groupsData.GROUPS;
      return { ids: groups.map((g: any) => g.id), langs: groups.map((g: any) => g.lang) };
    });
    expect(info.ids).toHaveLength(35);

    // у каждой не-одиночной группы есть зеркало другого языка;
    // внутри кластера глаголов порядок не строго парный (key-verbs и irregular между зеркалами)
    for (const id of info.ids) {
      if (SINGLES.includes(id)) continue;
      if (id.endsWith('-en')) {
        expect(info.ids, `зеркало ${id}`).toContain(id.replace(/-en$/, ''));
        expect(info.langs[info.ids.indexOf(id)]).toBe('en');
      } else {
        expect(info.ids, `зеркало ${id}`).toContain(`${id}-en`);
        expect(info.langs[info.ids.indexOf(id)]).toBe('it');
      }
    }
    // одиночки присутствуют ровно один раз
    for (const s of SINGLES) {
      expect(info.ids.filter((x: string) => x === s)).toHaveLength(1);
    }
  });

  test('слова наборов полные: транскрипция, перевод, примеры (пословицы — без примеров)', async ({ appPage: page }) => {
    const problems = await page.evaluate(() => {
      const groups = (window as any).WM.groupsData.GROUPS;
      const bad: string[] = [];
      for (const g of groups) {
        const proverb = g.id.startsWith('proverbs');
        for (const w of g.words) {
          if (!proverb && !w.transcription) bad.push(`${g.id}/${w.word}: нет транскрипции`);
          if (!w.translation) bad.push(`${g.id}/${w.word}: нет перевода`);
          const expected = proverb ? 0 : 2;
          if (w.examples.length !== expected) {
            bad.push(`${g.id}/${w.word}: примеров ${w.examples.length}, ожидалось ${expected}`);
          }
        }
      }
      return bad;
    });
    expect(problems).toEqual([]);
  });
});

test.describe('Данные — изоляция и безопасность', () => {
  test('слова профиля A не видны профилю B', async ({ page }) => {
    const nameA = uniqueName('Профиль A');
    await page.goto('/');
    await page.getByPlaceholder('Ваше имя').fill(nameA);
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await addWordViaModal(page, { word: 'segreto', translation: 'секрет' });
    await expect(page.locator('.word-card')).toHaveCount(1);

    // выход и создание профиля B
    await page.locator('#btn-profile').click();
    await page.getByRole('button', { name: 'Выйти' }).click();
    await expect(page.locator('#view-auth')).toBeVisible();
    await page.getByPlaceholder('Ваше имя').fill(uniqueName('Профиль B'));
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();

    await expect(page.locator('#empty-state')).toBeVisible();
    await expect(page.locator('.word-card')).toHaveCount(0);
  });

  test('экранирование: HTML в слове не исполняется', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', async () => { dialogFired = true; });

    const xss = '<img src=x onerror=alert(1)>';
    await page.goto('/');
    await page.getByPlaceholder('Ваше имя').fill(uniqueName('XSS'));
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();

    await addWordViaModal(page, { word: xss, translation: 'не вирус' });
    const card = page.locator('.word-card');
    await expect(card).toHaveCount(1);
    // текст отображается как текст
    await expect(card.locator('.w')).toHaveText(xss);
    // alert(1) не сработал
    expect(dialogFired).toBe(false);

    // поиск тоже безопасен
    await page.getByPlaceholder('Поиск по слову или переводу…').fill('alert');
    await expect(page.locator('.word-card')).toHaveCount(1);
    expect(dialogFired).toBe(false);
  });
});
