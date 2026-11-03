// Помощники тренировок: надёжная синхронизация с отрисовкой задания + решатели.
// Счётчик обновляется сразу после ответа, а следующее задание рендерится с задержкой
// (900–1600 мс) — поэтому синхронизируемся на состоянии DOM, а не только на счётчике:
//  - «Собери слово»: буквы пула однозначно задают слово (анаграмма);
//  - «Диктант»: у задания ровно одна новая озвучка стаба TTS;
//  - сопоставления: пары кликаются по id, сетка показывает чанки по 4–5 пар.
import { expect, type Page } from '@playwright/test';

export type SeedEntry = { id: string; word: string; translation: string };

const counter = (page: Page) => page.locator('#game-counter');
const anagram = (s: string) => [...s].sort().join('');

/** Ожидает счётчик «done / total». */
export async function expectCounter(page: Page, done: number, total: number) {
  await expect(counter(page)).toHaveText(`${done} / ${total}`);
}

/** Ждёт, что счётчик вырастет больше done; возвращает актуальное значение. */
export async function waitDoneGrown(page: Page, done: number, total: number): Promise<number> {
  await expect.poll(async () => {
    if (await page.locator('#res-percent').isVisible()) return total;
    const t = await counter(page).innerText();
    return parseInt(t.split('/')[0].trim(), 10);
  }, { timeout: 15_000 }).toBeGreaterThan(done);
  if (await page.locator('#res-percent').isVisible()) return total;
  const t = await counter(page).innerText();
  return parseInt(t.split('/')[0].trim(), 10);
}

/** Текущее задание «Собери слово» с номером done: ждёт пул-анаграмму одного из seeds.
 *  Важно: после ответа старый пул остаётся на экране до рендера следующего задания
 *  (окно фидбека) — отличаем его по непустому тексту #game-feedback. */
export async function waitForAssembleWord(
  page: Page, seeds: SeedEntry[], done: number, total: number,
): Promise<SeedEntry> {
  await expect.poll(async () => {
    const feedback = await page.locator('#game-feedback').innerText().catch(() => 'x');
    if (feedback.trim()) return 'feedback';
    const t = await counter(page).innerText().catch(() => '');
    if (t.trim() !== `${done} / ${total}`) return 'counter';
    const letters = await page.evaluate(() =>
      [...document.querySelectorAll('#as-pool .letter-tile')].map(b => b.textContent).join(''));
    if (!letters) return 'pending';
    return seeds.some(s => anagram(s.word) === anagram(letters)) ? 'ready' : 'pending';
  }, { timeout: 15_000 }).toBe('ready');

  const letters = await page.evaluate(() =>
    [...document.querySelectorAll('#as-pool .letter-tile')].map(b => b.textContent).join(''));
  return seeds.find(s => anagram(s.word) === anagram(letters))!;
}

/** Текущее слово диктанта: ждёт новую озвучку стаба TTS (звонков стало больше minCalls). */
export async function waitForSpokenWord(page: Page, minCalls: number): Promise<string> {
  await expect.poll(async () => {
    const n = await page.evaluate(() => (window as any).__ttsCalls?.length ?? 0);
    return n >= minCalls ? 'ready' : 'pending';
  }, { timeout: 15_000 }).toBe('ready');
  const calls = await page.evaluate(() => (window as any).__ttsCalls);
  return calls[calls.length - 1].text;
}

/** Механический сбор ответа из плиток (для неверного — в обратном порядке). */
export async function solveAssemble(page: Page, answer: string, correct = true) {
  const chars = correct ? [...answer] : [...answer].reverse();
  if (!correct && [...answer].reverse().join('') === answer) {
    throw new Error(`Слово-палиндром нельзя завалить реверсом: ${answer}`);
  }
  for (const ch of chars) {
    await page.locator('#as-pool .letter-tile:not([disabled])', { hasText: ch }).first().click();
  }
  await page.locator('#as-check').click();
}

/** Диктант: вводит ответ (верный или заведомо неверный). */
export async function solveDictation(page: Page, answer: string) {
  await page.locator('#dt-input').fill(answer);
  await page.locator('#dt-check').click();
}

/** Сопоставление: соединяет левую и правую части по id сида. */
export async function matchPair(page: Page, id: string) {
  await page.locator(`.match-grid [data-left="${id}"]`).click();
  await page.locator(`.match-grid [data-right="${id}"]`).click();
}

/** Сопоставление в обратном порядке: сначала правая часть, затем левая. */
export async function matchPairReverse(page: Page, id: string) {
  await page.locator(`.match-grid [data-right="${id}"]`).click();
  await page.locator(`.match-grid [data-left="${id}"]`).click();
}

/** Неверная пара: левый id + правый id другого слова. */
export async function matchWrong(page: Page, leftId: string, rightId: string) {
  await page.locator(`.match-grid [data-left="${leftId}"]`).click();
  await page.locator(`.match-grid [data-right="${rightId}"]`).click();
  await expect(page.locator('#game-feedback')).toContainText('Не та пара');
}

/** Решает все чанки сопоставления по id (сетка рендерит чанки по 4–5 пар). */
export async function solveMatchPairs(page: Page, ids: string[]) {
  const remaining = new Set(ids);
  while (remaining.size) {
    if (await page.locator('#res-percent').isVisible()) return;
    const next = page.locator('.match-grid [data-left]:not(.done)').first();
    if (!(await next.count())) {
      // чанк сменился — ждём появление следующего или экрана результатов
      await expect.poll(async () =>
        ((await page.locator('#res-percent').isVisible()) ? 1 : 0) ||
        (await page.locator('.match-grid [data-left]:not(.done)').count()), { timeout: 15_000 })
        .toBeGreaterThan(0);
      continue;
    }
    const id = await next.getAttribute('data-left');
    if (id && remaining.has(id)) {
      await matchPair(page, id);
      remaining.delete(id);
    } else if (id) {
      // id не из списка — сетка уже следующего чанка: не зацикливаемся
      remaining.delete(id);
    }
  }
}

/** Универсальное решение текущего задания «Микса» по сид-карте; возвращает тип задания.
 *  Для диктанта caller обязан дождаться озвучки и передать слово в spoken. */
async function solveAnyCurrentTask(
  page: Page,
  seeds: SeedEntry[],
  failNow: boolean,
  seedById: Map<string, SeedEntry>,
  spoken: string,
): Promise<string> {
  if (await page.locator('.match-grid').count()) {
    const type = (await page.locator('.match-grid .mi-emoji, .match-grid img').count())
      ? 'match-image'
      : 'match-word';
    // чанк сопоставления: решаем все видимые пары (первую — с ошибкой, если нужно)
    let failed = false;
    for (;;) {
      const next = page.locator('.match-grid [data-left]:not(.done)').first();
      if (!(await next.count())) break;
      const id = (await next.getAttribute('data-left'))!;
      const seed = seedById.get(id)!;
      if (failNow && !failed) {
        failed = true;
        const other = seeds.find(s => s.id !== id)!;
        await matchWrong(page, id, other.id);
        await matchPair(page, id);
        continue;
      }
      await matchPair(page, id);
    }
    return type;
  }
  if (await page.locator('#as-slots').count()) {
    const letters = await page.evaluate(() =>
      [...document.querySelectorAll('#as-pool .letter-tile')].map(b => b.textContent).join(''));
    const seed = seeds.find(s => anagram(s.word) === anagram(letters))!;
    const answer = failNow ? [...seed.word].reverse().join('') : seed.word;
    for (const ch of [...answer]) {
      await page.locator('#as-pool .letter-tile:not([disabled])', { hasText: ch }).first().click();
    }
    await page.locator('#as-check').click();
    return 'assemble';
  }
  if (await page.locator('#dt-input').count()) {
    await solveDictation(page, failNow ? spoken.toUpperCase() : spoken);
    return 'dictation';
  }
  throw new Error('Не распознан тип текущего задания');
}

/** Прогоняет сессию «Микса» до экрана результатов; возвращает типы встретившихся заданий.
 *  failIndex — номер задания (по счётчику), которое решается с ошибкой. */
export async function solveAllTasks(
  page: Page,
  seeds: SeedEntry[],
  total: number,
  failIndex?: number,
): Promise<string[]> {
  const seedById = new Map(seeds.map(s => [s.id, s]));
  const seen: string[] = [];
  let failUsed = false;
  let done = parseInt((await counter(page).innerText()).split('/')[0].trim(), 10) || 0;

  while (done < total) {
    if (await page.locator('#res-percent').isVisible()) break;

    // ждём задание с номером done: счётчик обновляется сразу после ответа,
    // а DOM предыдущего задания висит до конца окна фидбека
    await expect.poll(async () => {
      if (await page.locator('#res-percent').isVisible()) return 'done';
      const fb = await page.locator('#game-feedback').innerText().catch(() => 'x');
      if (fb.trim()) return 'feedback';
      const t = await counter(page).innerText();
      if (t.trim() !== `${done} / ${total}`) return 'counter';
      // чанк сопоставления без неотгаданных пар — старый чанк в переходе (600 мс)
      const grid = page.locator('.match-grid');
      if (await grid.count() && !(await grid.locator('[data-left]:not(.done)').count())) return 'stale';
      return 'ready';
    }, { timeout: 15_000 }).toBe('ready');
    if (await page.locator('#res-percent').isVisible()) break;

    const failNow = !failUsed && failIndex === done;
    if (failNow) failUsed = true;

    // в диктанте внутри микса: ждём стартовую озвучку задания. Она приходит
    // ~через 310 мс после рендера; если к замеру baseline она уже прозвучала —
    // счётчик не вырастет, ждём стабилизации и берём последний вызов
    // (озвучка-ответ предыдущего задания не может прийти позже: её блокирует окно фидбека)
    let spoken = '';
    if (await page.locator('#dt-input').count()) {
      const baseline = await page.evaluate(() => (window as any).__ttsCalls?.length ?? 0);
      const deadline = Date.now() + 600;
      await expect.poll(async () => {
        const n = await page.evaluate(() => (window as any).__ttsCalls?.length ?? 0);
        return n > baseline || Date.now() > deadline ? 'ready' : 'pending';
      }, { timeout: 3000 }).toBe('ready');
      spoken = await page.evaluate(() => {
        const calls = (window as any).__ttsCalls;
        return calls[calls.length - 1].text;
      });
    }

    seen.push(await solveAnyCurrentTask(page, seeds, failNow, seedById, spoken));
    done = await waitDoneGrown(page, done, total);
  }

  await expect(page.locator('#res-percent')).toBeVisible();
  return seen;
}
