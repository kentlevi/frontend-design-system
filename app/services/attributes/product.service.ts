import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { ColorSpec, FontSpec, QuantitySpec, SizeSpec } from "~/types/products/attributes"

export const useProductService = () => {
	const { $api } = useNuxtApp()

	const selection_store = useSelectionStore()

	const attribute_store = useAttributesStore()

	const product = computed(() => attribute_store.product)

	const url_slug = computed(() => selection_store.url_slug)

	type FeaturedDataResponse = {
		product: {
			pcm_id: number
			url_slug: string
			name: string
			description: string
			image: string
		}
		featured_sizes: SizeSpec[]
		variants: {
			colors: ColorSpec[],
			fonts: {
				id: number,
				name: string,
				code: string,
				style: Record<string, unknown>
			}[],
		},
		quantities: {
			product_variant_id: number,
			data: QuantitySpec[],
		}
	}


	const updateFeaturedData = async (prod_slug: string) => {
		selection_store.updateProductSlug(prod_slug)

		// Check if we have this product's attributes in cache for instant navigation
		const was_cached = attribute_store.restoreFromCache(prod_slug);
		if (was_cached) {
			console.log(`Restored ${prod_slug} from cache`);
		}

		const featured_data = await getFeaturedData(prod_slug)

		if( featured_data ) {

			await setupFeaturedData(featured_data)

		}


		return true;
	}

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

	const setupFeaturedData = async (featured_data: FeaturedDataResponse) => {

		selection_store.updateMappingID(featured_data.product.pcm_id)

		attribute_store.updateProduct({
			url_slug: featured_data.product.url_slug,
			name: featured_data.product.name,
			description: featured_data.product.description,
			image: featured_data.product.image
		})

		attribute_store.updateSizes(featured_data.featured_sizes)

		attribute_store.updateQuantites(featured_data.quantities?.data)

		attribute_store.updateColors(featured_data.variants.colors)

		const f = featured_data.variants.fonts.map(font => ({
			id: font.id,
			label: font.name,
			value: font.name,
			code: font.code,
			style: font.style
		})) as FontSpec[]

		attribute_store.updateFonts(f)
	}


	return {
		url_slug,
		product,
		updateFeaturedData,
		getFeaturedData,
	}
}