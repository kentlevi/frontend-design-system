import { defineNuxtPlugin } from '#app'
import { useNavigationStore } from '@/stores/navigation'
import { useRoute } from 'vue-router'

import {
	COUNTRY_TO_API_COUNTRY,
	DEFAULT_COUNTRY,
	resolveSupportedCountry
} from '~/constants/countries'

export default defineNuxtPlugin((nuxtApp) => {
	const route = useRoute();

	interface Category {
		id: number
		name: string
		url_slug: string
		description: string
		sort: number
	}

	interface CategoriesResponse {
		success: boolean
		message: string
		data: Category[]
		meta: Record<string, unknown> | null
		error: unknown
	}

	const api = useApi()
	const navigationStore = useNavigationStore(nuxtApp.$pinia)

	async function fetchNavigationCategories() {
		const routeCountry = resolveSupportedCountry(route.params.country || '') || DEFAULT_COUNTRY
		const apiCountry = COUNTRY_TO_API_COUNTRY[routeCountry]

		try {
			const response = await api<CategoriesResponse>(
				`/${apiCountry}/navigation/categories`,
				{
					method: 'GET'
				}
			)

			const categories = response.data

			if (!categories || !categories.length) {
				navigationStore.clearCategories()
				return
			}

			navigationStore.setCategories(categories)
		} catch (error) {
			console.error('Navigation init failed:', error)
			navigationStore.clearCategories()
		}
	}

	nuxtApp.hook('app:mounted', () => {
		if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
			window.requestIdleCallback(() => {
				void fetchNavigationCategories()
			})
			return
		}

		setTimeout(() => {
			void fetchNavigationCategories()
		}, 0)
	})
})