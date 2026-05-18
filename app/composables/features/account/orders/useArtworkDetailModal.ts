export const useArtworkDetailModal = () => {
	const is_open = useState<boolean>(
		'features-account-orders-artwork-detail-open',
		() => false,
	)
	const is_dark_background = useState<boolean>(
		'features-account-orders-artwork-detail-dark',
		() => false,
	)

	const open_modal = () => {
		is_open.value = true
	}

	const close_modal = () => {
		is_open.value = false
	}

	const toggle_dark_background = () => {
		is_dark_background.value = !is_dark_background.value
	}

	return {
		is_open,
		is_dark_background,
		open_modal,
		close_modal,
		toggle_dark_background,
	}
}
