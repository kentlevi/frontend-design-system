import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransferCartStore = defineStore('transfer_cart', () => {
	/* --------------------------------/
	 * STATES
	 /-------------------------------- */
	const previous_user_id = ref<number | null>(null)
	const is_transferring = ref<boolean>(false)

	/* --------------------------------/
	 * SETTERS
	 /-------------------------------- */
	const setPreviousUserId = (value: number | null) => {
		previous_user_id.value = value
	}

	const setIsTransferring = (value: boolean) => {
		is_transferring.value = value
	}

	const reset = () => {
		previous_user_id.value = null
		is_transferring.value = false
	}

	return {
		previous_user_id,
		is_transferring,
		setPreviousUserId,
		setIsTransferring,
		reset,
	}
})
