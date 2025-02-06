import type { TypeOeuvreSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'

export const load = (async ({ locals, url, params }) => {

  const [asset, oeuvre] = await Promise.all([
    content.getAsset(params.asset_id),
    content.getEntries<TypeOeuvreSkeleton>({ content_type: "oeuvre", include: 2, "fields.id": params.id, limit: 1 }),
  ])

  return {
    asset,
    oeuvre: oeuvre.items[0],
    // i: url.searchParams.get('i')
  }
})