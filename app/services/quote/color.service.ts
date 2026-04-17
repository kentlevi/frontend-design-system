import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { ColorSpec } from "~/types/products/attributes"

export const useColorService = (caller: string) => {
	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const src = computed(() => selection_store.color)

	const collection = computed<ColorSpec[]>(() => {
		const active_slug = selection_store.url_slug ?? ''

		if (active_slug === 'vinyl-lettering') {
			return (attributes_store.colors ?? []).filter((entry) => {
				const kw = (entry.keyword || '').toLowerCase();
				const name = (entry.name || '').toLowerCase();
				return kw !== 'full-color' && !name.includes('full color');
			})
		}

		return attributes_store.colors ?? []
	})

	const applyDefault = (selected_color: ColorSpec | null) => {
		selection_store.updateColor(selected_color, true)
	}

	const updateCollection = (colors : ColorSpec[]) => {
		attributes_store.updateColors(colors)
	}


	const update = (selected_color: ColorSpec) => {
		selection_store.updateColor(selected_color)
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