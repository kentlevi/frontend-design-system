import { useQuoteApiService } from "~/services/core/quote/api.service"
import { useCartStore } from "~/stores/cart"

export const useFeaturedItem = (_caller : string) => {

	const cart_store = useCartStore()

	const quote_api_request = useQuoteApiService()

	const config = useRuntimeConfig()

	const router = useRouter()

	type FeaturedItem = {
		url_slug: string
		product: string
		image: string
		price: number
		description: string
		category: string
	}
	const featured_items = ref<FeaturedItem[]>([])

	const clear = () => {
		featured_items.value = []
	}

	const setFeaturedItems = (items : FeaturedItem[]) => {
		featured_items.value = items;
	}
	const requestFeaturedItems = async () => {
		const featured_items = await quote_api_request.getFeaturedItems()

		setFeaturedItems(featured_items as FeaturedItem[])
	}

	const formatImage = (image : string) => {
		return `${config.public.file_url}${image}`
	}

	const redirectCustomization = (item : FeaturedItem) => {
		router.push(`/${item.category}/${item.url_slug}`)
	}

	return {
		// 🔥 Pinia States
		number_of_items : cart_store.number_of_items,
		// 🔥 States
		featured_items,
		// 🔥 Methods
		requestFeaturedItems,
		clear,
		setFeaturedItems,
		formatImage,
		redirectCustomization,
	}
}