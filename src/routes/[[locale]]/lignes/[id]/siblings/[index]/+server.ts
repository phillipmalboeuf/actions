import { json, text } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { stringify } from 'devalue'
import { DateTime } from 'luxon'
import { content } from '$lib/clients/contentful'
import type { TypeLigneSkeleton } from '$lib/clients/content_types'


export const GET: RequestHandler = async ({ request, params, url }) => {
	// const { items } = await request.json()
	const [lignes] = await Promise.all([
    content.getEntries<TypeLigneSkeleton>({ content_type: "ligne", include: 2, "fields.id": params.id, limit: 1 }),
  ])

	const ligne = lignes.items[0]
	const index = Number(params.index)
  
	return json({
		previous: index >= 0 ? ligne.fields.oeuvres[index] : undefined,
		next: index < ligne.fields.oeuvres.length - 1 ? ligne.fields.oeuvres[index + 1] : undefined
	})
}