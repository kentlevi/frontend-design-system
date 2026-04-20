import type VinylLetteringDesigner from "~/components/products/product-category/VinylLetteringDesigner.vue"
import { useColorService } from "~/services/quote/color.service"
import { useFontService } from "~/services/quote/font.service"
import { useLetteringService } from "~/services/quote/lettering.service"
import { useQuoteService } from "~/services/quote/quote.service"
import { useSizeService } from "~/services/quote/size.service"
import type { SizeSpec } from "~/types/products/attributes"

export const useQuoteView = () => {
	const quote_service = useQuoteService('quote-view')

	const lettering_service = useLetteringService('quote-view')

	const color_service = useColorService('quote-view')

	const size_service = useSizeService('quote-view')

	const font_service = useFontService('quote-view')

	const lettering_size = ref<SizeSpec>(lettering_service.default_size_spec.value)

	const lettering_text = ref<string>(lettering_service.text.value)

	const vinyl_designer_ref = ref<InstanceType<typeof VinylLetteringDesigner> | null>(null)

	const updateSizeByCard  = (selected_size : SizeSpec) => {
		size_service.update(selected_size)
	}

	const setVinylDesignerRef = (instance: InstanceType<typeof VinylLetteringDesigner> | null) => {
		vinyl_designer_ref.value = instance;
	}

	// ⚠️ Watching the changes of size from other component
	watch(() => size_service.src, (new_size) => {
		// Only if the lettering editor is active
		if( quote_service.has_lettering_editor.value && new_size && new_size.value ) {
			if( new_size.value.src && new_size.value.src == 'lettering-size-field' ) {
				lettering_size.value.width 	= Number(new_size.value.width)
				lettering_size.value.height	= Number(new_size.value.height)
			}
		}
	}, {
		immediate: true,
		deep: true
	})

	// ⚠️ Watching the changes of font from other component
	watch(() => font_service.src, () => {
		if( quote_service.has_lettering_editor.value && lettering_text.value) {
			lettering_service.update(lettering_size.value, lettering_text.value)
		}
	}, {
		immediate: true,
		deep: true,
	})

	// ⚠️ Watching the changes of text
	watch(() => lettering_text.value , (new_text) => {
		if( quote_service.has_lettering_editor.value ) {
			lettering_size.value = { ...lettering_size.value, src: 'lettering-editor' }
			lettering_service.update(lettering_size.value, new_text)
		}
	}, {
		immediate: true,
	})

	watch(() => lettering_service.flag.value, (new_value) => {
		if( new_value == 'default' )
			lettering_text.value = lettering_service.text.value
	})




	return {
		// 🔥 States
		url_slug: quote_service.url_slug,
		has_lettering_editor: quote_service.has_lettering_editor,
		has_color_selection: quote_service.has_color_selection,
		has_font_selection: quote_service.has_font_selection,
		is_loading_features: quote_service.is_loading_features,
		lettering_size,
		lettering_text,
		selected_font: font_service.src,
		selected_color: color_service.src,
		navigation_flight : quote_service.navigation_flight,
		sizes: size_service.collection,
		size: size_service.src,
		vinyl_designer_ref,

		// 🔥 Methods
		updateLetteringPreviewFlag: lettering_service.updateLetteringPreviewFlag,
		updateSizeByCard,
		setVinylDesignerRef,
	}
}