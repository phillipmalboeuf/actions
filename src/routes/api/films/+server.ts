import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { content } from '$lib/clients/contentful';
import type { TypeFilmSkeleton } from '$lib/clients/content_types';

export const GET: RequestHandler = async ({ url }) => {

  const films = await content.getEntries<TypeFilmSkeleton>({
    content_type: 'film',
    include: 0,
    limit: 400,
    "fields.title[exists]": true,
    order: ["-fields.publishedDate"]
  })

	return json(films);
};