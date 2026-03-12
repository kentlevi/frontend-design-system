import { defineNuxtPlugin } from '#app'
import { useAuthUser } from '~/composables/auth/useAuthUser'

export default defineNuxtPlugin(async () => {
	const { fetchAndStoreUser } = useAuthUser()
	fetchAndStoreUser()
})