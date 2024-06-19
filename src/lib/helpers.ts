import { goto, preloadData, pushState } from '$app/navigation'
import type { MouseEventHandler } from 'svelte/elements'


export const openDialog: MouseEventHandler<HTMLAnchorElement> = async (e) => {
  if (e.metaKey) return;

  e.preventDefault()
  const { href } = e.currentTarget
  const result = await preloadData(href)

  if (result.type === 'loaded' && result.status === 200) {
    pushState(href, href.includes('/zoom') ? { zoom: result.data } : href.includes('/video') ? { video: result.data } : { type: href.includes('oeuvres') ? "oeuvre" : href.includes('contexte') ? "contexte" : "page", open: result.data })
  } else {
    goto(href)
  }
}