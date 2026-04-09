import { useSelectionStore } from "~/stores/product"
import type { LetteringSpec, SizeSpec } from "~/types/products/attributes"

export const useLetteringService = () => {

	const selection_store = useSelectionStore()


	const lettering = ref<LetteringSpec>({
		active: 'height',
		width: 208,
		height: 30,
		text: '',
	})

	const defaultLettering = (size: SizeSpec, text: string) => {
		if( size
			&& 'width' in size
			&& 'height' in size
			&& size.width
			&& size.height
		) {
			lettering.value.width = size.width
			lettering.value.height = size.height
		}

		if( text ) {
			lettering.value.text = text
		}
	}


	const letteringUpdate = () => {
		const size_spec = ref<SizeSpec>({
			custom: false,
			label: 'Vinyl-Lettering',
			width: lettering.value.width,
			height: lettering.value.height
		})

		selection_store.updateSize(size_spec.value)

		selection_store.updateLetteringText(lettering.value.text)
	}

	const letteringTextUpdate = (value: string) => {
		lettering.value.text = value

		letteringUpdate()
	}

	const letteringWidthUpdate = (value: number | null) => {
		lettering.value.width = value

		letteringUpdate()
	}

	const letteringHeightUpdate = (value: number | null) => {
		lettering.value.height = value

		letteringUpdate()
	}

	const letteringFileUpdate = (f : File) => {
		if( !f )
			return

		selection_store.updateLetteringFile(f)
	}


	return {
		lettering,
		letteringUpdate,
		defaultLettering,
		letteringTextUpdate,
		letteringWidthUpdate,
		letteringHeightUpdate,
		letteringFileUpdate,
	}
}