import { goto, preloadData, pushState } from '$app/navigation'
import type { MouseEventHandler } from 'svelte/elements'


export const openDialog: MouseEventHandler<HTMLAnchorElement> = async (e) => {
  if (e.metaKey) return;

  e.preventDefault()
  const { href } = e.currentTarget
  const result = await preloadData(href)

  console.log(result)

  if (result.type === 'loaded' && result.status === 200) {
    pushState(href, { type: result.data?.oeuvre ? 'oeuvre' : 'page', open: result.data })
  } else {
    goto(href)
  }
}