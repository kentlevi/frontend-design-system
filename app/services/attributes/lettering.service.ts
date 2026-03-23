import { useSelectionStore } from "~/stores/product"
import type { LetteringSpec, SizeSpec } from "~/types/products/attributes"

export const useLetteringService = () => {

	const selectionStore = useSelectionStore()


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
		const ssize = ref<SizeSpec>({
			id: null,
			custom: false,
			label: 'Vinyl-Lettering',
			width: lettering.value.width,
			height: lettering.value.height
		})

		selectionStore.updateSize(ssize.value)

		selectionStore.updateLetteringText(lettering.value.text)
	}

	const letteringTextUpdate = (value: string) => {
		lettering.value.text = value

		letteringUpdate()
	}

	const letteringWidthUpdate = (value: number) => {
		lettering.value.width = value

		letteringUpdate()
	}

	const letteringHeightUpdate = (value: number) => {
		lettering.value.height = value

		letteringUpdate()
	}

	return {
		lettering,
		letteringUpdate,
		defaultLettering,
		letteringTextUpdate,
		letteringWidthUpdate,
		letteringHeightUpdate,
	}
}