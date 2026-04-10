import { useCartStore } from "~/stores/cart";
import type { CartItem, CartItemAPI, CartItemCreationSpec, ExpectedCartItemData, ResponseNumberSpec, SavedDraftResponse } from "~/types/cart/cart";
import type { FeaturedDataResponse } from "~/types/products/attributes";
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl";

export const useCartService = (caller: string = 'unknown') => {
	const { $api } = useNuxtApp();

	const config = useRuntimeConfig()

	const cart_store = useCartStore()

	const page = ref<number>(1)

	const per_page = ref<number>(10)

	const formatImage = (item: CartItem) => {
		const is_absolute_url = (value: string | null | undefined) =>
			Boolean(value && /^(https?:)?\/\//i.test(value))

		let f = is_absolute_url(item.product_thumbnail)
			? String(item.product_thumbnail)
			: `${config.public.file_url}${item.product_thumbnail}`

		if( item.id && item.artwork_file) {
			f = `${config.public.s3_file_url}${item.file_path}${item.artwork_file}`
		} else if( item.artwork_preview ) {
			f = item.artwork_preview
		}

		return f
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

	const calculateCartItems = async () => {
		if( cart_store.is_authenticated ) {
			const { success, message, data} = await $api.get<ResponseNumberSpec>('cart/calculate')
			if( !success || !data ) {
				console.warn(message)
				return
			}

			syncNumber(data.total_count, data.total_cost)
		} else {
			const tot_cost = cart_store.items.reduce((acc, item) => {
				return acc + item.cost
			}, 0)
			syncNumber(cart_store.items.length, tot_cost)
		}
	}

	const getCartItems = async (first_load : boolean = false) => {
		// calculate the numbers of cart items everytime request new data from database
		calculateCartItems()

		if( !cart_store.is_authenticated )
			return

		const cart_items = await requestCartItems(page.value, per_page.value)
		if( !cart_items )
			return

		if( cart_items.length )
			populateItems(cart_items)
		else if( first_load && !cart_items.length && cart_store.number_of_items == 0 )
			empty()
	}

	// 📌 Requesting cart items from database
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


	// 📌 Deleting specific cart in both local storage and database
	const requestDeletion = async (item_id: number | null, local_identity?: string | null) => {
		console.warn(`Deleting item ${item_id ?? local_identity}`)

		removeStateItem(item_id, local_identity ?? null)

		const {success, message} = await $api.post(`cart/${item_id}/delete`)

		if( !success )
			console.warn(message)

		return
	}

	const removeStateItem = (item_id: number | null, local_identity?: string | null) => {
		// ✅ Removing item with the given item index
		if( item_id )
			cart_store.items = cart_store.items.filter(item => item.id != item_id)
		// ✅ Removing the one matching the ID
		else if( local_identity )
			cart_store.items = cart_store.items.filter(item => item.local_identity != local_identity)

		reduceNumber()
	}

	const saveDraft = async () => {
		const drafted = cart_store.unsave_draft.map( e => {
			return {
				product_config_mapping_id: e.product_config_mapping_id,
				color_id: e.color_id,
				font_id: e.font_id,
				width: e.width,
				height: e.height,
				quantity: e.quantity,
				cost: e.cost,
				lettering_text: e.lettering_text,
				artwork_file: e.artwork_file,
				artwork_file_name: e.artwork_file_name,
				instruction: e.instruction,
				local_identity: e.local_identity,
			}
		})
		const { success, message, data } = await $api.post<SavedDraftResponse>('cart/saving-draft', { cart_items: drafted })

		if( !success ) {
			console.log(message)
			return null
		}

		return data;
	}

	const setForDeleteItem = (cart_item_id: number | null) => {
		cart_store.deletion_id = cart_item_id ?? 0
	}

	const syncNumber = (total_count: number, total_cost: number) => {
		cart_store.number_of_items = Number(total_count)
		cart_store.grand_total = Number(total_cost)
	}


	const saveItemLocally = (item: CartItem) => {
		cart_store.items.unshift(item)
		cart_store.grand_total += Number(item.cost)
		addNumber()
	}

	/**
	 * This will populate and arrange the items inside the  items state
	 */
	const populateItems = (cart_items: Partial<CartItem>[]) => {
		const local_drafts = cart_store.items.filter(item => item.id === null)

		/**
		 * Prevent duplication:
		 * - If a draft was just saved, its local_identity will now be in the server data.
		 */
		const incoming_identities = new Set(cart_items.map(i => i.local_identity))

		const unique_drafts = local_drafts.filter(
			draft => !incoming_identities.has(draft.local_identity)
		)
		cart_store.unsave_draft = unique_drafts;

		cart_store.items = [...unique_drafts, ...cart_items] as CartItem[]
	}


	const updateUploadedItem = (local_identity: string, new_id: number) => {
		const index = cart_store.items.findIndex(i => i.local_identity === local_identity)

		if( index !== -1 && cart_store.items[index] ) {
			cart_store.items[index].id = new_id
			if( cart_store.items[index]?.artwork_preview )
				cart_store.items[index].artwork_preview = null
		}
	}

	const empty = () => {
		cart_store.items = []
		cart_store.number_of_items = 0
		cart_store.grand_total = 0
	}

	const addNumber = () => {
		cart_store.number_of_items++
	}

	const reduceNumber = () => {
		cart_store.number_of_items--
	}

	const generateLocalIdentity = (): string => {
		let identifier: string = ''
		let is_duplicate = true

		while (is_duplicate) {
			// Create a short unique string (e.g., "sj-1712401234-a7b2")
			const timestamp = Date.now()
			const randomPart = Math.random().toString(36).substring(2, 6)
			identifier = `mu-${timestamp}-${randomPart}`

			// Check if this ID already exists in your current items array
			is_duplicate = cart_store.items.some(item => item.local_identity === identifier)
		}

		return identifier
	}

	const selectItem = (item: CartItem) => {
		cart_store.selected_item = item
	}

	const setFeaturedData = (featured_data : FeaturedDataResponse) => {
		cart_store.featured_data = featured_data
	}

	const clearSelection = () => {
		cart_store.selected_item = null
		cart_store.featured_data = null
	}

	return {
		...storeToRefs(cart_store),
		caller,
		page,
		per_page,
		formatImage,
		sendToServer,
		sendToS3,
		extractThrownError,
		calculateCartItems,
		getCartItems,
		requestCartItems,
		requestDeletion,
		removeStateItem,
		saveDraft,
		setForDeleteItem,
		syncNumber,
		saveItemLocally,
		populateItems,
		updateUploadedItem,
		empty,
		addNumber,
		reduceNumber,
		generateLocalIdentity,
		selectItem,
		setFeaturedData,
		clearSelection,
	}

}