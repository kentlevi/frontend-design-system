import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { ColorSpec } from "~/types/products/attributes"

export const useColorService = () => {
	const attribute_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const color = ref<ColorSpec | null>(selection_store.color ?? null)

	const featured_colors = computed<ColorSpec[]>(() => {
		const active_slug = selection_store.url_slug ?? ''

		if (active_slug === 'vinyl-lettering') {
			return (attribute_store.colors ?? []).filter((entry) => entry.key !== 'full-color')
		}

		return attribute_store.colors ?? []
	})

	const defaultColor = (selected_color: ColorSpec) => {
		color.value = selected_color

		selection_store.updateColor(selected_color, true)
	}


	const changeColor = (selected_color: ColorSpec) => {
		color.value = selected_color

		selection_store.updateColor(selected_color)
	}

	return {
		color,
		featured_colors,
		defaultColor,
		changeColor,
	}
}