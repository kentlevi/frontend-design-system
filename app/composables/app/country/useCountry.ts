import {
	COUNTRY_TO_API_COUNTRY,
	DEFAULT_COUNTRY,
	resolveSupportedCountry,
} from '~/constants/countries'

export const useCountry = () => {
	const route = useRoute()
	const country = computed(() =>
		resolveSupportedCountry(String(route.params.country || DEFAULT_COUNTRY)) ||
		DEFAULT_COUNTRY
	)
	const apiCountry = computed(() =>
		COUNTRY_TO_API_COUNTRY[country.value as keyof typeof COUNTRY_TO_API_COUNTRY] ||
		COUNTRY_TO_API_COUNTRY[DEFAULT_COUNTRY]
	)

	function withCountry(path: string) {
		const normalizedPath = path.startsWith('/') ? path : `/${path}`
		if (normalizedPath === '/') return `/${country.value}`
		return `/${country.value}${normalizedPath}`
	}

	return { country, apiCountry, withCountry }
}