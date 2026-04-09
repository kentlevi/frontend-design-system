import { useCartStore } from "~/stores/cart";
import type { CartItem, CartItemAPI, CartItemCreationSpec, ExpectedCartItemData, ResponseNumberSpec, SavedDraftResponse } from "~/types/cart/cart";
import type { FeaturedDataResponse } from "~/types/products/attributes";
import { resolveLetteringPaintSpec } from "~/utils/products/letteringPaint";
import { uploadFileToPresignedUrl } from "~/utils/file/presignedUrl";

export const useCartService = (caller: string = 'unknown') => {
	const { $api } = useNuxtApp();

	const config = useRuntimeConfig()

	const cart_store = useCartStore()

	const page = ref<number>(1)

	const per_page = ref<number>(10)

	const createLetteringPreviewDataUrl = (item: CartItem) => {
		const text = (item.lettering_text || '').trim()
		if (!text) return null

		const escaped_text = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')

		const paint_spec = resolveLetteringPaintSpec(item.color)
		const paint = paint_spec.kind === 'solid'
			? {
				fill: paint_spec.color,
				defs: '',
			}
			: {
				fill: 'url(#letteringGradient)',
				defs: `<linearGradient id="letteringGradient" x1="${paint_spec.type === 'diagonal' ? '0%' : '0%'}" y1="${paint_spec.type === 'diagonal' ? '0%' : '100%'}" x2="${paint_spec.type === 'diagonal' ? '100%' : '0%'}" y2="${paint_spec.type === 'diagonal' ? '100%' : '0%'}">${paint_spec.stops.map((stop) => `<stop offset="${Math.round(stop.offset * 100)}%" stop-color="${stop.color}"/>`).join('')}</linearGradient>`,
			}
		const font = item.font?.trim() || 'sans-serif'
		const svg = `
			<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
				<defs>${paint.defs}</defs>
				<rect width="144" height="144" rx="16" fill="#F7F7F8"/>
				<text
					x="72"
					y="78"
					text-anchor="middle"
					font-family="${font}"
					font-size="28"
					fill="${paint.fill}"
				>${escaped_text}</text>
			</svg>
		`.replace(/\s{2,}/g, ' ').trim()

		return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
	}

	const formatImage = (item: CartItem) => {
		const is_absolute_url = (value: string | null | undefined) =>
			Boolean(value && /^(https?:)?\/\//i.test(value))

		let f = is_absolute_url(item.product_thumbnail)
			? String(item.product_thumbnail)
			: `${config.public.file_url}${item.product_thumbnail}`

		if (item.lettering_text) {
			return item.artwork_preview || createLetteringPreviewDataUrl(item) || f
		}

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
		const { success, message, data} = await $api.get<ResponseNumberSpec>('cart/calculate')
		if( !success || !data ) {
			console.warn(message)
			return
		}

		syncNumber(data.total_count, data.total_cost)
	}

	const getCartItems = async (first_load : boolean = false) => {
		const should_show_preview_loading = first_load && cart_store.items.length === 0
		if (should_show_preview_loading) {
			cart_store.preview_loading = true
		}

		// calculate the numbers of cart items everytime request new data from database
		try {
			const [, cart_items] = await Promise.all([
				calculateCartItems(),
				requestCartItems(page.value, per_page.value),
			])
			if( !cart_items )
				return

			if( cart_items.length )
				populateItems(cart_items)
			else if( first_load && !cart_items.length && cart_store.number_of_items == 0 )
				empty()
		} finally {
			if (should_show_preview_loading) {
				cart_store.preview_loading = false
			}
		}
	}

	// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Requesting cart items from database
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


	// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Deleting specific cart in both local storage and database
	const requestDeletion = async (item_id: number | null, local_identity?: string | null) => {
		console.warn(`Deleting item ${item_id ?? local_identity}`)

		removeStateItem(item_id, local_identity ?? null)

		const {success, message} = await $api.post(`cart/${item_id}/delete`)

		if( !success )
			console.warn(message)

		return
	}

	const removeStateItem = (item_id: number | null, local_identity?: string | null) => {
		// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Removing item with the given item index
		if( item_id )
			cart_store.items = cart_store.items.filter(item => item.id != item_id)
		// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Removing the one matching the ID
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
		cart_store.saveItemLocally(item)
	}

	/**
	 * This will populate and arrange the items inside the  items state
	 */
	const populateItems = (cart_items: Partial<CartItem>[]) => {
		const mergeCartItem = (local_item: CartItem, incoming_item: Partial<CartItem>) => ({
			...local_item,
			...incoming_item,
			color: incoming_item.color ?? local_item.color ?? null,
			font: incoming_item.font ?? local_item.font ?? null,
			lettering_text: incoming_item.lettering_text ?? local_item.lettering_text ?? null,
			artwork_preview: incoming_item.artwork_preview ?? local_item.artwork_preview ?? null,
		})

		const incoming_by_local_identity = new Map(
			cart_items
				.filter((item) => item.local_identity)
				.map((item) => [item.local_identity as string, item])
		)

		const incoming_by_id = new Map(
			cart_items
				.filter((item) => item.id !== undefined && item.id !== null)
				.map((item) => [item.id as number, item])
		)

		/**
		 * Prevent duplication:
		 * - If a draft was just saved, its local_identity will now be in the server data.
		 */
		const incoming_local_identities = new Set(
			cart_items
				.map((item) => item.local_identity)
				.filter((identity): identity is string => Boolean(identity))
		)

		const consumed_server_keys = new Set<string>()
		const next_items: CartItem[] = []
		const unique_drafts: CartItem[] = []

		for (const current_item of cart_store.items) {
			const matching_incoming_item = current_item.local_identity && incoming_by_local_identity.has(current_item.local_identity)
				? incoming_by_local_identity.get(current_item.local_identity)
				: current_item.id !== null && incoming_by_id.has(current_item.id)
					? incoming_by_id.get(current_item.id)
					: null

			if (matching_incoming_item) {
				const server_key = matching_incoming_item.local_identity
					? `local:${matching_incoming_item.local_identity}`
					: matching_incoming_item.id !== undefined && matching_incoming_item.id !== null
						? `id:${matching_incoming_item.id}`
						: null

				if (server_key && !consumed_server_keys.has(server_key)) {
					next_items.push(mergeCartItem(current_item, matching_incoming_item))
					consumed_server_keys.add(server_key)
				}
				continue
			}

			if (current_item.local_identity && !incoming_local_identities.has(current_item.local_identity)) {
				unique_drafts.push(current_item)
				next_items.push(current_item)
			}
		}

		for (const incoming_item of cart_items) {
			const server_key = incoming_item.local_identity
				? `local:${incoming_item.local_identity}`
				: incoming_item.id !== undefined && incoming_item.id !== null
					? `id:${incoming_item.id}`
					: null

			if (server_key && consumed_server_keys.has(server_key)) continue

			next_items.push(incoming_item as CartItem)
			if (server_key) consumed_server_keys.add(server_key)
		}

		cart_store.unsave_draft = unique_drafts
		cart_store.items = next_items
	}


	const updateUploadedItem = (local_identity: string, new_id: number) => {
		cart_store.updateUploadedItem(local_identity, new_id)
	}

	const empty = () => {
		cart_store.empty()
	}

	const addNumber = () => {
		cart_store.addNumber()
	}

	const reduceNumber = () => {
		cart_store.reduceNumber()
	}

	const generateLocalIdentity = (): string => {
		return cart_store.generateLocalIdentity()
	}

	const selectItem = (item: CartItem) => {
		cart_store.selected_item = item
	}

	const setFeaturedData = (featured_data : FeaturedDataResponse | null) => {
		cart_store.featured_data = featured_data
	}

	const getCachedFeaturedData = (url_slug: string) => {
		return cart_store.featured_data_cache[url_slug] ?? null
	}

	const cacheFeaturedData = (url_slug: string, featured_data: FeaturedDataResponse) => {
		cart_store.featured_data_cache = {
			...cart_store.featured_data_cache,
			[url_slug]: featured_data,
		}
	}

	const setEditModalLoading = (value: boolean) => {
		cart_store.edit_modal_loading = value
	}

	const clearSelection = () => {
		cart_store.selected_item = null
		cart_store.featured_data = null
		cart_store.edit_modal_loading = false
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
		getCachedFeaturedData,
		cacheFeaturedData,
		setEditModalLoading,
		clearSelection,
	}

}