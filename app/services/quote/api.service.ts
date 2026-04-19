import type { FeaturedDataResponse, PricingParameters, PricingResponse } from "~/types/products/attributes"



export const useQuoteApiService = () => {
	const { $api } = useNuxtApp()

	const getFeaturedData = async (prod_slug: string) => {
		try {
			const { success, message, data} = await $api.get<FeaturedDataResponse>(
				`quote/${prod_slug}/featured-data`
			)

			if (!success || !data) {
				console.warn(message)
				return
			}

			return data
		} catch(error) {
			console.error('Featured request failed!', error)
		}
	}

	const getFeaturedPricing = async (prod_slug: string, pricing_parameters : PricingParameters) => {
		try {
			const { success, message, data} = await $api.get<PricingResponse>(
				`quote/${prod_slug}/pricing`,
				{
					params: { ...pricing_parameters }
				}
			)

			if (!success || !data) {
				console.warn(message)
				return
			}

			return data
		} catch(error) {
			console.error('Pricing request failed!', error)
		}
	}

	return {
		// 🔥 Method
		getFeaturedData,
		getFeaturedPricing,
	}

}