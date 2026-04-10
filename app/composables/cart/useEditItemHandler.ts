import { useCartService } from "~/services/cart/cart.service";
import type { SizeSpec } from "~/types/products/attributes";

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

	const selected_size = ref<SizeSpec | null>(null)

	const updateSelectedSize = (code : string) => {
		if( !code ) {
			selected_size.value = null
			return
		}

		const matched = featured_sizes.value.filter(e => e.code == code);

		if( matched && matched.length )
			selected_size.value = matched[0] as SizeSpec
		else
			selected_size.value = null
	}

	const getDefaultSelectedSize = () => {
		if( !cart_service.selected_item?.value )
			return null


		const matched = featured_sizes.value.filter(e => e.width == cart_service.selected_item?.value?.width && e.height == cart_service.selected_item?.value?.height )
		console.log(matched)
	}

	return {
		...cart_service,
		featured_sizes,
		sizes,
		selected_size,
		closeModal,
		updateSelectedSize,
		getDefaultSelectedSize,
	}
}