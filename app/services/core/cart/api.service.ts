import type { CartItemAPI, ExpectedCartItemData, ResponseNumberSpec } from "~/types/cart/cart"
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl"

export const useCartApiService = (caller: string) => {

	const {$api} = useNuxtApp()

	const extractThrownError = (e: unknown) => {
		if (e instanceof Error) {
			return e.message
		} else if (typeof e === 'string') {
			return e
		} else {
			return "An unknown error occurred"
		}
	}

	const sendToS3 = async (file: File) => {

		const ok = ref<boolean>(false)

		const message = ref<string>('')

		const filename = ref<string>('')

		try {
			const { file_name } = await uploadFileToPresignedUrl({
				file_path_code: 'artwork',
				file: file
			})

			filename.value = file_name

			ok.value = true
		} catch(e: unknown) {

			console.error(e)

			message.value = extractThrownError(e)
		}

		return { ok, message , filename};
	}

	type ExpectedCartData = {
		id: number
		local_identity: string
	}

	type ExpectedCartResult = {
		success: ExpectedCartData[],
	}
	const sendToServer = async (params: CartItemAPI[]) : Promise<ExpectedCartData[] | null> => {
		const { success, message, data } = await $api.post<ExpectedCartResult>('cart/create',
			{ items: params }
		)

		if( !success || !data || !data.success) {
			console.warn(message || 'Failed to sync cart with server')
			return null
		}

		return data.success
	}


	const requestDeletion = async (local_identities: string[]) => {
		const { success, message } = await $api.post('cart/delete',
			{ local_identities: local_identities }
		)

		if( !success ) {
			console.warn(message)
			return null
		}

		return success;
	}

	// Requesting cart items from database
	const requestCartItems = async (page?: number, per_page?: number): Promise<ExpectedCartItemData []> => {
		const { success, message, data } = await $api.get<ExpectedCartItemData []>('cart', { params: { page, per_page }})

		if(!success || !data) {
			console.warn(message)
			return []
		}

		if (!data.length)
			return []

		return data
	}

	const requestCartNumbers = async() => {
		const { success, message, data} = await $api.get<ResponseNumberSpec>('cart/calculate')

		if( !success || !data ) {
			console.warn(message)
			return
		}

		return data
	}

	const requestArtworkUpdate = async (
		item_id: number,
		file_name: string,
		uploaded_file: string,
		instruction: string,
		source: string = 'cart-artwork-update',
	) => {
		const { success, message } = await $api.post(
			'cart/artwork/update',
			{
				item_id: item_id,
				file_name: file_name,
				uploaded_file: uploaded_file,
				instruction: instruction,
				source: source,
			}
		)

		if( !success )
			console.warn(message)

		return success
	}


	const requestItemUpdate = async (
		item_id: number,
		width: number,
		height: number,
		quantity: number
	) => {
		const { success, message } = await $api.post(
			'cart/item/update',
			{
				item_id: item_id,
				width: width,
				height: height,
				quantity: quantity,
			}
		)

		if( !success )
			console.warn(message)

		return success
	}

	return {
		// 🔥 States
		caller,

		// 🔥 Methods
		extractThrownError,
		sendToS3,
		sendToServer,
		requestDeletion,
		requestCartItems,
		requestCartNumbers,
		requestArtworkUpdate,
		requestItemUpdate,
	}
}