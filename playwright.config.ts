import { defineConfig } from '@playwright/test';

// Покрытие собирается только в coverage-прогоне (npm run coverage):
// monocart-reporter снимает V8-покрытие прямо из Chromium, без инструментирования.
const coverage = process.env.COVERAGE === '1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 40_000,
  retries: process.env.CI ? 1 : 0,
  reporter: coverage
    ? [[
        'monocart-reporter',
        {
          name: 'WordsMemory — покрытие',
          coverage: true,
          coverageReportPath: 'coverage',
          coverageOptions: {
            thresholds: {
              global: { lines: 80, branches: 80, functions: 80, statements: 80 },
            },
          },
        },
      ]]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:8080',
    // полный Chromium в режиме new-headless: не требует chrome-headless-shell
    channel: 'chromium',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    // node-сервер: python http.server под 4 воркерами обрывал часть запросов
    command: 'node tests/static-server.mjs 8080',
    url: 'http://127.0.0.1:8080/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
});
