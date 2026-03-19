import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { SizeSpec } from '~/types/products/attributes'

export const useSizeService = () => {
	const attributesStore = useAttributesStore()

	const selectionStore = useSelectionStore()

	const featured_sizes = computed(() => attributesStore.sizes)

	const size = computed(() => selectionStore.size)

	const custom_width = ref<number | null>(null)

	const custom_height = ref<number | null>(null)

	function defaultSize(selected_size: SizeSpec) {
		selectionStore.updateSize(selected_size, true)
	}


	// 📌 [Size] on-change
	function changeSize(selected_size: SizeSpec) {
		selectionStore.updateSize(selected_size)
	}

	const changeCustomSize = () => {
		const inputed_size = ref<SizeSpec>({
			id		: null,
			width	: custom_width.value ?? 0,
			height	: custom_height.value ?? 0,
			label	: null,
			custom	: true
		})

		selectionStore.updateSize(inputed_size.value)
	}

	return {
		featured_sizes,
		size,
		custom_width,
		custom_height,
		defaultSize,
		changeSize,
		changeCustomSize,
	}
}