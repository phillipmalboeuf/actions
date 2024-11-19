// import { error } from '@sveltejs/kit'

import { isTypeGallerie, type TypeLigneSkeleton, type TypePageSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'

export const load = (async ({ locals, url, params }) => {
  const [pages, lignes] = await Promise.all([
    content.getEntries<TypePageSkeleton>({ "content_type": "page", "fields.id": "accueil", include: 3, locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", select: ['sys.id', 'fields.titre', 'fields.id', 'fields.couleur', 'fields.logotype', 'fields.lienVimeo', 'fields.vignette', 'fields.vignetteVideo'], order: ["fields.id"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
  ])

  const page = pages.items[0]
  const galleries = page.fields.contenu.filter(item => isTypeGallerie(item))
  const random = Math.floor(Math.random() * galleries.length)
  // const random = 0

  return {
    page: {
      ...page,
      fields: {
        ...page.fields,
        contenu: [
          page.fields.contenu.filter(item => isTypeGallerie(item))[random],
          ...page.fields.contenu.filter(item => !isTypeGallerie(item))
        ],
        credits: {
          ...page.fields.credits,
          content: [
            page.fields.credits.content.filter(node => node.nodeType === 'table')[random],
            ...page.fields.credits.content.filter(node => node.nodeType !== 'table')
          ]
        }
      }
    },
    random,
    lignes: lignes.items,
  }
})