import coverFintech from '../assets/case-fintech.webp'
import coverMail from '../assets/case-mail.webp'
import coverShroudme from '../assets/case-shroudme.webp'
import coverLinux from '../assets/case-linux.webp'

export const site = {
  name: 'Андрей Чова',
  role: 'Full-Stack инженер & DevOps-архитектор',
  kicker: 'инфра в проде',
  subtitle: 'Full-Stack инженер & DevOps-архитектор',
  lead: 'Проектирую отказоустойчивые распределённые сервисы, собираю защищённую сетевую инфраструктуру и автоматизирую CI/CD-пайплайны под высокие нагрузки.',
  years: '10+ лет от ядра до эксплуатации',
  location: 'Remote / EU & CIS',
  email: 'hello@chova.dev',
  telegram: 'https://t.me/chova',
  github: 'https://github.com/chova',
  url: 'https://chova.dev',
  seo: {
    title: 'Андрей Чова — Full-Stack инженер и DevOps-архитектор',
    description:
      'Отказоустойчивые сервисы, защищённая сеть и CI/CD под нагрузку. ShroudMe, FinTech-контур учёта, почтовый edge-кластер и Linux performance toolkit — от архитектуры до продакшена.',
    ogImage: '/og.png',
  },
} as const

export const bootLines: string[] = [
  'init  · оркестрация · zero-downtime',
  'link  · WireGuard · QUIC · наблюдаемость',
  'check · ShroudMe · FinTech · Mailcow',
  'mount · Linux toolkit · харденинг',
  'start · продакшен',
]

export const chapters = [
  { id: 'hero', code: '00', label: 'Пульт' },
  { id: 'expertise', code: '01', label: 'Контур' },
  { id: 'cases', code: '02', label: 'Кейсы' },
  { id: 'method', code: '03', label: 'Подход' },
  { id: 'stack', code: '04', label: 'Стек' },
  { id: 'contact', code: '05', label: 'Контакт' },
] as const

export type Kpi = {
  id: string
  code: string
  value: string
  label: string
}

export const kpis: Kpi[] = [
  { id: 'sla', code: '01', value: '99.98%', label: 'средний SLA доступности сервисов' },
  { id: 'net', code: '02', value: '35%', label: 'оптимизация задержек и пропускной способности' },
  { id: 'deploy', code: '03', value: '< 3 мин', label: 'полный цикл автодеплоя в продакшн' },
  { id: 'nodes', code: '04', value: '15+', label: 'сервисов и узлов в параллельной эксплуатации' },
]

export type Product = {
  id: string
  code: string
  name: string
  line: string
  teaser: string
  pitch: string
  problem: string
  solution: string
  effect: string
  cover: string
}

export const products: Product[] = [
  {
    id: 'shroudme',
    code: '01',
    name: 'ShroudMe',
    line: 'SMVPN',
    teaser: 'Распределённая VPN-инфраструктура: ноды, мониторинг, клиенты.',
    pitch:
      'Географически распределённый сервис доступа: обфускация транспорта, VLESS Reality и стабильный канал в жёстких сетевых условиях.',
    problem:
      'Доступ обычно склеивается из чужого клиента, ручной выдачи ключей и нод без общей картины по каналу.',
    solution:
      'Платформа целиком: ноды, Prometheus и Grafana по пропускной способности, CI/CD синхронного обновления конфигов, биллинг, Telegram и клиенты Windows / Android.',
    effect: '99.95% аптайм нод',
    cover: coverShroudme,
  },
  {
    id: 'fintech',
    code: '02',
    name: 'FinTech Platform',
    line: 'GetSaldo · BUH',
    teaser: 'Фискальные данные, транзакции и регламентированная отчётность.',
    pitch:
      'Высоконагруженный контур учёта: фискальные данные, банковские операции и отчётность. В проде это GetSaldo и AI-контур BUH LLM.',
    problem:
      'Учёт и отчётность распадаются на ручные выгрузки, хрупкие интеграции и бэкапы, которым нельзя верить в инцидент.',
    solution:
      'Асинхронные очереди, валидация операций, изоляция сервисов и инкрементальные шифрованные бэкапы PostgreSQL с проверкой целостности.',
    effect: 'Отчёты −80% времени',
    cover: coverFintech,
  },
  {
    id: 'mail',
    code: '03',
    name: 'Mail & Edge',
    line: 'Mailcow',
    teaser: 'Автономная почта и кластер обратных прокси.',
    pitch:
      'Защищённый почтовый контур на Mailcow и edge-кластер обратных прокси — без чужого SaaS и без дыр в политиках.',
    problem:
      'Корпоративная почта на чужом хостинге даёт удобство и забирает изоляцию, TLS и контроль доставляемости.',
    solution:
      'SPF, DKIM, DMARC, ARC, TLS 1.3, wildcard-сертификаты Let\'s Encrypt и фильтрация вредоносного трафика на сетевом экране.',
    effect: 'Доставляемость 10/10',
    cover: coverMail,
  },
  {
    id: 'linux',
    code: '04',
    name: 'Linux Toolkit',
    line: 'Performance',
    teaser: 'sysctl, TCP BBR и быстрый аудит нового VPS.',
    pitch:
      'Набор утилит низкоуровневой настройки ядра Linux и сетевого стека TCP/IP — от sysctl до bootstrap нового узла.',
    problem:
      'Новый VPS приезжает с дефолтным стеком, ручным харденингом и окном, которое душит канал.',
    solution:
      'TCP BBR, окна передачи, CLI-сценарии базовой настройки и аудита безопасности. Узел поднимается как повторяемый контур, не как чеклист в блокноте.',
    effect: 'Канал +28% · < 1 мин',
    cover: coverLinux,
  },
]

export type Thesis = {
  id: string
  title: string
  body: string
}

export const expertise: Thesis[] = [
  {
    id: 'devops',
    title: 'DevOps и оркестрация',
    body: 'Контейнеризация, Docker Compose и Swarm. Выкат без простоя, автоматические откаты, один контур от сборки до продакшена.',
  },
  {
    id: 'net',
    title: 'Сеть и протоколы',
    body: 'Защищённые каналы: VLESS Reality, QUIC, WireGuard. Транспорт, который держит соединение, когда сеть враждебна.',
  },
  {
    id: 'observe',
    title: 'Наблюдаемость',
    body: 'Сквозной мониторинг на Prometheus, Grafana и cAdvisor. Централизованные логи и алерты до того, как пользователь увидит деградацию.',
  },
  {
    id: 'backend',
    title: 'Серверная разработка',
    body: 'Асинхронный backend на Python и TypeScript, очереди Redis, PostgreSQL. Сервис, который переживает пик, а не демо на одном запросе.',
  },
  {
    id: 'harden',
    title: 'Инфраструктурная защита',
    body: 'Харденинг Linux, iptables и UFW, Fail2ban, ротация TLS. Минимальные привилегии и периметр, который не держат на честном слове.',
  },
]

export const method: Thesis[] = [
  {
    id: 'iac',
    title: 'Автоматизация каждого этапа',
    body: 'На боевых серверах нет ручных правок. Инфраструктура описывается как код и выкатывается тем же контуром, что и приложение.',
  },
  {
    id: 'sec',
    title: 'Превентивная безопасность',
    body: 'Наименьшие привилегии, изоляция в контейнерах, регулярный аудит. Уязвимость закрывается до инцидента, а не после поста.',
  },
  {
    id: 'obs',
    title: 'Полная прозрачность',
    body: 'Метрики по каждому узлу и мгновенные алерты о деградации. Если этого не видно на графике — этого нет в эксплуатации.',
  },
]

export type StackGroup = {
  id: string
  title: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    id: 'orch',
    title: 'Оркестрация',
    items: ['Docker', 'Compose / Swarm', 'CI/CD', 'Zero-downtime'],
  },
  {
    id: 'observe',
    title: 'Наблюдаемость',
    items: ['Prometheus', 'Grafana', 'cAdvisor', 'Логи'],
  },
  {
    id: 'net',
    title: 'Сеть',
    items: ['WireGuard', 'QUIC', 'VLESS Reality', 'TLS 1.3'],
  },
  {
    id: 'runtime',
    title: 'Платформа',
    items: ['Python / TypeScript', 'PostgreSQL', 'Redis', 'Linux'],
  },
]
