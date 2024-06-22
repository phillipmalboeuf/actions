import { email } from '$lib/clients/postmark'
import type { Actions } from './$types'

export const actions = {
	default: async (event) => {
		const data = Object.fromEntries(await event.request.formData())

    return await email.sendEmailWithTemplate({
        From: 'phil@phils.computer',
        To: 'phil@phils.computer',
        MessageStream: 'broadcast',
        ReplyTo: data.email as string,
        TemplateAlias: 'base',
        TemplateModel: {
          subject: `Commentaire`,
          body: `${data.message}<br><br>${data.nom} – ${data.email}`,
          product_url: "https://www.museejoliette.org/fr/",
          product_name: "Actions collectives. Regards féministes sur la collection.",
          company_name: "Musée d'art de Joliette",
          company_address: "145 Rue du Père-Wilfrid-Corbeil, Joliette, QC J6E 4T4"
        }
      })
	},
} satisfies Actions;