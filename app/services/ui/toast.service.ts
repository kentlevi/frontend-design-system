import { useToastStore } from '~/stores/toast'

type ToastOptions = Parameters<ReturnType<typeof useToastStore>['showToastWithTimer']>[0]

export const useToastService = () => {
	const toast_store = useToastStore()

	const showToast = (toast_options: ToastOptions, duration_ms: number = 3000) => {
		toast_store.showToastWithTimer(toast_options, duration_ms)
	}

	return {
		showToast,
	}
}