import { defineNuxtPlugin } from '#app'
import { fetchAndStoreUser } from '~/services/auth/auth.service'

export default defineNuxtPlugin(() => {
	fetchAndStoreUser()
})