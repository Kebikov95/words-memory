// Вход и профили: создание, ошибки, PIN, «Продолжить как…», выход.
import { test, expect } from '@playwright/test';
import { uniqueName } from './helpers/app';
import { addWordViaModal, logoutViaMenu } from './helpers/actions';

test.describe('Вход и профили', () => {
  test('создание профиля без PIN открывает словарь', async ({ page }) => {
    const name = uniqueName('Анна');
    await page.goto('/');
    await page.getByPlaceholder('Ваше имя').fill(name);
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#btn-profile')).toContainText(name);
    // профиль сохранён в списке пользователей
    const users = await page.evaluate(() => JSON.parse(localStorage.getItem('wm_users') ?? '[]'));
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe(name);
    expect(users[0].pin).toBeNull();
  });

  test('пустое имя — профиль не создаётся', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    // HTML5-валидация required не даёт отправить форму
    await expect(page.locator('#view-auth')).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('wm_users'))).toBeNull();
  });

  test('дубликат имени — тост об ошибке', async ({ page }) => {
    const name = uniqueName('Борис');
    await page.goto('/');
    await page.getByPlaceholder('Ваше имя').fill(name);
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();

    // выход
    await logoutViaMenu(page);
    await expect(page.locator('#view-auth')).toBeVisible();

    // повторное создание с тем же именем
    await page.getByPlaceholder('Ваше имя').fill(name);
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#toast')).toContainText('уже есть');
    await expect(page.locator('#view-auth')).toBeVisible();
  });

  test('неверный PIN — тост об ошибке', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Ваше имя').fill(uniqueName('Пин'));
    await page.getByPlaceholder('PIN (необязательно)').fill('1234');
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();

    await logoutViaMenu(page);
    await expect(page.locator('.auth-user-btn')).toBeVisible();

    await page.locator('.auth-user-btn').click();
    await expect(page.locator('#pin-input')).toBeVisible();
    await page.locator('#pin-input').fill('9999');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page.locator('#toast')).toContainText('Неверный PIN');
    await expect(page.locator('#view-auth')).toBeVisible();
  });

  test('верный PIN — вход в профиль', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Ваше имя').fill(uniqueName('Пин'));
    await page.getByPlaceholder('PIN (необязательно)').fill('1234');
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();

    await logoutViaMenu(page);
    await page.locator('.auth-user-btn').click();
    await page.locator('#pin-input').fill('1234');
    await page.getByRole('button', { name: 'Войти' }).click();
    await expect(page.locator('#view-app')).toBeVisible();
  });

  test('«Продолжить как…» — вход во второй профиль', async ({ page }) => {
    const [ada, bruno] = [uniqueName('Ада'), uniqueName('Бруно')];
    // сеем только список профилей: приложение показывает экран входа («Продолжить как…»)
    await page.addInitScript(([a, b]) => {
      localStorage.setItem('wm_users', JSON.stringify([
        { id: 'u1', name: a, pin: null, createdAt: 0 },
        { id: 'u2', name: b, pin: null, createdAt: 0 },
      ]));
    }, [ada, bruno]);
    await page.goto('/');
    await expect(page.locator('.auth-user-btn')).toHaveCount(2);

    await page.locator('.auth-user-btn', { hasText: ada }).click();
    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#btn-profile')).toContainText(ada);

    await logoutViaMenu(page);
    await page.locator('.auth-user-btn', { hasText: bruno }).click();
    await expect(page.locator('#btn-profile')).toContainText(bruno);
  });

  test('выход из профиля сохраняет данные', async ({ page }) => {
    const name = uniqueName('Мария');
    await page.goto('/');
    await page.getByPlaceholder('Ваше имя').fill(name);
    await page.getByRole('button', { name: 'Создать профиль' }).click();
    await expect(page.locator('#view-app')).toBeVisible();

    await addWordViaModal(page, { word: 'mela', translation: 'яблоко' });
    await expect(page.locator('.word-card')).toHaveCount(1);

    await logoutViaMenu(page);
    await expect(page.locator('#view-auth')).toBeVisible();

    // «Продолжить как…» — данные на месте
    await page.locator('.auth-user-btn', { hasText: name }).click();
    await expect(page.locator('.word-card')).toHaveCount(1);
    await expect(page.locator('.word-card .w')).toHaveText('mela');
  });
});
