export const useReplaceArtworkModal = () => {
	const is_open = useState<boolean>('features-account-orders-replace-open', () => false)

	const open_modal = () => {
		is_open.value = true
	}

	const close_modal = () => {
		is_open.value = false
	}

	return {
		is_open,
		open_modal,
		close_modal,
	}
}
