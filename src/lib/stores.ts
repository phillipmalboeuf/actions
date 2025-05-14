import { writable } from 'svelte/store'

export const up = writable<boolean>(true)
export const loop = writable<boolean>(false)