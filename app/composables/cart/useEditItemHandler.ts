import { useCartService } from "~/services/cart/cart.service"

export const useEditItemHandler = () => {
	const cart_service = useCartService()

	type SelectOption = {
		label: string;
		value: string | number;
	}

	const featured_sizes = computed(() => cart_service.featured_data.value && cart_service.featured_data.value.featured_sizes ? cart_service.featured_data.value.featured_sizes : [])

	const sizes = computed(() => {

		const last_option = [
			{
				label: 'Custom Size',
				value: 'custom'
			}
		]

		if( !cart_service.featured_data.value || !cart_service.featured_data.value.featured_sizes )
			return []

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
	}

	return {
		...cart_service,
		featured_sizes,
		sizes,
		closeModal,
	}
}