import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'

export const load = (async ({ locals, url, params }) => {

  const [oeuvres] = await Promise.all([
    content.getEntries<TypeOeuvreSkeleton>({ content_type: "oeuvre", include: 2, "fields.id": params.id, limit: 1 }),
  ])
  const oeuvre = oeuvres.items[0]

  const lignes = await content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", include: 2, "links_to_entry": oeuvre.sys.id, limit: 1 })
  const ligne = lignes.items[0]

  if (!ligne) {
    return {
      oeuvre
    }
  }

  const index = ligne.fields.oeuvres.findIndex(o => oeuvre.sys.id === o.sys.id)

  return {
    oeuvre,
    ligne,
    prev: index > 0 ? ligne.fields.oeuvres[index - 1] : undefined,
    next: index < ligne.fields.oeuvres.length - 1 ? ligne.fields.oeuvres[index + 1] : undefined
  }
})