import { useUploadService } from "~/services/product/upload.service"
import { useCartStore } from "~/stores/core/cart/cart.store"
import { useAttributesStore, useSelectionStore } from "~/stores/product"
import { useUsersStore } from "~/stores/users/users.store"
import type { CartItem } from "~/types/cart/cart"
import { useCartApiService } from "./api.service"

export const useCartService = (caller : string) => {

	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const cart_store = useCartStore()

	const user_store = useUsersStore()

	const auth_user = user_store.state

	const upload_service = useUploadService()

	const cart_api_service = useCartApiService('cart-service')

	const uploading_file = ref<boolean>(false)

	const is_authenticated = computed(() => auth_user.id && auth_user.email )

	const config = useRuntimeConfig()

	const page = ref<number>(1)

	const per_page = ref<number>(10)

	const calculateCartItems = async () => {
		if( cart_store.is_authenticated ) {
			const cart_numbers = await cart_api_service.requestCartNumbers()
			if( !cart_numbers ) {
				return
			}

			cart_store.syncNumber(cart_numbers.total_count, cart_numbers.total_cost)
		} else {
			const tot_cost = cart_store.items.reduce((acc: number, item: CartItem) => {
				return acc + item.cost
			}, 0)
			cart_store.syncNumber(cart_store.items.length, tot_cost)
		}
	}

	const requestItems = async () => {
		cart_store.loading = true;
		try {
			// calculate the numbers of cart items everytime request new data from database
			calculateCartItems()

			const cart_items = await cart_api_service.requestCartItems(page.value, per_page.value)
			if( !cart_items )
				return

			if( cart_items.length )
				populateItems(cart_items)
			else
				cart_store.emptyCart()
		} finally {
			cart_store.loading = false;
		}
	}


	/**
	 * This will populate and arrange the items inside the  items state
	 */
	const populateItems = (cart_items: Partial<CartItem>[]) => {
		const local_drafts = cart_store.items.filter((item: CartItem) => item.id === null)

		/**
		 * Prevent duplication:
		 * - If a draft was just saved, its local_identity will now be in the server data.
		 */
		const incoming_identities = new Set(cart_items.map((i: Partial<CartItem>) => i.local_identity))

		const unique_drafts = local_drafts.filter(
			(draft: CartItem) => !incoming_identities.has(draft.local_identity)
		)

		cart_store.items = [...unique_drafts, ...cart_items] as CartItem[]

		// Default check select all after population
		cart_store.selected_ids = cart_store.items.map((item) => item.local_identity);
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
			is_duplicate = cart_store.items.some((item: CartItem) => item.local_identity === identifier)

		}

		return identifier
	}

	const is_absolute_url = (value: string | null | undefined) => Boolean(value && /^(https?:)?\/\//i.test(value))

	const formatImage = (item: CartItem) => {
		let f = is_absolute_url(item.product_thumbnail)
			? String(item.product_thumbnail)
			: `${config.public.file_url}${item.product_thumbnail}`

		if( item.id && item.artwork_file && item.file_path) {
			f = `${config.public.s3_file_url}${item.file_path}${item.artwork_file}`
		}

		return f
	}

	const saveItemLocally = (item: CartItem) => {
		cart_store.items.unshift(item)
		cart_store.grand_total += Number(item.cost)
		cart_store.addNumber()

		// Default check the new item
		cart_store.addSelected(item.local_identity)
	}


	/**
	 * Dispatch and save added cart.
	 * @param has_artwork boolean
	 */
	const addItem = async () => {
		console.warn('Adding Item!')
		if(!attributes_store.product || !selection_store.product_config_mapping_id ) {
			console.warn('Product data is missing!')
			return false
		}

		else if( !selection_store.size || !selection_store.size.width || !selection_store.size.height ) {
			console.warn('Dimensions is missing!')
			return false;
		}

		else if( !selection_store.quantity || !selection_store.quantity.nr ) {
			console.warn('Quantity is missing!')
			return false;
		}

		// End of validation

		const user_id = ref<number | null>(null)

		if( user_store && user_store.state && user_store.state.id )
			user_id.value = user_store.state.id


		// 🔥 Creating temporary ID — this will be use when the api already responded
		const item_id = generateLocalIdentity();

		const uploaded_file = ref<string>('')

		const artwork_file_name = ref<string>('')

		const has_artwork_file = Boolean(upload_service.artwork_file.value)

		if( has_artwork_file ) {

			if(!upload_service.artwork_file.value) {
				console.warn("Artwork file is required!")
				return
			}

			uploading_file.value = true
			// Upload the artwork file to S3 when artwork is provided.
			const { ok, message, filename } = await cart_api_service.sendToS3(upload_service.artwork_file.value)

			uploading_file.value = false
			console.log(ok)
			if( !ok || !ok.value ) {
				console.warn(message)
				return false
			}
			artwork_file_name.value = upload_service.artwork_file.value.name
			uploaded_file.value = filename.value
		}

		// Build the cart item payload for local state and API sync.
		const item = ref<CartItem>({
			id: null,
			user_id: user_id.value,
			product_config_mapping_id: selection_store.product_config_mapping_id,
			url_slug: attributes_store.product.url_slug,
			product: attributes_store.product.name,
			product_thumbnail: attributes_store.product.image,
			color: selection_store.color?.name ?? null,
			color_id: selection_store.color?.id ?? null,
			font: selection_store.font?.label ?? null,
			font_id: selection_store.font?.id ?? null,
			width: selection_store.size.width,
			height: selection_store.size.height,
			quantity: selection_store.quantity.nr,
			cost: selection_store.quantity.price ?? 0,
			lettering_text: selection_store.lettering_text,
			artwork_file: has_artwork_file ? uploaded_file.value : null,
			artwork_file_name: has_artwork_file ? artwork_file_name.value : null,
			artwork_preview: has_artwork_file ? upload_service.artwork_preview.value : null,
			instruction: selection_store.instruction,
			local_identity: item_id,
		})


		// 🔥 Store new item in local storage before uploading it to our database.
		console.log('Saving item locally!')
		cart_store.saveItemLocally(item.value)

		// 🔥 Sending the new item to API
		if( is_authenticated.value ) {
			console.log('sending to server')
			sendItemToServer(item.value)
		}

		return true
	}

	/**
	 * Preparing the data to be sent to API server
	 */
	const sendItemToServer = async (item : CartItem) => {
		// Send the new item to the API.
		const cart_payload = {
			product_config_mapping_id: item.product_config_mapping_id,
			color_id: item.color_id,
			font_id: item.font_id,
			width: item.width,
			height: item.height,
			quantity: item.quantity,
			lettering_text: item.lettering_text,
			artwork_file: item.artwork_file,
			artwork_file_name: item.artwork_file_name,
			instruction: item.instruction,
			local_identity: item.local_identity,
		}

		/** Forward the prepared data to actual API request  */
		const result = await cart_api_service.sendToServer(cart_payload)

		/** If API request successfully process, must update the item save locally to its created unique ID by API */
		if( result && result.item && result.item.id && item.local_identity )
			cart_store.updateUploadedItem(item.local_identity, result.item.id)
	}

	/** Adding/Removing selected item */
	const toggleSelection = (local_identity : string) => {
		/**
		 * If the selected item already exist in a selected state
		 * Execute removal or else add it as selected item
		 * */
		if( cart_store.selected_ids.includes(local_identity) )
			cart_store.removeSelected(local_identity)
		else
			cart_store.addSelected(local_identity)
	}

	const selectAllItem = (v : boolean) => {
		cart_store.all_selected = v
	}

	return {
		// 🔥 Cart States
		...storeToRefs(cart_store),

		// 🔥 Local States
		caller,

		// 🔥 Methods
		requestItems,
		addItem,
		saveItemLocally,
		formatImage,
		generateLocalIdentity,
		toggleSelection,
		selectAllItem,
		setDeletableItems 		: cart_store.setDeletableItems,
		emptyDeletableItems 	: cart_store.emptyDeletableItems,
	}
}