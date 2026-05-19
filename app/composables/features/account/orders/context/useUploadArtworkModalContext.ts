import { useUploadArtworkModal } from './useUploadArtworkModal'

type composable_context = ReturnType<typeof useUploadArtworkModal>

const key = Symbol('upload-artwork-modal')

export const provideUploadArtworkModal = () => {
	const flow = useUploadArtworkModal()

	provide(key, flow)

	return flow
}

export const useUploadArtworkModalContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useUploadArtworkModalContext')
	}

	return context
}