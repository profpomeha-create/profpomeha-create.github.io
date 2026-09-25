import { createFileRoute } from '@tanstack/react-router'
import { NotFoundPage } from '~/components/PageShell'

export const Route = createFileRoute('/404')({
  head: () => ({
    title: 'Страница не найдена — AAA lab',
    meta: [
      { title: 'Страница не найдена — AAA lab' },
      {
        name: 'description',
        content:
          'Такой страницы нет. Вернитесь на главную AAA lab или выберите услугу.',
      },
      { name: 'robots', content: 'noindex, follow' },
    ],
  }),
  component: NotFoundPage,
})
