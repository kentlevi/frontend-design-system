import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { FontSpec } from "~/types/products/attributes"

export const useFontService = () => {
	const attribute_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const font = computed(() => selection_store.font)

	const featured_fonts = computed<FontSpec[]>(() => attribute_store.fonts ? attribute_store.fonts : [])

	const defaultFont = (selected_font: FontSpec) => {
		selection_store.updateFont(selected_font, true)
	}


	const changeFont = (selected_font: FontSpec) => {
		selection_store.updateFont(selected_font)
	}

	return {
		font,
		featured_fonts,
		defaultFont,
		changeFont,
	}
}