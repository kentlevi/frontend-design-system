import type { CartItemSource } from "~/types/cart/cart";
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl";

export const useCartService = () => {
	const { $api } = useNuxtApp();

	const sendToServer = async (params: CartItemSource) => {
		console.log(params)
		const { success, message } = await $api.post('cart/create', {...params})

		if( !success ) {
			console.log(message)
			return false
		}

		return true;
	}

	const sendToS3 = async (file: File) => {

		const process = ref({
			ok: false,
			message: '',
			file_name: '',
		})
		try {
			const { file_name } = await uploadFileToPresignedUrl({
				file_path_code: 'artwork',
				file: file
			})

			process.value.file_name = file_name
		} catch(e: unknown) {
			console.error(e)
			process.value.message = extractThrownError(e)
		}

		return process;
	}

	const extractThrownError = (e: unknown) => {
		if (e instanceof Error) {
			return e.message
		} else if (typeof e === 'string') {
			return e
		} else {
			return "An unknown error occurred"
		}
	}

	return {
		sendToServer,
		sendToS3,
	}

}