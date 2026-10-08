import { useState, type FormEvent } from 'react'
import { Magnetic } from '~/components/Magnetic'
import { briefNeeds, contactCopy, site, type BriefNeedId } from '~/content/site'

type Brief = {
  name: string
  company: string
  need: string
  message: string
  contact: string
}

function emptyBrief(need: string): Brief {
  return { name: '', company: '', need, message: '', contact: '' }
}

function validateBrief(data: Brief) {
  const errors: Partial<Record<keyof Brief, string>> = {}
  if (data.name.trim().length < 2) errors.name = 'Укажите имя'
  if (!data.need) errors.need = 'Выберите направление'
  if (data.message.trim().length < 12) errors.message = 'Коротко опишите задачу'
  if (data.contact.trim().length < 4) errors.contact = 'Укажите почту, телефон или мессенджер'
  return errors
}

function buildMailto(data: Brief) {
  const needLabel = briefNeeds.find((item) => item.id === data.need)?.label ?? data.need
  const subject = encodeURIComponent(`Запрос: ${needLabel} — ${data.company || data.name}`)
  const body = encodeURIComponent(
    [
      `Имя: ${data.name}`,
      `Компания: ${data.company || '—'}`,
      `Что нужно: ${needLabel}`,
      `Контакт для ответа: ${data.contact}`,
      '',
      'Задача:',
      data.message,
    ].join('\n'),
  )
  return `mailto:${site.email}?subject=${subject}&body=${body}`
}

export function BriefForm({ defaultNeed = '' }: { defaultNeed?: BriefNeedId | '' }) {
  const [data, setData] = useState<Brief>(() => emptyBrief(defaultNeed))
  const [errors, setErrors] = useState<Partial<Record<keyof Brief, string>>>({})
  const [sent, setSent] = useState(false)
  const [href, setHref] = useState('')

  const set =
    (key: keyof Brief) =>
    (event: { target: { value: string } }) => {
      setData((prev) => ({ ...prev, [key]: event.target.value }))
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = validateBrief(data)
    setErrors(next)
    if (Object.keys(next).length) return
    const mail = buildMailto(data)
    setHref(mail)
    setSent(true)
    window.location.href = mail
  }

  if (sent) {
    return (
      <div className="brief-done panel p-8" role="status">
        <p className="tag tag-signal">заявка собрана</p>
        <p className="mt-5 max-w-[42ch] text-[length:var(--step-00)] leading-relaxed text-muted">
          Откроется почтовый клиент с заполненным письмом. Если этого не произошло, отправьте его вручную.
        </p>
        <Magnetic as="a" href={href} label="Открыть письмо" className="link-plate link-plate-fill mono mt-6 text-[length:var(--step-00)]">
          <span className="led led-signal relative z-[1]" />
          <span className="relative z-[1]">Открыть письмо</span>
        </Magnetic>
      </div>
    )
  }

  return (
    <form id="brief" className="brief-form" onSubmit={onSubmit} noValidate>
      <div className="brief-grid">
        <label className="brief-field">
          <span className="tag">Имя</span>
          <input
            className="brief-input"
            name="name"
            autoComplete="name"
            value={data.name}
            onChange={set('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'brief-name-error' : undefined}
          />
          {errors.name ? (
            <span id="brief-name-error" className="brief-error">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="brief-field">
          <span className="tag">Компания</span>
          <input
            className="brief-input"
            name="company"
            autoComplete="organization"
            value={data.company}
            onChange={set('company')}
          />
        </label>
        <label className="brief-field">
          <span className="tag">Что нужно</span>
          <select
            className="brief-input"
            name="need"
            value={data.need}
            onChange={set('need')}
            aria-invalid={Boolean(errors.need)}
            aria-describedby={errors.need ? 'brief-need-error' : undefined}
          >
            <option value="">Выберите направление</option>
            {briefNeeds.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.need ? (
            <span id="brief-need-error" className="brief-error">
              {errors.need}
            </span>
          ) : null}
        </label>
        <label className="brief-field">
          <span className="tag">Контакт для ответа</span>
          <input
            className="brief-input"
            name="reply"
            autoComplete="email"
            value={data.contact}
            onChange={set('contact')}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? 'brief-contact-error' : undefined}
          />
          {errors.contact ? (
            <span id="brief-contact-error" className="brief-error">
              {errors.contact}
            </span>
          ) : null}
        </label>
      </div>
      <label className="brief-field mt-4">
        <span className="tag">Короткое описание задачи</span>
        <textarea
          className="brief-input brief-area"
          name="message"
          rows={4}
          value={data.message}
          onChange={set('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'brief-message-error' : undefined}
        />
        {errors.message ? (
          <span id="brief-message-error" className="brief-error">
            {errors.message}
          </span>
        ) : null}
      </label>
      <Magnetic
        as="button"
        type="submit"
        label={contactCopy.submit}
        className="link-plate link-plate-fill mono mt-6 text-[length:var(--step-00)]"
      >
        <span className="led led-signal relative z-[1]" />
        <span className="relative z-[1]">{contactCopy.submit}</span>
      </Magnetic>
      <p className="mt-4 text-[length:var(--step-000)] text-faint leading-relaxed max-w-xl">
        Отправляя бриф, вы подтверждаете согласие на обработку данных в соответствии с{' '}
        <a href="/privacy" className="text-muted underline hover:text-signal transition-colors">
          Политикой конфиденциальности
        </a>{' '}
        и{' '}
        <a
          href="https://yandex.ru/legal/metrica_termsofuse/ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted underline hover:text-signal transition-colors"
        >
          Условиями сервиса «Яндекс Метрика»
        </a>
        .
      </p>
    </form>
  )
}
