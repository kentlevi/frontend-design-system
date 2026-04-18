import type { FeaturedDataResponse, PricingParameters, PricingResponse } from "~/types/products/attributes"



export const useQuoteApiService = () => {
	const { $api } = useNuxtApp()

	const getFeaturedData = async (prod_slug: string) => {
		const { success, message, data} = await $api.get<FeaturedDataResponse>(
			`quote/${prod_slug}/featured-data`
		)

		if (!success || !data) {
			console.warn(message)
			return
		}

		return data
	}

	const getFeaturedPricing = async (prod_slug: string, pricing_parameters : PricingParameters) => {
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
	}

	return {
		// 🔥 Method
		getFeaturedData,
		getFeaturedPricing,
	}

}