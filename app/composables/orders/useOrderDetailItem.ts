import type { OrderDetailItem } from '~/types/order/order-detail'
import { formatPrice } from '~/utils/currency/formatPrice'

type Props = {
	item: OrderDetailItem
	index: number
}

export function useOrderDetailItem(props: Props) {

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
	const cart_item = computed(() => props.item.cart_item)

	const item_number = computed(() =>
		`Item No. ${String(props.index + 1).padStart(3, '0')}`
	)

	const image_src = computed(() => {
		const { product_thumbnail, artwork_file, file_path } = cart_item.value

		if (props.item.artwork_id && artwork_file && file_path) {
			return `${config.public.s3_file_url}${file_path}${artwork_file}`
		}

		if (product_thumbnail) {
			return isAbsoluteUrl(product_thumbnail)
				? product_thumbnail
				: `${config.public.file_url}${product_thumbnail}`
		}
	})

	const formatted_size = computed(() => {
		const { width, height } = cart_item.value
		if (!width || !height) return null
		return `${width}x${height}mm`
	})

	const quantity = computed(() => cart_item.value.quantity)

	const formatted_cost = computed(() => formatPrice(cart_item.value.cost))

	const status_label = computed(() => props.item.item_status?.name ?? null)

	const needs_artwork = computed(() => !props.item.artwork_id)


	return {
		cart_item,
		item_number,
		image_src,
		formatted_size,
		quantity,
		formatted_cost,
		status_label,
		needs_artwork,
	}
}