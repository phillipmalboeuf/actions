import type { TypeLigneSkeleton } from '$lib/clients/content_types.js'
import { content } from '$lib/clients/contentful'

export const load = async ({ locals, params, url }) => {
  const [lignes] = await Promise.all([
    content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", select: ['sys.id', 'fields.titre', 'fields.id', 'fields.couleur'], order: ["fields.titre"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
  ])
  
  return {
    lignes: lignes.items,
    locale: params.locale || 'fr'
  }
}