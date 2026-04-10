import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { SizeSpec } from '~/types/products/attributes'

export const useSizeService = () => {
	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const featured_sizes = computed(() => attributes_store.sizes)

	const size = ref<SizeSpec |  null>(selection_store.size ?? null)

	const custom_size = ref<SizeSpec>({
		width	: null,
		height	: null,
		label	: null,
		custom	: true
	})

	function defaultSize(selected_size: SizeSpec) {
		if( selected_size.custom ) {
			custom_size.value = selected_size
		} else {
			size.value = selected_size
		}

		selection_store.updateSize(selected_size, true)
	}


	// [Size] on-change
	function changeSize(selected_size: SizeSpec) {
		size.value = selected_size

		selection_store.updateSize(selected_size)
	}

	const changeCustomSize = () => {
		if( featured_sizes && featured_sizes.value ) {
			const matched_size = featured_sizes.value.find(e => e.width == custom_size.value.width &&  e.height == custom_size.value.height)

			if( matched_size ) {
				custom_size.value.label = matched_size.label
			}
		}

		selection_store.updateSize(custom_size.value)
	}

	const resetCustomSize = () => {
		custom_size.value.width = null
		custom_size.value.height = null
		custom_size.value.label = null
	}

	return {
		featured_sizes,
		size,
		custom_size,
		defaultSize,
		changeSize,
		changeCustomSize,
		resetCustomSize,
	}
}