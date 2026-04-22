import { useAttributesStore, useSelectionStore } from "~/stores/product"
import type { FontSpec } from "~/types/products/attributes"

export const useFontService = (caller: string) => {

	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const collection = computed<FontSpec[]>(() =>  attributes_store.product_w_font && attributes_store.fonts ? attributes_store.fonts : [])

	const default_src = ref<FontSpec>({
		id:1,
		label:"Antique Olive",
		value:"Antique Olive",
		code:"Antique Olive",
		style:{
			fontFamily:"Antique Olive"
		}
	})

	const src = computed<FontSpec | null>(() => attributes_store.product_w_font && selection_store?.font ? selection_store?.font : default_src.value )

	const assignDefault = (font: FontSpec | null) => {
		selection_store.updateFont(font, true)
	}

	const updateCollection = (fonts : FontSpec []) => {
		attributes_store.updateFonts(fonts)
	}

	const update = (selected_font: FontSpec | null) => {
		selection_store.updateFont(selected_font)
	}

	return {
		// 🔥 States
		caller,
		src,
		collection,
		active: attributes_store.product_w_font,

		// 🔥 Methods
		assignDefault,
		update,
		updateCollection,
	}
}