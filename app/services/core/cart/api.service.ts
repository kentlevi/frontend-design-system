import type { CartItemAPI, CartItemCreationSpec } from "~/types/cart/cart"
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

	const sendToServer = async (params: CartItemAPI) => {
		const { success, message, data } = await $api.post<CartItemCreationSpec>('cart/create',
			{ ...params }
		)

		if( !success ) {
			console.warn(message)
			return null
		}

		return data;
	}

	return {
		// 🔥 States
		caller,

		// 🔥 Methods
		sendToS3,
		sendToServer,
	}
}