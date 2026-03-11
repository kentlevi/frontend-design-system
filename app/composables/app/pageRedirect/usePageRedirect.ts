import { useCountry } from '~/composables/app/country/useCountry'

type PageRedirectOptions = {
	replace?: boolean
	redirectCode?: number
}

export async function redirectToCountryPath(
	path: string,
	options: PageRedirectOptions = {}
) {
	const { withCountry } = useCountry()
	await navigateTo(withCountry(path), options)
}

export async function redirectToLocaleRoot() {
	const { locale } = useI18n()
	await navigateTo(`/${locale.value}`)
}