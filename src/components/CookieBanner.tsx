import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Magnetic } from '~/components/Magnetic'

const STORAGE_KEY = 'aaa_cookie_consent_v1'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY)
      if (!consent) {
        setVisible(true)
      }
    } catch {
      // localStorage may fail in restricted iframes
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Уведомление об использовании cookie и аналитики"
      role="region"
      className="cookie-banner panel panel-live p-4 sm:p-5 backdrop-blur-md border border-[var(--hairline-hi)]"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="led led-on led-blink" />
          <span className="tag tag-signal">telemetry · cookies</span>
        </div>
        <button
          type="button"
          onClick={accept}
          aria-label="Закрыть уведомление"
          className="flex h-6 w-6 items-center justify-center text-muted hover:text-signal transition-colors font-mono text-xs"
        >
          ✕
        </button>
      </div>

      <p className="text-[length:var(--step-000)] text-muted leading-relaxed mb-3">
        Мы используем файлы cookie и сервис{' '}
        <strong className="text-[var(--ink)]">Яндекс Метрика</strong> для сбора обезличенной
        статистики и бесперебойной работы интерфейса.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--hairline)]">
        <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-faint">
          <Link to="/privacy" className="underline hover:text-signal transition-colors">
            Политика конфиденциальности
          </Link>
          <a
            href="https://yandex.ru/legal/metrica_termsofuse/ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-signal transition-colors"
          >
            Условия Метрики ↗
          </a>
        </div>
        <Magnetic
          as="button"
          type="button"
          onClick={accept}
          label="Принять"
          className="cookie-banner-btn"
        >
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">Принять</span>
        </Magnetic>
      </div>
    </aside>
  )
}
