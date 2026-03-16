import { defineNuxtPlugin } from '#app'
import { useNavigation } from '~/composables/navigation/useNavigation'

export default defineNuxtPlugin(async () => {
	const { fetchAndStoreCategories } = useNavigation()
	await fetchAndStoreCategories()
})