# MIRA — «Лак и тишина»

Самостоятельный концептуальный лендинг. React + Vite + TypeScript + CSS Modules. Все данные вымышлены. Форма работает только в оперативной памяти страницы, без отправки, cookies или browser storage.

## Запуск

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Структура

- `src/app/` — композиция страницы и адаптивные стили.
- `src/features/booking-form/` — шаги записи и валидация.
- `src/features/visit-builder/` — единый источник состояния выбора.
- `src/data/content.ts` — услуги, специалисты, комплексы, галерея, FAQ и фиксированное демонстрационное расписание 9–13 ноября 2026.
- `src/styles/global.css` — токены и локальная типографика.
- `public/images/sources.json` — источники фотографий, лицензия, назначение и кадрирование.
- `tests/` и `qa/` — браузерные сценарии, отчёт и снимки.

Prata и Onest подключены локально из пакетов Fontsource (SIL Open Font License). Тексты лицензий скопированы в `public/licenses/`. Фотографии Pexels — учебные иллюстрации; не реальные работы салона и не реальные сотрудники. Обновить фотографии: `node scripts/prepare-assets.mjs` (требуется сеть).

## Проверки в браузере

`node scripts/run-browser-checks.mjs` поднимает изолированный preview, запускает Playwright и закрывает сервер. Используется установленный Microsoft Edge. `npm run test:e2e` также доступен при работающем preview на 5173. Можно убрать `channel: 'msedge'` в `playwright.config.ts` и установить Chromium через `npx playwright install chromium`. Снимки сохраняются в `qa/screenshots/`.

## GitHub Pages

Публикация не выполнялась. Неизвестное имя репозитория: локальная сборка использует переносимый `base: './'`. Для ручной сборки путь задаётся переменной `VITE_BASE_PATH=/имя-репозитория/` в `vite.config.ts`.

Перед публикацией создайте отдельный репозиторий, загрузите исходники, включите Pages → Source → GitHub Actions. Запустите вручную workflow `Check and publish MIRA`: он выполнит typecheck, build и публикацию с именем репозитория в base. Для корневого `username.github.io` замените VITE_BASE_PATH в workflow на `/`. Автоматического deploy по push нет.

Перед превращением концепта в настоящий коммерческий сайт нужны проверенные контакты, реальное расписание, условия сервиса и лицензированные материалы с согласиями. Реальную форму следует разрабатывать отдельно; текущая никогда не создаёт запись.
