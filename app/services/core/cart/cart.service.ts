import { useUploadService } from "~/services/product/upload.service"
import { useCartStore } from "~/stores/core/cart/cart.store"
import { useAttributesStore, useSelectionStore } from "~/stores/product"
import { useUsersStore } from "~/stores/users/users.store"
import type { CartItem } from "~/types/cart/cart"
import { useCartApiService } from "./api.service"
import { useQuoteApiService } from "../quote/api.service"

export const useCartService = (caller : string) => {

	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const cart_store = useCartStore()

	const user_store = useUsersStore()

	const upload_service = useUploadService()

	const cart_api_service = useCartApiService('cart-service')

	const quote_api_service = useQuoteApiService()

	const uploading_file = ref<boolean>(false)

	const is_authenticated = computed(() => Boolean(user_store.is_authenticated) )

	const config = useRuntimeConfig()

	const page = ref<number>(1)

	const per_page = ref<number>(10)

	const calculateCartItems = async () => {
		console.warn('Calculating carts...')
		if( user_store.is_authenticated ) {
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

	/** This will evaluate all items in user's cart */
	const evaluateCart = async () => {
		console.warn('Evaluating carts...')

		if( !user_store.is_authenticated ) {
			await cart_store.emptyCart(true) // empty the cart with only the unsave item will remain
		}

		sendUnsaveToServer()
	}

	const requestItems = async () => {
		if( !is_authenticated.value )
			return

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

		cart_store.initQuantityMap()
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
		} else if( item.artwork_preview ) {
			f = item.artwork_preview;
		}

		return f
	}

	const saveItemLocally = (item: CartItem) => {
		cart_store.addItem(item)
	}


	/**
	 * Dispatch and save added cart.
	 * @param has_artwork boolean
	 */
	const addItem = async () => {
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

		const artwork_file_name = ref<string>(upload_service.artwork_file.value?.name ?? '')

		const has_artwork_file = Boolean(upload_service.artwork_file.value)

		if( has_artwork_file ) {

			if(!upload_service.artwork_file.value) {
				console.warn("Artwork file is required!")
				return
			}

			/** If user is authenticated, will upload its artwork to S3*/
			if( is_authenticated.value ) {
				uploading_file.value = true
				// Upload the artwork file to S3 when artwork is provided.
				const { ok, message, filename } = await cart_api_service.sendToS3(upload_service.artwork_file.value)

				uploading_file.value = false

				if( !ok || !ok.value ) {
					console.warn(message)
					return false
				}

				uploaded_file.value = filename.value
			}
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
		saveItemLocally(item.value)

		// 🔥 Sending the new item to API
		if( is_authenticated.value ) {
			sendItemToServer(item.value)
		}

		return true
	}

	/**
	 * Preparing the item to be sent to API server
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
		const result = await cart_api_service.sendToServer([cart_payload])

		/** If API request successfully process, must update the item save locally to its created unique ID by API */
		if( result && result.length && result[0]) {
			cart_store.updateUploadedItem(item.local_identity, result[0].id)
			upload_service.clearArtwork()
		}
	}

	/** Save multiple unsave items */
	const sendUnsaveToServer = async () => {
		const unsave_i = cart_store.items.filter( e => !e.id )

		if( !unsave_i.length )
			return

		const cart_payload = unsave_i.map(item => {
			return {
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
		})

		/** Forward the prepared data to actual API request  */
		const result = await cart_api_service.sendToServer(cart_payload)

		/** If API request successfully process, must update the item save locally to its created unique ID by API */
		if( result && result.length) {
			for (let index = 0; index < result.length; index++) {
				const i = result[index];
				if( i )
					cart_store.updateItemInCart(i.local_identity, { id : i.id } )
			}
		}
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

	const updating_artwork = ref<boolean>(false)

	interface UploadingResponse {
		success: boolean
		message: string
		uploaded_file: string
	}

	// Submission of artwork changes
	const updateArtwork = async (
		file_name: string,
		file: File,
		instruction: string |'',
		local_identity: string,
	) => {

		const response = ref<UploadingResponse>({
			success: false,
			message: '',
			uploaded_file: ''
		})

		if( updating_artwork.value ) {
			response.value.message = 'Update still on process...'

			return response.value
		}

		try {
			if( !file_name )
				throw new Error("❌ File name is required!")

			if( !file )
				throw new Error("❌ Artwork File is required!")

			if( !local_identity )
				throw new Error("❌ Item local identity is required!")

			if( !cart_store.item_picking_artwork || !cart_store.item_picking_artwork.id ) {
				console.warn('❌ Item for artwork is not set.')
				return
			}

			updating_artwork.value = true

			// ⚠️ Uploading file
			const uploading_request = await cart_api_service.sendToS3(file)

			// ❌ File uploading failed
			if( !uploading_request.ok.value )
				throw new Error(uploading_request.message.value);

			response.value.uploaded_file = uploading_request.filename.value

			// ✅ Update the item locally
			cart_store.updateItemInCart(local_identity, {
				artwork_file : uploading_request.filename.value,
				artwork_file_name: file_name,
				instruction: instruction,
				file_path: 'artworks/',
			})

			// ✅ Update the item in our server
			cart_api_service.requestArtworkUpdate(cart_store.item_picking_artwork.id, file_name, uploading_request.filename.value, instruction)

			response.value.success = true
		}
		// ❌ Handles thrown error with proper response
		catch(error) {
			console.error(error)

			response.value.message = cart_api_service.extractThrownError(error)
		}
		// ✅ Completion of process
		finally {
			updating_artwork.value = false
		}

		return response.value
	}

	const updating_item = ref<boolean>(false)

	const updateItem = async (local_identity : string, updates: Partial<CartItem>) => {
		try {
			if( !local_identity || !updates || Object.keys(updates).length === 0) {
				console.warn('Invalid parameter provided.')
				updating_item.value = false
				return
			}

			updating_item.value = true

			const current_item = cart_store.items.find(e => e.local_identity == local_identity)

			if(!current_item) {
				console.warn('Invalid local identity.')
				updating_item.value = false
				return
			}

			// Data to be updated
			const width 		= updates.width 	?? current_item.width
			const height 		= updates.height 	?? current_item.height
			const quantity 		= updates.quantity 	?? current_item.quantity
			const font_id		= updates.font_id 	?? undefined
			const color_id 		= updates.color_id 	?? undefined
			// Check for pricing
			const pricing = await quote_api_service.getFeaturedPricing(current_item.url_slug, {
				width		: Number(width),
				height		: Number(height),
				color_id	: color_id,
				font_id		: color_id,
				quantity 	: quantity
			})
			if( !pricing ) {
				updating_item.value = false
				return
			}

			if( !pricing.prices || !pricing.prices.length ) {
				console.warn('No pricing available.')
				updating_item.value = false
				return
			}

			const update_cost = pricing.prices[0]?.price

			await cart_store.updateItemInCart(local_identity, {
				width: width,
				height: height,
				quantity: quantity,
				font_id: font_id,
				color_id: color_id,
				cost: Number(update_cost),
			})

			if( current_item.id ) {
				const update_request = await cart_api_service.requestItemUpdate(Number(current_item.id), width, height, quantity)
				updating_item.value = false
				return update_request
			}

			updating_item.value = false
			return true
		} catch(error) {
			console.error(error)
		} finally {
			updating_item.value = false
		}
	}

	return {
		// 🔥 Cart States
		...storeToRefs(cart_store),

		// 🔥 Local States
		caller,
		active_lettering_editor: attributes_store.active_lettering_editor,
		updating_artwork,
		updating_item,

		// 🔥 Methods
		requestItems,
		addItem,
		saveItemLocally,
		formatImage,
		generateLocalIdentity,
		toggleSelection,
		selectAllItem,
		calculateCartItems,
		populateItems,
		updateArtwork,
		updateItem,
		evaluateCart,
		sendUnsaveToServer,
		setDeletableItems	: cart_store.setDeletableItems,
		emptyDeletableItems	: cart_store.emptyDeletableItems,
		removeItems			: cart_store.removeItems,
		assignEditableItem	: cart_store.assignEditableItem,
		unsetEditableItem	: cart_store.unsetEditableItem,
		assignArtworkPicker	: cart_store.assignArtworkPicker,
		unsetArtworkPicker	: cart_store.unsetArtworkPicker,
		emptyCart			: cart_store.emptyCart,
		setItemQuantities 	: cart_store.setItemQuantities,
		updateItemInCart 	: cart_store.updateItemInCart,
	}
}