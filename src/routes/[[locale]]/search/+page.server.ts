// import { error } from '@sveltejs/kit'

import type { TypeArtisteSkeleton, TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
import { content } from '$lib/clients/contentful'
import type { Entry } from 'contentful'

export const load = (async ({ locals, url, params, parent }) => {
  const [artists, oeuvres, lignes] = await Promise.all([
    content.getEntries<TypeArtisteSkeleton>({ "content_type": "artiste", order: ["fields.nom"], select: ["fields.nom", "fields.id", "sys.id"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    content.getEntries<TypeOeuvreSkeleton>({ "content_type": "oeuvre", select: ["fields.annee", "fields.medium"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    content.getEntries<TypeLigneSkeleton>({ "content_type": "ligne", select: ["fields.oeuvres", "fields.id", "fields.couleur"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
  ])

  const annees = [...new Set(oeuvres.items.map(oeuvre => oeuvre.fields.annee))].sort()
  const mediums = [...new Set(oeuvres.items.map(oeuvre => oeuvre.fields.medium))].sort()

  const query = url.searchParams.get("query")
  const artist = url.searchParams.get("artist")
  const annee = url.searchParams.get("annee")
  const medium = url.searchParams.get("medium")
  const lignesFilter = url.searchParams.get("lignes")
  if (!query && !artist && !annee && !medium && !lignesFilter) {
    return {
      artists,
      mediums,
      annees,
      results: (await content.getEntries<TypeOeuvreSkeleton>({ "content_type": "oeuvre", limit: 200, include: 3, order: ["fields.annee"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' })).items.map(oeuvre => ({
        ...oeuvre,
        ligne: lignes.items.find(l => l.fields.oeuvres.find(o => oeuvre.sys.id === o.sys.id))
      }))
    }
  }

  const [results] = await Promise.all([
    content.getEntries<TypeOeuvreSkeleton>({ "content_type": "oeuvre",
    "query": query,
    "fields.annee": annee ? parseInt(annee) : undefined,
    "fields.medium": medium,
    ...artist ? { links_to_entry: artists.items.find(a => a.fields.id === artist).sys.id } : {},
    include: 3, order: ["fields.annee"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
  ])

  return {
    artists,
    mediums,
    annees,
    query,
    artist,
    annee,
    medium,
    results: results.items.map(oeuvre => ({
      ...oeuvre,
      ligne: lignes.items.find(l => l.fields.oeuvres.find(o => oeuvre.sys.id === o.sys.id))
    })),
  }
})