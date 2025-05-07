import type { TypeOeuvreSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'

export const load = (async ({ locals, url, params }) => {

  const [oeuvres] = await Promise.all([
    content.getEntries<TypeOeuvreSkeleton>({ content_type: "oeuvre", include: 2, "fields.id": params.id, limit: 1, locale: { 'en': 'en-CA' }[params.locale] || 'fr-CA' }),
  ])

  return {
    oeuvre: oeuvres.items[0],
  }
})