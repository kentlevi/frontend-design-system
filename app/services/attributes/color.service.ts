import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { ColorSpec } from "~/types/products/attributes"

export const useColorService = () => {
	const attributeStore = useAttributesStore()

	const selectionStore = useSelectionStore()

	const color = ref<ColorSpec | null>(selectionStore.color ?? null)

	const featured_colors = ref<ColorSpec []>(attributeStore.colors ?? [])

	const defaultColor = (selected_color: ColorSpec) => {
		color.value = selected_color

		selectionStore.updateColor(selected_color, true)
	}


	const changeColor = (selected_color: ColorSpec) => {
		color.value = selected_color

		selectionStore.updateColor(selected_color)
	}

	return {
		color,
		featured_colors,
		defaultColor,
		changeColor,
	}
}