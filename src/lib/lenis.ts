import type Lenis from 'lenis'

export const lenisRef: { current: Lenis | null } = { current: null }

export function scrollToSection(selector: string) {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { offset: 0 })
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Desktop product panels are pinned and stacked; index maps onto pin distance. */
export function scrollToProduct(index: number) {
  const pin = document.querySelector<HTMLElement>('.cases-pin')
  if (!pin) return

  const desktop = window.matchMedia('(min-width: 900px)').matches
  if (!desktop) {
    const target = pin.querySelectorAll<HTMLElement>('.case-panel')[index] ?? pin
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0 })
      return
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  const top = pin.getBoundingClientRect().top + window.scrollY + index * window.innerHeight
  if (lenisRef.current) {
    lenisRef.current.scrollTo(top)
    return
  }
  window.scrollTo({ top, behavior: 'smooth' })
}
