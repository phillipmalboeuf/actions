import { goto, preloadData, pushState } from '$app/navigation'
import type { MouseEventHandler } from 'svelte/elements'


export const openDialog: MouseEventHandler<HTMLAnchorElement> = async (e) => {
  if (e.metaKey) return;

  e.preventDefault()
  const { href } = e.currentTarget
  const result = await preloadData(href)

  if (result.type === 'loaded' && result.status === 200) {
    pushState(href, href.includes('/archives') ? { zoomArchive: result.data } : href.includes('/zoom') ? { zoom: result.data } : href.includes('/video') ? href.includes('oeuvres') ? { oeuvreVideo: result.data } : { video: result.data } : { type: href.includes('oeuvres') ? "oeuvre" : href.includes('contexte') ? "contexte" : "page", open: result.data })

    window.gtag && window.gtag("config", "G-G6EGFV8XK5", { page_path: href })
  } else {
    goto(href)
  }
}