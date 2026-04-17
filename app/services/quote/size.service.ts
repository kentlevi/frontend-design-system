import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { SizeSpec } from "~/types/products/attributes"

export const useSizeService = (caller: string) => {

	const selection_store = useSelectionStore()

	const attributes_store = useAttributesStore()

	const collection = computed(() => attributes_store.sizes)

	const src = computed(() => selection_store.size)

	const applyDefault = (selected_size: SizeSpec) => {
		if( selected_size && selected_size.custom && collection && collection.value ) {
			const matched_size = collection.value.find(e => e.width == selected_size.width &&  e.height == selected_size.height)

			if( matched_size ) {
				selected_size.label = matched_size.label
			}
		}

		selection_store.updateSize(selected_size, true)
	}

	const updateCollection = (sizes : SizeSpec []) => {
		attributes_store.updateSizes(sizes)
	}

	const update = (size: SizeSpec) => {
		if( !size )
			return

		if( collection && collection.value && size.custom ) {
			const matched_size = collection.value.find(e => e.width == size.width &&  e.height == size.height)

			if( matched_size ) {
				size.label = matched_size.label
			}
		}

		selection_store.updateSize(size)
	}

	return {
		// 🔥 States
		caller,
		src,
		collection,

		// 🔥 Methods
		applyDefault,
		update,
		updateCollection,
	}
}