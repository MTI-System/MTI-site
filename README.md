[![Deploy new version](https://github.com/MTI-System/MTI-site/actions/workflows/deploy-new-version.yml/badge.svg)](https://github.com/MTI-System/MTI-site/actions/workflows/deploy-new-version.yml)

# MTI-site — фронтенд МТИ (Next.js)

Репозиторий фронтенда сайта **МТИ** (Менеджер Турнирной Информации). Код на **Next.js + TypeScript** с размещением в `src/`. В репозитории присутствуют `Dockerfile`, `next.config.ts`, `postcss.config.mjs`, GitHub Actions в `.github/workflows/`. См. дерево в корне репозитория.

Продакшн: `https://mtiyt.ru`
О проекте: `https://mtiyt.ru/about`

---

## Возможности (основные разделы сайта)

- «Задачи» — материалы и навигация по ним.
- «Статистика» — сводные показатели и аналитика.
- «Турниры» и «Бои» — расписания, статусы, этапы.
- «Люди» — участники, команды, жюри и их профили.
- «Организаторам» — инструменты администрирования.

> Набор разделов и функций может меняться по релизам.

---

## Технологии

- **Next.js** (App Router, `src/`)
- **React 18** + **TypeScript**
- **PostCSS** (см. `postcss.config.mjs`)
- Сборщик: Next.js (Webpack/Turbopack по конфигурации)
- Линтинг: **ESLint**; форматирование: **Prettier**

_В проекте может использоваться Tailwind CSS и другие библиотеки UI — смотрите `package.json`._

---
