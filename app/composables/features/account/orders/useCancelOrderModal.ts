export const useCancelOrderModal = () => {
	const is_open = useState<boolean>('features-account-orders-cancel-order-open', () => false)
	const step = useState<'confirm' | 'reason'>('features-account-orders-cancel-order-step', () => 'confirm')

	const open_modal = () => {
		step.value = 'confirm'
		is_open.value = true
	}

	const close_modal = () => {
		is_open.value = false
		step.value = 'confirm'
	}

	const proceed_to_reason = () => {
		step.value = 'reason'
	}

	const back_to_confirm = () => {
		step.value = 'confirm'
	}

	return {
		is_open,
		step,
		open_modal,
		close_modal,
		proceed_to_reason,
		back_to_confirm,
	}
}
