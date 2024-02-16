// import { error } from '@sveltejs/kit'

import type { TypePageSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'

export const load = (async ({ locals, url, params }) => {
  const [pages] = await Promise.all([
    content.getEntries<TypePageSkeleton>({ "content_type": "page", "fields.id": "accueil", include: 3, locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
  ])

  return {
    page: pages.items[0],
  }
})