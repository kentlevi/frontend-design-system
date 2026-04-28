import { defineNuxtPlugin } from '#app'
import { getAndStoreCategories } from '~/services/navigation/navigation.service'

export default defineNuxtPlugin(async () => {
	await getAndStoreCategories()
})