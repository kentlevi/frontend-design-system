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
		console.log(23)
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
		console.log(1)
		lettering.value.text = value

		letteringUpdate()
	}

	const letteringWidthUpdate = (value: number) => {
		console.log(2)
		lettering.value.width = value

		letteringUpdate()
	}

	const letteringHeightUpdate = (value: number) => {
		console.log(3)
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