import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { FontSpec } from "~/types/products/attributes"

export const useFontService = () => {
	const attributeStore = useAttributesStore()

	const selectionStore = useSelectionStore()

	const font = ref<FontSpec | null>(selectionStore.font ?? null)

	const featured_fonts = ref<FontSpec []>(attributeStore.fonts ?? [])

	const defaultFont = (selected_font: FontSpec) => {
		font.value = selected_font

		selectionStore.updateFont(selected_font, true)
	}


	const changeFont = (selected_font: FontSpec) => {
		font.value = selected_font

		selectionStore.updateFont(selected_font)
	}

	return {
		font,
		featured_fonts,
		defaultFont,
		changeFont,
	}
}