import { useProductStore, useSelectionStore } from '~/stores/product'
import type { SizeSpec } from '~/types/products/attributes'

export const useProductHandler = () => {

	const productStore = useProductStore()

	const selectionStore = useSelectionStore()

	const featured_sizes = computed(() => productStore.sizes)

	const featured_quantities = computed(() => productStore.quantities)

	const product = computed(() => selectionStore.product)

	const size = computed(() => selectionStore.size)

	const is_custom_size = ref<boolean>(!!size.value?.custom)

	const quantity = computed(() => selectionStore.quantity )

	const is_custom_qty = ref<boolean>( !!quantity.value?.custom )

	const custom_width = ref<number | null>(null)

	const custom_height = ref<number | null>(null)

	const custom_width_input = ref<HTMLInputElement | null>(null)

	function fetchAttributes() {

	}

	// 📌 Updating selected product
	function updateProduct(prod_str: string) {
		selectionStore.updateProduct(prod_str)

		assignDefault(prod_str)
	}

	function assignDefault(prod_str : string) {
		// 📌 Existing attributes
		const ex_attr = selectionStore.hasSelection(prod_str)
		// 🔥 If the current selected product, has already a pre-selected attributes
		if( ex_attr ) {
			selectionStore.assignDefault(ex_attr)
		}
		// 🔥 The user don't have a pre-selected or changes in default attributes
		else {
			// Get first size as default
			const default_size = featured_sizes.value[0]
			if( default_size )
				selectionStore.updateSize(default_size)

			// Get first quantity as default
			const default_qty = featured_quantities.value[0]
			if( default_qty )
				selectionStore.updateQuantity({
					nr: default_qty,
					custom: false
				})
		}
	}

	// 📌 [Size] on-change
	function changeSize(selected_size: SizeSpec) {
		selectionStore.updateSize(selected_size)
	}
	// 📌 [Quantity] on-change
	function changeQuantity(selected_qty: number) {
		selectionStore.updateQuantity({
			nr: selected_qty,
			custom: false
		})
	}

	const changeCustomSize = () => {
		const i_width = custom_width.value ?? 0
		const i_height = custom_height.value ?? 0

		const inputed_size = ref<SizeSpec>({
			id: null,
			width: i_width,
			height: i_height,
			label: null,
			custom: false
		})

		selectionStore.updateSize(inputed_size.value)
	}

	const enableCustomSize = async () => {
		is_custom_size.value = true
		await nextTick()
		custom_width_input.value?.focus()
	}

	return {
		productStore,
		selectionStore,
		featured_sizes,
		featured_quantities,
		product,
		size,
		is_custom_size,
		quantity,
		is_custom_qty,
		custom_width,
		custom_height,
		custom_width_input,

		fetchAttributes,
		updateProduct,
		changeSize,
		changeQuantity,
		changeCustomSize,
		enableCustomSize,
	}
}