import { useCartStore } from "~/stores/cart";
import type { CartItemCreationSpec, CartItemSource } from "~/types/cart/cart";
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl";

export const useCartService = () => {
	const { $api } = useNuxtApp();

	const cart_store = useCartStore()

	const number_of_items = computed(() => cart_store.number_of_items )

	const sendToServer = async (params: CartItemSource) => {
		const { success, message, data } = await $api.post<CartItemCreationSpec>('cart/create', {...params})

		if( !success ) {
			console.log(message)
			return null
		}

		return data;
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

	const extractThrownError = (e: unknown) => {
		if (e instanceof Error) {
			return e.message
		} else if (typeof e === 'string') {
			return e
		} else {
			return "An unknown error occurred"
		}
	}

	type ResponseNumberSpec = {
		nr: number
	}
	const countNumberOfItems = async () => {
		const { success, message, data} = await $api.get<ResponseNumberSpec>('cart/count')
		if( !success || !data ) {
			console.warn(message)
			return
		}

		cart_store.syncNumber(data.nr)
	}

	return {
		number_of_items,
		sendToServer,
		sendToS3,
		countNumberOfItems,
	}

}