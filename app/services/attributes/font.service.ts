import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { FontSpec } from "~/types/products/attributes"

export const useFontService = () => {
	const attribute_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const font = ref<FontSpec | null>(selection_store.font ?? null)

	const featured_fonts = computed<FontSpec[]>(() => attribute_store.fonts ? attribute_store.fonts : [])

	const defaultFont = (selected_font: FontSpec) => {
		font.value = selected_font

		selection_store.updateFont(selected_font, true)
	}


	const changeFont = (selected_font: FontSpec) => {
		font.value = selected_font

		selection_store.updateFont(selected_font)
	}

	return {
		font,
		featured_fonts,
		defaultFont,
		changeFont,
	}
}