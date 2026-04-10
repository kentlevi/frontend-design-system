import { useCartService } from "~/services/cart/cart.service";

export const useEditItemHandler = () => {
	const cart_service = useCartService()

	type SelectOption = {
		label: string;
		value: string | number;
	}

	const featured_sizes = computed(() => cart_service.featured_data.value && cart_service.featured_data.value.featured_sizes ? cart_service.featured_data.value.featured_sizes : [])
	const is_open = computed(() => cart_service.edit_modal_open.value)
	const active_item = computed(() => cart_service.editing_item.value)
	const show_quantity = computed(() => cart_service.edit_mode.value === 'full')

	const sizes = computed(() => {

		const last_option = [
			{
				label: 'Custom Size',
				value: 'custom'
			}
		]

		if( !cart_service.featured_data.value || !cart_service.featured_data.value.featured_sizes )
			return last_option

		const new_options = cart_service.featured_data.value.featured_sizes.map(e => {
			return {
				label: `${e.width}x${e.height}mm`,
				value: e.code
			}
		})

		return [ ...new_options, ...last_option ] as SelectOption []
	})

	const closeModal = () => {
		cart_service.clearSelection()
		cart_service.closeEditModals()
	}

	return {
		...cart_service,
		is_open,
		active_item,
		show_quantity,
		featured_sizes,
		sizes,
		closeModal,
	}
}