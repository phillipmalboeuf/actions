// import { error } from '@sveltejs/kit'

import type { TypeLigneSkeleton, TypePageSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'

export const load = (async ({ locals, url, params }) => {
  const [pages, lignes] = await Promise.all([
    content.getEntries<TypePageSkeleton>({ "content_type": "page", "fields.id": "accueil", include: 3, locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", select: ['sys.id', 'fields.titre', 'fields.id', 'fields.couleur', 'fields.logotype', 'fields.lienVimeo', 'fields.vignette'], order: ["fields.titre"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
  ])

  return {
    page: pages.items[0],
    lignes: lignes.items,
  }
})