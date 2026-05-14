export const useRedirectStore = defineStore('redirect_store', () => {
	const auth_redirect_url = ref<string>('/')

	const setAuthRedirectUrl = (url: string) => {
		auth_redirect_url.value = url;

	}

	return {
		auth_redirect_url,
		setAuthRedirectUrl
	}
});