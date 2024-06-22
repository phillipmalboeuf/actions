import { ServerClient } from 'postmark'

export const email = new ServerClient(import.meta.env.VITE_POSTMARK_KEY)