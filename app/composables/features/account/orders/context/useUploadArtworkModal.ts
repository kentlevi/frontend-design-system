import type { OrderDetailItem } from '~/types/order/order-detail'

export function useUploadArtworkModal() {

	/**
	 * State
	 */
	const is_open = ref(false)
	const selected_item = ref<OrderDetailItem | null>(null)


	/**
	 * Computed
	 */
	const cart_item = computed(() => selected_item.value?.cart_item ?? null)

	const product = computed(() => cart_item.value?.product ?? null)

	const formatted_size = computed(() => {
		const ci = cart_item.value
		if (!ci?.width || !ci?.height) return null
		return `${ci.width}x${ci.height}mm`
	})

	const formatted_quantity = computed(() => {
		const q = cart_item.value?.quantity
		return q != null ? `${q} pcs` : null
	})


	/**
	 * Functions
	 */
	const open_modal = (item: OrderDetailItem) => {
		selected_item.value = item
		is_open.value = true
	}

	const close_modal = () => {
		is_open.value = false
		selected_item.value = null
	}


	return {
		is_open,
		selected_item,
		product,
		formatted_size,
		formatted_quantity,

		open_modal,
		close_modal,
	}
}