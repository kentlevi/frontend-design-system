import type { ApiResponse } from '~/types/config/api'

export interface TransferCartPayload {
	previous_user_id: number
}

export const postTransferCart = async (payload: TransferCartPayload): Promise<ApiResponse> => {
	const { $api } = useNuxtApp()
	return $api.post('cart/transfer-cart', { ...payload }) as Promise<ApiResponse>
}