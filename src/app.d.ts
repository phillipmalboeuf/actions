import type { AvailableLanguageTag } from "../../lib/paraglide/runtime"
import type { ParaglideLocals } from "@inlang/paraglide-sveltekit"
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		 interface Locals {
    paraglide: ParaglideLocals<AvailableLanguageTag>,
}
		// interface PageData {}
		interface PageState {
			type?: 'oeuvre' | 'page' | 'contexte'
			open?: any
			zoom?: any
			zoomArchive?: any
			video?: any
			oeuvreVideo?: any
			search?: any
		}
		// interface Platform {}
	}

	interface Window {
		dataLayer: any[];
		gtag: (...args: any[]) => void;
	}
}

export {};
