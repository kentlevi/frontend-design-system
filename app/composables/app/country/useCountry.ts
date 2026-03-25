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
	const api_country = computed(() =>
		COUNTRY_TO_API_COUNTRY[country.value as keyof typeof COUNTRY_TO_API_COUNTRY] ||
		COUNTRY_TO_API_COUNTRY[DEFAULT_COUNTRY]
	)

	function withCountry(path: string) {
		const normalized_path = path.startsWith('/') ? path : `/${path}`
		if (normalized_path === '/') return `/${country.value}`
		return `/${country.value}${normalized_path}`
	}

	return { country, api_country, withCountry }
}