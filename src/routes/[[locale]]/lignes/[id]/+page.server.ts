import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'

export const load = (async ({ locals, url, params }) => {
  const format = url.searchParams.get("format")

  const [lignes] = await Promise.all([
    content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", include: 2, "fields.id": params.id, limit: 1 }),
  ])

  return {
    format,
    ligne: lignes.items[0],
  }
})