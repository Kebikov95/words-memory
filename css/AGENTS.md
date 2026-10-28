# AGENTS.md — css/

Все стили приложения в одном файле `style.css` (~970 строк). Дизайн-система:
минимализм, система отступов 8px, один акцентный цвет, мягкие тени,
микроанимации 160ms. Файл подключается в `index.html` одним `<link>`.

## style.css

### Переменные и темы (начало файла)

- `:root` — палитра и токены: цвета (`--bg`, `--surface`, `--text`,
  `--accent`, `--ok`, `--err` и их `*-soft` варианты), `--border`,
  тени (`--shadow`, `--shadow-lg`), радиусы (`--radius`, `--radius-sm`),
  анимации (`--dur: 160ms`, `--ease`).
- `[data-theme="dark"]` — тёмная тема (переключатель в приложении).
- `@media (prefers-color-scheme: dark)` — авто-тёмная тема, когда
  `data-theme` не выставлен явно (класс `:root:not([data-theme="light"])`).

### Секции (в порядке следования, искать по комментариям `/* ---------- ... ---------- */`)

| Секция | Что описывает |
|---|---|
| база | reset, `body`, скроллбары, общая типографика |
| кнопки | `.btn` (+ `-primary`, `-accent`, `-ghost`, `-danger`, `-sm`), `.icon-btn`, `.user-chip` |
| поля ввода | `input`, `select`, `textarea`, `.search-wrap`, `.field`, `.field-row`, `.hint` |
| экраны | `.view`, `.hidden`, переключение экранов приложения |
| вход | экран профиля: `.auth-view`, `.auth-card`, `.auth-users`, `.auth-form`, `.auth-user-btn` |
| шапка | `.header`, `.header-inner`, `.brand`, вкладки языков `.tabs`/`.tab`, навигация страниц `.pages-nav`/`.page-tab`, `.header-actions` |
| основная область | `.main`, `.toolbar` тулбара словаря |
| карточки слов | `.words-grid`, `.word-card`, `.word-img`, `.word-body`, `.word-title`, `.word-speakers`, `.word-examples`, `.tag`, `.word-actions`, анимация появления |
| пустое состояние | `.empty-state` («Здесь пока пусто») |
| модалки | `dialog.modal`, `.modal-body`, `.modal-head`, `.modal-actions`, `.confirm-text` |
| тренировка | игровой экран: `.game-view`, `.game-top`, `.progress-bar`, `.game-area`, `.game-card`, `.game-word`, `.game-input`, тайлы букв `.letters-*`, фидбек `.game-feedback` |
| результаты | `.results-view`, `.results-card`, `.res-mistakes`, `.mistake-row` |
| режимы тренировки | `.mode-list`, `.mode-item` (радио-выбор режима тренировки) |
| статистика | `.stat-line` в модалке статистики |
| toast | `.toast` (+ `.err`) — всплывающие уведомления |
| страницы | переключение «Словарь»/«Группы» (`#page-words` / `#page-groups`) |
| каталог групп | `.groups-head`, `.lang-chips`, `.chip-btn`, `.groups-grid`, `.group-card` |
| просмотр набора | шапка и тулбар набора, список строк `.g-row`/`.g-check`/`.g-texts`, пометка «в словаре» |
| прочее | утилиты и мелочи, не вошедшие выше |

## Соглашения

- Цвета и отступы брать только из CSS-переменных `:root`, не хардкодить.
- Новые стили добавлять в существующую секцию по смыслу или заводить новую
  секцию с комментарием-разделителем в том же формате.
- При изменении файла повысить `?v=N` у `<link>` в `index.html`
  (кеш-бастинг).
