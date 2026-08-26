import lockup from '~/assets/logo.webp'
import mark from '~/assets/logo-mark.webp'

export function BrandLockup({ className }: { className?: string }) {
  return (
    <img
      src={lockup}
      alt=""
      width={915}
      height={713}
      className={className}
      draggable={false}
      aria-hidden="true"
    />
  )
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={mark}
      alt=""
      width={532}
      height={465}
      className={className}
      draggable={false}
    />
  )
}
