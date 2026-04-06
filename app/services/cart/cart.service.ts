import { useCartStore } from "~/stores/cart";
import type { CartItem, CartItemCreationSpec } from "~/types/cart/cart";
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl";

export const useCartService = () => {
	const { $api } = useNuxtApp();

	const cart_store = useCartStore()

	const number_of_items = computed(() => cart_store.number_of_items )

	const sendToServer = async (params: CartItem) => {
		const { success, message, data } = await $api.post<CartItemCreationSpec>('cart/create',
			{
				product_config_mapping_id: params.product_config_mapping_id,
				color_id: params.color_id,
				font_id: params.font_id,
				width: params.width,
				height: params.height,
				quantity: params.quantity,
				cost: params.cost,
				lettering_text: params.lettering_text,
				artwork_file: params.artwork_file,
				artwork_file_name: params.artwork_file_name,
				instruction: params.instruction,
				local_identity: params.local_identity,
			}
		)

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
		total_cost: number
		total_count: number
	}
	const countNumberOfItems = async () => {
		const { success, message, data} = await $api.get<ResponseNumberSpec>('cart/calculate')
		if( !success || !data ) {
			console.warn(message)
			return
		}

		cart_store.syncNumber(data.total_count, data.total_cost)
	}

	type ExpectedCartItemData = {
		id : number
		product_config_mapping_id : number
		url_slug : string
		product : string
		product_thumbnail : string
		color : string | null
		color_id : number | null
		font : string | null
		font_id : number | null
		width : number
		height : number
		quantity : number
		cost : number
		lettering_text : string | null
		artwork_file : string | null
		artwork_file_name : string | null
		instruction : string | null
		local_identity : string
		file_path : string | null
	}


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

	const removeCartItem = async (item_id: number | null, local_identity?: string | null) => {
		console.warn(`Deleting item ${item_id ?? local_identity}`)

		cart_store.removeItem(item_id, local_identity ?? null)

		const {success, message} = await $api.post(`cart/${item_id}/delete`)
		if( !success ) {
			console.warn(message)
			return
		}
	}

	return {
		number_of_items,
		sendToServer,
		sendToS3,
		countNumberOfItems,
		requestCartItems,
		removeCartItem,
	}

}