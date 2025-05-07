import type { TypeNavigationSkeleton, TypeLigneSkeleton } from '$lib/clients/content_types.js'
import { content } from '$lib/clients/contentful'

export const load = async ({ locals, params, url }) => {
  const [header, footer, lignes] = await Promise.all([
    content.getEntries<TypeNavigationSkeleton>({ content_type: "navigation", "fields.id": "principale", include: 2, locale: { 'en': 'en-CA' }[params.locale] || 'fr-CA' }),
    content.getEntries<TypeNavigationSkeleton>({ content_type: "navigation", "fields.id": "secondaire", include: 2, locale: { 'en': 'en-CA' }[params.locale] || 'fr-CA' }),
    content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", select: ['sys.id', 'fields.titre', 'fields.id', 'fields.couleur'], order: ["fields.id"], locale: { 'en': 'en-CA' }[params.locale] || 'fr-CA' }),
  ])
  
  return {
    lignes: lignes.items,
    header: header.items[0],
    footer: footer.items[0],
    locale: params.locale || 'fr'
  }
}