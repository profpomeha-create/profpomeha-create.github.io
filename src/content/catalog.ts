import { services } from './services'
import { products } from './site'

export const expertiseToService: Record<string, string> = {
  devops: 'infrastruktura',
  net: 'set',
  observe: 'infrastruktura',
  backend: 'backend',
  ai: 'ai',
  mail: 'pochta',
  harden: 'set',
  ops: 'infrastruktura',
}

export function catalogPaths() {
  return [
    '/',
    '/privacy',
    '/uslugi',
    ...services.map((item) => `/uslugi/${item.slug}`),
    '/keysy',
    ...products.map((item) => `/keysy/${item.slug}`),
  ]
}

export function productBySlug(slug: string) {
  return products.find((item) => item.slug === slug)
}

export function productById(id: string) {
  return products.find((item) => item.id === id)
}

export function serviceByRelated(slug: string) {
  return services.find((item) => item.slug === slug)
}

export function expertiseHref(id: string) {
  const slug = expertiseToService[id]
  return slug ? `/uslugi/${slug}` : '/uslugi'
}
