import type { TypeNavigationSkeleton, TypeLigneSkeleton } from '$lib/clients/content_types.js'
import { cachedEntries } from '$lib/clients/contentful'
import { languageTag } from '$lib/paraglide/runtime.js'

export const load = async ({ locals, params, url }) => {
  const [header, footer, lignes] = await Promise.all([
    cachedEntries<TypeNavigationSkeleton>({ content_type: "navigation", "fields.id": "principale", include: 2, locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' }),
    cachedEntries<TypeNavigationSkeleton>({ content_type: "navigation", "fields.id": "secondaire", include: 2, locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' }),
    cachedEntries<TypeLigneSkeleton>({ content_type: "ligne", select: ['sys.id', 'fields.titre', 'fields.id', 'fields.couleur'], order: ["fields.id"], locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' }),
  ])
  
  return {
    lignes: lignes.items,
    header: header.items[0],
    footer: footer.items[0],
    locale: languageTag() || 'fr'
  }
}