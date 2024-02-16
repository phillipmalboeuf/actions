import type {  } from '$lib/clients/content_types.js'
import { content } from '$lib/clients/contentful'

export const load = async ({ locals, params, url }) => {
  // const [header, footer, tags, popups, films, directors] = await Promise.all([
    // content.getEntries<TypeNavigationSkeleton>({ content_type: 'navigation', select: ['sys.id', 'fields.identifier', 'fields.links'], include: 2, "fields.identifier": "header", locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    // content.getEntries<TypeNavigationSkeleton>({ content_type: 'navigation', select: ['sys.id', 'fields.identifier', 'fields.links'], include: 2, "fields.identifier": "footer", locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    // content.getEntries<TypeTagSkeleton>({ content_type: 'tag', select: ['sys.id', 'fields.title', 'fields.identifier', 'fields.isACollaborator'], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    // content.getEntries<TypePopupSkeleton>({ content_type: 'popup', select: ['sys.id', 'fields.title', 'fields.body', 'fields.link', 'fields.poster', 'fields.linkLabel'], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    // content.getEntries<TypeFilmSkeleton>({ content_type: 'film', "fields.tags": "film", select: ['sys.id', 'fields.title', 'fields.identifier'], order: ["-fields.publishedDate"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
    // content.getEntries<TypeCollaboratorSkeleton>({ content_type: "collaborator", "fields.isADirector": true, select: ['sys.id', 'fields.name', 'fields.tagIdentifier'], order: ["fields.name"], locale: { 'en': 'en-US' }[params.locale] || 'fr-CA' }),
  // ])

  return {
    // header: header.items[0],
    // footer: footer.items[0],
    // tags: tags.items,
    // popups: popups.items,
    // films: films.items,
    // directors: directors.items,
    locale: params.locale || 'fr'
  }
}