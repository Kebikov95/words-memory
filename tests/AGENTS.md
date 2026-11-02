# AGENTS.md — tests/

E2E-тесты WordsMemory на Playwright. Тестируем только через UI, сеть всегда замокана.

## Запуск

```bash
npm install
npx playwright install chromium
npm test          # headless-прогон
npm run test:ui   # UI-режим
npm run test:headed
npm run coverage  # прогон + code coverage (порог 80%, отчёт coverage/index.html)
npm run report    # открыть HTML-отчёт последнего прогона
```

Сервер поднимается автоматически (`webServer` в playwright.config.ts) — это
`node tests/static-server.mjs 8080` (node вместо python: не теряет запросы
при параллельных воркерах). Тесты ходят на `http://127.0.0.1` — это
secure-context, нужен для `crypto.subtle` (хеширование PIN).

## Структура

- `fixtures/app.ts` — базовая фикстура `appPage` (моки сети + стаб TTS + сид
  профиля/словаря + открытая страница) и `testWithWords` (то же + 5 итальянских
  слов: mela, casa, sole, vino, pane с id w1…w5);
- `helpers/app.ts` — типы сид-слов, `uniqueName()`, `SEED_WORDS_IT`;
- `helpers/actions.ts` — действия: `addWordViaModal`, `openGroup`,
  `resolveConfirm`, `switchLang`;
- `helpers/games.ts` — решатели тренировок и синхронизация: `waitForAssembleWord`
  (анаграмма пула), `waitForSpokenWord` (рост числа озвучек), `solveMatchPairs`
  (чанки по 4–5 пар), `solveAllTasks` (драйвер «Микса»);
- `*.spec.ts` — спеки по экранам: `auth`, `data`, `dictionary`, `groups`, `games`.

## Соглашения (обязательны)

1. **Сеть всегда замокана.** Википедия отвечает детерминированной миниатюрой —
   SVG data-URL со словом внутри (рендерится без сетевого запроса); шрифты
   abort. Маршруты — только **regex**: Playwright-глобы вида `**/x/**` не
   матчатся на `http://127.0.0.1` (на это уже наступали).
2. **TTS — стаб** через `addInitScript`: фиксированные голоса it-IT/en-US,
   каждый `speak()` пишет вызов в `window.__ttsCalls` и вызывает `onend`
   асинхронно. Ждать озвучку — `waitForSpokenWord(page, minCalls)`.
3. **Синхронизация с тренировкой.** Счётчик обновляется сразу после ответа,
   а следующее задание рендерится с задержкой 900–1600 мс: не читать
   `.game-word` сразу после роста счётчика — используйте `waitForAssembleWord`
   (пул-анаграмма) / `waitForSpokenWord`. Сопоставления рендерятся чанками
   по 4–5 пар (`solveMatchPairs`).
4. **Никаких `waitForTimeout`/sleep** — только автожидкости (`expect.poll`,
   локаторы). Проверка `#res-percent` — через `.isVisible()` (элемент всегда
   есть в статичном HTML скрытого экрана результатов).
5. **Селекторы**: `getByRole`/`getByLabel`/`getByPlaceholder` + скоуп к модалке
   (`#modal-word`, `#modal-confirm`…): у разных модалок есть одинаковые лейблы
   («Перевод (русский)» есть и в слове, и в «Слове в наборе»), а `data-close`
   в модалке два. Кнопки-двойники («+ Создать набор» и сабмит «Создать набор»)
   — `exact: true`.
6. **Изоляция**: свежий контекст на тест (дефолт Playwright), уникальные имена
   профилей (`uniqueName`). Сид через `addInitScript` — он выполняется на
   каждой навигации, поэтому после logout перезаливать `wm_current` нельзя
   (приложение авто-войдёт обратно).
7. **Код приложения не менять** ради теста; исключение — aria-label/data-атрибут,
   зафиксированный здесь.

## Code coverage

`npm run coverage` — репортер **monocart-reporter** снимает V8-покрытие
прямо из Chromium (без инструментирования — в проекте нет сборки). Порог:
80% по lines/branches/functions/statements, при недоборе прогон падает.
Отчёт: `coverage/index.html`. Исключений из покрытия нет — статические
data-файлы исполняются как строки и покрываются загрузкой страницы.

## Матрица «сценарий → спек»

| Сценарий | Спек |
|---|---|
| Профили: создание, PIN, дубликаты, «Продолжить как…», выход | `auth.spec.ts` |
| Структура каталога (35 групп, зеркала, полнота слов), изоляция, XSS | `data.spec.ts` |
| Словарь: карточка, транскрипция, картинки, TTS, редактирование, массовое добавление, поиск, вкладки, экспорт/импорт, тема | `dictionary.spec.ts` |
| Группы: каталог, фильтры, строки набора, добавление, тренировка из набора, свои наборы | `groups.spec.ts` |
| Тренировки: 5 режимов, сборка, диктант, сопоставления, микс, результаты, статистика | `games.spec.ts` |
