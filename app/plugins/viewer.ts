import { defineNuxtPlugin } from '#app'
import { directive } from 'v-viewer'

export default defineNuxtPlugin((nuxtApp) => {
	// Register `v-viewer` directive on both server and client.
	// Vue directive lifecycle hooks (mounted/updated) only fire on the client,
	// so the underlying viewerjs library never touches the DOM during SSR.
	// CSS is loaded lazily on the client only.
	nuxtApp.vueApp.directive('viewer', directive())

	if (import.meta.client) {
		void import('viewerjs/dist/viewer.css')
	}
})
