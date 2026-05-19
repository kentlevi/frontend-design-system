import type { OrderDetailItem } from '~/types/order/order-detail'
import { formatPrice } from '~/utils/currency/formatPrice'

type Inputs = {
	item: MaybeRefOrGetter<OrderDetailItem | null | undefined>
	index?: MaybeRefOrGetter<number | null | undefined>
}

export function useOrderDetailItemDisplay(inputs: Inputs) {

	/**
	 * Config
	 */
	const config = useRuntimeConfig()


	/**
	 * Functions
	 */
	function isAbsoluteUrl(value: string | null | undefined) {
		return Boolean(value && /^(https?:)?\/\//i.test(value))
	}


	/**
	 * Computed
	 */
	const item = computed(() => toValue(inputs.item) ?? null)
	const index = computed(() => toValue(inputs.index) ?? null)

	const cart_item = computed(() => item.value?.cart_item ?? null)

	const product = computed(() => cart_item.value?.product ?? null)

	const formatted_size = computed(() => {
		const ci = cart_item.value
		if (!ci?.width || !ci?.height) return null
		return `${ci.width}x${ci.height}mm`
	})

	const quantity = computed(() => cart_item.value?.quantity ?? null)

	const formatted_quantity = computed(() => {
		const q = quantity.value
		return q != null ? `${q} pcs` : null
	})

	const item_number_padded = computed(() =>
		index.value !== null ? String(index.value + 1).padStart(3, '0') : null,
	)

	const item_number = computed(() =>
		item_number_padded.value ? `Item No. ${item_number_padded.value}` : null,
	)

	const formatted_cost = computed(() => {
		const cost = cart_item.value?.cost
		return cost != null ? formatPrice(cost) : null
	})

	const image_src = computed(() => {
		const ci = cart_item.value
		if (!ci) return undefined

		const { product_thumbnail, artwork_file, file_path } = ci

		if (item.value?.artwork_id && artwork_file && file_path) {
			return `${config.public.s3_file_url}${file_path}${artwork_file}`
		}

		if (product_thumbnail) {
			return isAbsoluteUrl(product_thumbnail)
				? product_thumbnail
				: `${config.public.file_url}${product_thumbnail}`
		}

		return undefined
	})

	const status_label = computed(() => item.value?.item_status?.name ?? null)

	const needs_artwork = computed(() => Boolean(item.value && !item.value.artwork_id))


	return {
		cart_item,
		product,
		formatted_size,
		quantity,
		formatted_quantity,
		item_number_padded,
		item_number,
		formatted_cost,
		image_src,
		status_label,
		needs_artwork,
	}
}