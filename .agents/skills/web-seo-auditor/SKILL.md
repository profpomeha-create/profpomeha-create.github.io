---
name: web-seo-auditor
description: Production-grade checklist, audit protocol, and verification rules for web applications covering SEO, Indexing (sitemap, robots, canonicals, noindex), Schema markup, Core Web Vitals, Bot accessibility (Cloudflare, WAF, geoblock), and metadata.
---

# Web SEO & Indexing Production Auditor

## Назначение
Этот скил используется при любой разработке, аудите, рефакторинге и деплое веб-приложений. Он гарантирует, что сайт полностью готов к индексации поисковыми системами (Google, Яндекс, Bing), обладает превосходной производительностью (Core Web Vitals) и корректным отображением в социальных сетях и поисковой выдаче.

## Рабочий процесс проверки (Step-by-Step Audit Workflow)

### 1. Проверка индексации (Crawlability & Robots)
1. **robots.txt**:
   - Убедись, что файл доступен по URL `/robots.txt`.
   - Проверь директивы `Allow` / `Disallow`.
   - Обязательно должна присутствовать строка `Sitemap: https://<domain>/sitemap.xml`.
   - **Запрет блокировки UTM**: НИКОГДА не писать `Disallow: /*?*utm_*`, `yclid`, `gclid`. Блокировка параметров UTM запрещает Googlebot краулить внешние ссылки и бэклинки, в результате бот не видит `<link rel="canonical">` и не передает ссылочный вес сайту.
2. **sitemap.xml**:
   - Проверь валидность XML.
   - Убедись, что все URL содержат боевой домен и протокол `https://` (никаких `http://`, `localhost`, `127.0.0.1` или превью-доменов).
   - Проверь, что в карте нет 404 страниц или редиректов.
3. **Мета-тег Robots и заголовки**:
   - Проверь отсутствие `<meta name="robots" content="noindex,nofollow">` на публичных страницах.
   - Проверь серверные заголовки `X-Robots-Tag`.
4. **Canonical URL**:
   - Проверь наличие `<link rel="canonical" href="...">` на каждой странице.
   - Убедись, что канонический адрес указывает на себя (self-canonical) без лишних query-параметров и с единым стилем trailing slash.

### 2. Доступность для краулеров (Bot Access & Infrastructure)
1. **Cloudflare & WAF**:
   - Режим "I'm Under Attack" блокирует ботов Google и Яндекс. Убедись, что он выключен в штатном режиме.
   - WAF правила должны иметь исключения для верифицированных ботов (`cf.client.bot == true`).
2. **Геоблокировки (Geoblocking)**:
   - Googlebot сканирует страницы преимущественно с IP-адресов США. Любая блокировка по странам не должна затрагивать ботов.
3. **Рендеринг и ссылки**:
   - Все внутренние переходы должны быть оформлены как нативные `<a href="/path">`.
   - Не используй Hash-роутинг (`#/path`).
   - Убедись, что критический контент и мета-теги присутствуют в исходном HTML (SSG/SSR пререндеринг).
4. **Обработка 404**:
   - Несуществующие страницы должны отдавать честный HTTP статус 404.
   - Наличие брендовой 404 страницы со ссылками на рабочие разделы и мета-тегом `robots: noindex, follow`.
5. **Безопасность и утечки**:
   - Выключить sourcemaps (`.map`) в продакшене.
   - Закрыть в веб-сервере доступ к системным файлам (`.env`, `.git`).
   - Заголовок HSTS (`Strict-Transport-Security`).

### 3. On-Page SEO и Структура контента
1. **Title и Description**:
   - Уникальный `<title>` на каждой странице.
   - Уникальный `<meta name="description">` (120–160 символов).
2. **Иерархия заголовков**:
   - Ровно один `<h1>` на странице.
   - Структурированные `<h2>` и `<h3>` без нарушения уровней.
3. **Изображения**:
   - Каждый `<img>` обязан иметь понятный атрибут `alt="..."`.
   - Атрибуты `width` и `height` для предотвращения CLS (Cumulative Layout Shift).
   - Форматы WebP или AVIF с компрессией.
4. **Семантика и язык**:
   - Атрибут `<html lang="ru">` (или соответствующий).
   - `hreflang` и `x-default` для мультиязычных сайтов.

### 4. Микроразметка (JSON-LD)
Встраивай структурированные данные через `<script type="application/ld+json">`:
- **E-E-A-T (Person / Organization)**: Указывай массив `sameAs` со ссылками на профили в авторитетных источниках (GitHub, LinkedIn, Telegram, VC, Habr, карты).
- **BreadcrumbList**: Для отображения цепочки разделов в сниппете.
- **FAQPage**: На страницах с блоком вопросов и ответов.
- **Service / Product**: На страницах услуг и продуктов с описанием, ценой и провайдером.
- Проверяй отсутствие битых ссылок на логотипы и изображения внутри схем.

### 5. Сниппеты в поиске и Социальные сети
1. **Open Graph**:
   - `og:title`, `og:description`, `og:image` (1200x630px), `og:url`, `og:type`, `og:site_name`.
2. **Twitter Cards**:
   - `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`.
3. **Favicon**:
   - Наличие `favicon.ico` и иконок кратных 48x48 пикселей (48x48, 96x96, 144x144, 192x192) для корректного отображения иконки в результатах поиска Google SERP.

### 6. Core Web Vitals и Скорость
- **LCP (Largest Contentful Paint)** < 2.5 сек:
  - Задавать `fetchpriority="high"` и `loading="eager"` (или `<link rel="preload" as="image">`) для LCP-картинки первого экрана.
  - Задавать `loading="lazy"` и `decoding="async"` для картинок ниже сгиба.
- **CLS (Cumulative Layout Shift)** < 0.1: фиксация размеров картинок, баннеров, шрифтов.
- **INP (Interaction to Next Paint)** < 200 мс: избегать блокировки основного потока тяжелым JS.
- **Шрифты**: `font-display: swap`, сабсеттинг и предзагрузка критических шрифтов.
- **Сжатие**: Brotli (`.br`) + Gzip для текстовых ассетов.

### 7. Сервисы вебмастеров и быстрая индексация
- Подтверждение владения в **Google Search Console** (HTML-файл, meta-тег или DNS).
- Подтверждение в **Яндекс Вебмастере** (региональная привязка, мониторинг поисковых запросов).
- Подключение **IndexNow API** для мгновенного уведомления Яндекса и Bing об обновлениях страниц.
