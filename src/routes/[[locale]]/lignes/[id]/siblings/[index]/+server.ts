import { json, text } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { stringify } from 'devalue'
import { DateTime } from 'luxon'
import { content } from '$lib/clients/contentful'
import type { TypeLigneSkeleton } from '$lib/clients/content_types'

export const GET: RequestHandler = async ({ request, params, url }) => {
	const [lignes] = await Promise.all([
    content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", include: 2, "fields.id": params.id, limit: 1 }),
  ])

	const ligne = lignes.items[0]
	const annee = Number(params.index)

	// Find previous and next oeuvres based on anneeEvenement
	const oeuvres = ligne.fields.oeuvres || []
	const previous = [...oeuvres]
		.sort((a, b) => b.fields.anneeEvenement - a.fields.anneeEvenement)
		.find(oeuvre => oeuvre.fields.anneeEvenement < annee)

	const next = [...oeuvres]
		.sort((a, b) => a.fields.anneeEvenement - b.fields.anneeEvenement)
		.find(oeuvre => oeuvre.fields.anneeEvenement > annee)
  
	return json({
		previous,
		next
	})
}