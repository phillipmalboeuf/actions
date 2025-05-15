// import { error } from '@sveltejs/kit'

import type { TypeArtisteSkeleton, TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'
import { languageTag } from '$lib/paraglide/runtime.js'

export const load = (async ({ locals, url, params, parent }) => {
  const [artists, oeuvres, lignes] = await Promise.all([
    content.getEntries<TypeArtisteSkeleton>({ "content_type": "artiste", order: ["fields.nomFamille", "fields.nom"], select: ["fields.prenom", "fields.nomFamille", "fields.nom", "fields.id", "sys.id"], locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' }),
    content.getEntries<TypeOeuvreSkeleton>({ "content_type": "oeuvre", select: ["fields.annee", "fields.medium", "fields.typologie"], locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' }),
    content.getEntries<TypeLigneSkeleton>({ "content_type": "ligne", select: ["fields.oeuvres", "fields.id", "fields.couleur", "fields.titre"], locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' }),
  ])

  const annees = [...new Set(oeuvres.items.filter(oeuvre => oeuvre.fields?.annee).map(oeuvre => oeuvre.fields.annee))].sort()
  const mediums = [...new Set(oeuvres.items.filter(oeuvre => oeuvre.fields?.typologie).map(oeuvre => oeuvre.fields.typologie?.trimEnd()))].sort()

  const query = url.searchParams.get("query")
  const artist = ((url.searchParams.get("artist") && url.searchParams.get("artist") !== "") ? url.searchParams.get("artist").split(',') : [])
  const medium = ((url.searchParams.get("medium") && url.searchParams.get("medium") !== "") ? url.searchParams.get("medium").split(',') : [])
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")
  const lignesFilter = url.searchParams.get("lignes")

  if (!query && !artist && !from && !to && !medium && !lignesFilter) {
    return {
      artists,
      mediums,
      annees,
      results: (await content.getEntries<TypeOeuvreSkeleton>({ "content_type": "oeuvre", limit: 200, include: 3, order: ["fields.anneeEvenement"], locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' })).items.map(oeuvre => ({
        ...oeuvre,
        ligne: lignes.items.find(l => l.fields.oeuvres.find(o => oeuvre.sys.id === o.sys.id))
      }))
    }
  }

  const [results, artistQuery] = await Promise.all([
    content.getEntries<TypeOeuvreSkeleton>({ "content_type": "oeuvre",
      "query": query,
      ...from ? { "fields.annee[gte]": parseInt(from) } : undefined,
      ...to ? { "fields.annee[lte]": parseInt(to) } : undefined,
      ...medium?.length ? { "fields.typologie[in]": medium } : {},
      ...artist?.length ? {
        'fields.artiste.sys.contentType.sys.id': 'artiste',
        'fields.artiste.fields.id[in]': artist
      } : {},
      include: 3, order: ["fields.anneeEvenement"], locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' }),
    content.getEntries<TypeArtisteSkeleton>({ "content_type": "artiste",
      "query": query,
    })
  ])

  const more = artistQuery.items?.length
    ? artistQuery.items.length > 80
      ? []
      : (await content.getEntries<TypeOeuvreSkeleton>({ "content_type": "oeuvre",
          links_to_entry: artistQuery.items[0].sys.id,
          ...from ? { "fields.annee[gte]": parseInt(from) } : undefined,
          ...to ? { "fields.annee[lte]": parseInt(to) } : undefined,
          ...medium?.length ? { "fields.typologie[in]": medium } : {},
          include: 3, order: ["fields.anneeEvenement"], locale: { 'en': 'en-CA' }[languageTag()] || 'fr-CA' })).items
          .filter(o => !results.items.find(result => result.fields.id === o.fields.id))
    : []

  return {
    artists,
    mediums,
    annees,
    query,
    artist,
    from,
    to,
    medium,
    results: [...more, ...results.items].map(oeuvre => ({
      ...oeuvre,
      ligne: lignes.items.find(l => l.fields.oeuvres.find(o => oeuvre.sys.id === o.sys.id))
    })),
  }
})