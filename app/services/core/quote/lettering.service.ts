import { useSelectionStore } from "~/stores/product"
import type { SizeSpec } from "~/types/products/attributes"

/**
 * Handles the state and methods for Lettering
 * @param _caller — to identify where this service been used
 */
export const useLetteringService = (caller: string) => {

	const selection_store = useSelectionStore()

	const default_size_spec = ref<SizeSpec>({
		width: 208,
		height: 30,
		custom: true,
		label: 'Vinyl-Lettering'
	})

	const size = computed(() => selection_store.size)

	const text = computed(() => selection_store.lettering_text)

	const flag = computed(() => selection_store.lettering_flag)

	const editor_ref = computed(() => selection_store.lettering_editor_ref)


	const assignDefault = (text: string) => {
		selection_store.updateLetteringText(text, true)
	}

	const update = (size: SizeSpec, txt : string) => {
		selection_store.updateLetteringText(txt)
		selection_store.updateSize(size)
	}

	const updateFile = (f : File) => {
		if( !f )
			return

		selection_store.updateLetteringFile(f)
	}

	return {
		// 🔥 States
		caller,
		default_size_spec,
		size,
		text,
		preview_ready: selection_store.lettering_preview_ready,
		flag,
		editor_ref,

		// 🔥 Methods
		assignDefault,
		update,
		updateLetteringPreviewFlag: selection_store.updateLetteringPreviewFlag,
		updateLetteringEditorRef: selection_store.updateLetteringEditorRef,
		updateFile,
	}
}