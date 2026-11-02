// Действия над приложением: модалки, группы, подтверждения.
import { expect, type Page } from '@playwright/test';

export type NewWord = {
  word: string;
  transcription?: string;
  translation: string;
  /** Один пример: добавляется первой строкой в модалке. */
  example?: { text: string; translation: string };
  tags?: string;
};

/** Добавляет слово через модалку «Новое слово». Поля скоупятся к открытой модалке:
 *  у «Слова в наборе» (#modal-group-word) есть лейблы с теми же именами. */
export async function addWordViaModal(page: Page, w: NewWord) {
  const modal = page.locator('#modal-word');
  await page.getByRole('button', { name: /Добавить слово/ }).click();
  await modal.getByLabel('Слово').fill(w.word);
  if (w.transcription) await modal.getByLabel('Транскрипция (МФА)').fill(w.transcription);
  await modal.getByLabel('Перевод (русский)').fill(w.translation);
  if (w.example) {
    await page.getByRole('button', { name: '+ Добавить пример' }).click();
    // модалка открывается с одной пустой строкой — заполняем только что добавленную
    const row = modal.locator('.example-row').last();
    await row.locator('.ex-text').fill(w.example.text);
    await row.locator('.ex-tr').fill(w.example.translation);
  }
  if (w.tags) await modal.getByLabel('Теги (через запятую)').fill(w.tags);
  await modal.getByRole('button', { name: 'Сохранить' }).click();
  await expect(modal).not.toBeVisible();
}

/** Открывает страницу «Группы» и набор по названию карточки.
 *  Зеркальные наборы (it/en) называются одинаково — уточняйте язык. */
export async function openGroup(page: Page, name: string | RegExp, lang?: 'it' | 'en') {
  await page.getByRole('button', { name: /Группы/ }).click();
  let card = page.locator('.group-card', { hasText: name });
  if (lang) card = card.filter({ hasText: lang === 'en' ? '🇬🇧 EN' : '🇮🇹 IT' });
  await card.click();
  await expect(page.locator('.g-list')).toBeVisible();
}

/** Кнопка в модалке подтверждения: «Удалить»/«Выйти» — подтверждение, «Отмена» — отмена.
 *  Скоуп к диалогу: без него regexp цепляет кнопки «Удалить» на карточках слов. */
export async function resolveConfirm(page: Page, accept = true) {
  await page.locator('#modal-confirm')
    .getByRole('button', { name: accept ? /^(Удалить|Выйти)$/ : 'Отмена' })
    .click();
}

/** Переключает языковую вкладку словаря (вкладки — role=tab, не button). */
export async function switchLang(page: Page, lang: 'it' | 'en') {
  await page.locator(lang === 'it' ? '#tab-it' : '#tab-en').click();
}
