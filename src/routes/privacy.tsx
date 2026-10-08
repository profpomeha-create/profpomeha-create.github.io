import { createFileRoute, Link } from '@tanstack/react-router'
import { PageShell } from '~/components/PageShell'
import { site } from '~/content/site'
import { breadcrumbList, organizationNode, pageHead } from '~/lib/seo'

export const Route = createFileRoute('/privacy')({
  head: () =>
    pageHead({
      title: 'Политика конфиденциальности и Cookies — AAA lab',
      description:
        'Политика конфиденциальности, правила обработки персональных данных, использование файлов cookie и условия сервиса «Яндекс Метрика» на сайте AAA lab.',
      path: '/privacy',
      jsonLd: [
        organizationNode(),
        breadcrumbList([
          { name: site.name, path: '/' },
          { name: 'Конфиденциальность', path: '/privacy' },
        ]),
      ],
    }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <PageShell crumbs={[{ label: site.name, to: '/' }, { label: 'конфиденциальность' }]} cta={false}>
      <article className="chapter-fit py-12 md:py-16 max-w-4xl">
        <header className="bay-head mb-8">
          <span className="tag tag-signal">00</span>
          <span className="tag">регламент · 152-фз · метрика</span>
        </header>

        <h1 className="plate plate-md text-[length:var(--step-3)] font-semibold tracking-[-0.03em] leading-tight mb-6">
          Политика конфиденциальности и использование файлов cookie
        </h1>

        <p className="text-[length:var(--step-0)] text-muted leading-relaxed mb-12 max-w-3xl">
          Настоящий документ определяет порядок обработки персональных данных пользователей сайта{' '}
          <strong className="text-[var(--ink)]">aaa.is-a.dev</strong>, а также использование файлов cookie и сервисов
          веб-аналитики в соответствии с Федеральным законом РФ № 152-ФЗ «О персональных данных» и правилами Яндекса.
        </p>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="panel p-6 md:p-8">
            <h2 className="text-[length:var(--step-1)] font-semibold text-signal mb-4">
              1. Общие положения и оператор данных
            </h2>
            <div className="space-y-3 text-[length:var(--step-00)] text-muted leading-relaxed">
              <p>
                1.1. Оператором сайта и ответственным за обработку данных является команда инженерной практики{' '}
                <strong className="text-[var(--ink)]">{site.name}</strong> (контактный e-mail для обращений:{' '}
                <a href={`mailto:${site.email}`} className="text-signal underline hover:no-underline">
                  {site.email}
                </a>
                ).
              </p>
              <p>
                1.2. Использование сайта означает безоговорочное согласие пользователя с настоящей Политикой и указанными
                в ней условиями обработки информации. В случае несогласия с этими условиями пользователь должен воздержаться
                от использования сайта.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="panel p-6 md:p-8">
            <h2 className="text-[length:var(--step-1)] font-semibold text-signal mb-4">
              2. Сбор и обработка персональных данных (152-ФЗ)
            </h2>
            <div className="space-y-3 text-[length:var(--step-00)] text-muted leading-relaxed">
              <p>
                2.1. При заполнении формы брифа или обратной связи на сайте пользователь добровольно предоставляет следующие
                данные:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Имя или псевдоним контактного лица;</li>
                <li>Наименование компании / организации;</li>
                <li>Контактные данные (адрес электронной почты, телефон, аккаунт в Telegram или других мессенджерах);</li>
                <li>Текстовое описание технической задачи или инфраструктурного запроса.</li>
              </ul>
              <p>
                2.2. <strong className="text-[var(--ink)]">Цель обработки данных:</strong> установление обратной связи,
                предоставление консультаций, подготовка коммерческого предложения, согласование архитектурного плана работ
                и исполнение договорных обязательств.
              </p>
              <p>
                2.3. Персональные данные не передаются третьим лицам, за исключением случаев, прямо предусмотренных
                законодательством РФ. Мы не используем полученные контакты для спам-рассылок и не продаем базы данных.
              </p>
            </div>
          </section>

          {/* Section 3 - Yandex Metrika & Cookies */}
          <section className="panel p-6 md:p-8 border-signal/40">
            <div className="flex items-center gap-2 mb-4">
              <span className="led led-on" />
              <h2 className="text-[length:var(--step-1)] font-semibold text-signal">
                3. Использование файлов cookie и сервиса «Яндекс Метрика»
              </h2>
            </div>
            <div className="space-y-4 text-[length:var(--step-00)] text-muted leading-relaxed">
              <p>
                3.1. Для улучшения работы сайта, анализа поведения пользователей и обеспечения надёжности сервиса на сайте
                применяются файлы cookie (небольшие фрагменты данных, сохраняемые браузером пользователя), а также установлен
                счётчик аналитической системы <strong className="text-[var(--ink)]">«Яндекс Метрика»</strong> (идентификатор:{' '}
                <code className="text-signal font-mono">113563863</code>), предоставляемый ООО «ЯНДЕКС» (Россия, 119021, г.
                Москва, ул. Льва Толстого, 16).
              </p>
              <p>
                3.2. Счётчик Яндекс Метрики собирает обезличенные данные о посещении сайта, включая:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>URL посещаемых страниц, переходы и длительность сессии;</li>
                <li>Тип устройства, разрешение экрана, операционную систему и версию веб-браузера;</li>
                <li>Географический регион и источник перехода (поисковая система, прямая ссылка, соцсеть);</li>
                <li>Действия с элементами интерфейса (клики, скролл страниц, работу вебвизора).</li>
              </ul>
              <p>
                3.3. В соответствии с требованиями законодательства и регламентов сервиса, обработка аналитических данных
                осуществляется на основании{' '}
                <a
                  href="https://yandex.ru/legal/metrica_termsofuse/ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal underline hover:no-underline font-medium"
                >
                  Условий использования сервиса «Яндекс Метрика»
                </a>{' '}
                и{' '}
                <a
                  href="https://yandex.ru/legal/confidential/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal underline hover:no-underline font-medium"
                >
                  Политики конфиденциальности Яндекса
                </a>
                .
              </p>
              <p>
                3.4. <strong className="text-[var(--ink)]">Отказ от сбора данных:</strong> Пользователь может запретить
                сохранение файлов cookie в настройках используемого веб-браузера либо установить официальный плагин:{' '}
                <a
                  href="https://yandex.ru/support/metrica/general/opt-out.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal underline hover:no-underline"
                >
                  Блокировщик Яндекс Метрики
                </a>
                . Отключение cookie не препятствует просмотру материалов сайта, но может ограничить сохранение некоторых
                пользовательских предпочтений.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="panel p-6 md:p-8">
            <h2 className="text-[length:var(--step-1)] font-semibold text-signal mb-4">
              4. Защита и безопасность информации
            </h2>
            <div className="space-y-3 text-[length:var(--step-00)] text-muted leading-relaxed">
              <p>
                4.1. Вся передача данных между пользователем и сайтом осуществляется по зашифрованному протоколу HTTPS с
                поддержкой современных шифров TLS 1.3 и механизмом HSTS.
              </p>
              <p>
                4.2. На сайте не собираются и не обрабатываются специальные категории персональных данных (расовая принадлежность,
                политические взгляды, религиозные убеждения, биометрия, данные о состоянии здоровья) и платёжные реквизиты.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="panel p-6 md:p-8">
            <h2 className="text-[length:var(--step-1)] font-semibold text-signal mb-4">
              5. Права пользователя и отзыв согласия
            </h2>
            <div className="space-y-3 text-[length:var(--step-00)] text-muted leading-relaxed">
              <p>
                5.1. Пользователь имеет право на получение информации, касающейся обработки его персональных данных, а также
                вправе в любой момент отозвать свое согласие на обработку персональных данных или запросить их удаление.
              </p>
              <p>
                5.2. Для реализации своих прав пользователь может направить письменное обращение на электронную почту:{' '}
                <a href={`mailto:${site.email}`} className="text-signal underline hover:no-underline font-mono">
                  {site.email}
                </a>
                . Обращение рассматривается в срок, не превышающий 10 рабочих дней.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 pt-6 border-t border-[var(--hairline)]">
          <Link
            to="/"
            className="link-plate link-plate-fill mono text-[length:var(--step-00)] inline-flex items-center gap-2"
          >
            <span className="led led-signal relative z-[1]" />
            <span className="relative z-[1]">На главную</span>
          </Link>
          <a
            href="https://yandex.ru/legal/metrica_termsofuse/ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-plate mono text-[length:var(--step-00)] inline-flex items-center gap-2"
          >
            <span className="led relative z-[1]" />
            <span className="relative z-[1]">Условия Яндекс Метрики ↗</span>
          </a>
        </div>
      </article>
    </PageShell>
  )
}
