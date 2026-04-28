import { useCartService } from "~/services/core/cart/cart.service"
import { useQuoteApiService } from "~/services/core/quote/api.service"
import type { CartItem } from "~/types/cart/cart";
import type { QuantitySpec, PricingParameters, PricingResponse } from "~/types/products/attributes"

export const useCartPageItem = (caller : string) => {

	const { t : translate } = useI18n();

	const cart_service = useCartService('cart-page-item')

	const quote_api_service = useQuoteApiService()

	const setAllSelected = (v : boolean) => {
		cart_service.all_selected.value = v
	}

	const deleteSelectedItems = (local_identity: string | null = null) => {
		const deletable = ref<string[]>([])

		if( local_identity )
			deletable.value.push(local_identity)
		else
			deletable.value = cart_service.selected_ids.value

		cart_service.setDeletableItems(deletable.value)
	}

	const allowArtworkUpdate  = (url_slug : string) => {

		if( cart_service.active_lettering_editor.includes(url_slug) )
			return false

		return true
	}


	const allowVariantUpdate  = (url_slug : string) => {

		if( cart_service.active_lettering_editor.includes(url_slug) )
			return false

		return true
	}

	type SelectOption = {
		label: string;
		value: string | number;
		description?: string;
		style?: Record<string, string | number>;
	};

	const featured_pricing = ref<PricingResponse>()

	const product_variant_id = ref<number>()

	const featured_quantities = ref<SelectOption []>([])

	const selected_item = ref<CartItem>()

	const custom_qty_item_id = ref<string | null>(null)
	const custom_qty_draft = ref('')
	const custom_qty_dropdown_ref = ref<HTMLElement | null>(null)
	const custom_qty_input_ref = ref<HTMLInputElement | null>(null)
	const custom_qty_menu_open = ref(false)

	const default_custom_qty = {
		label: translate('cart.cartPreview.editModal.customQuantity'),
		value: -1
	}


	const mapQuantities = async (item : CartItem) => {
		selected_item.value = item
		featured_quantities.value = [
			{
				label: String(item.quantity),
				value: item.quantity
			},
			default_custom_qty
		]

		const prices = await getPricing(item.url_slug, item.local_identity, {
			width		: Number(item.width),
			height		: Number(item.height),
			color_id	: item.color_id ? Number(item.color_id) : undefined,
			font_id		: item.font_id ? Number(item.font_id) : undefined,
		})

		if( !prices || !prices.length )
			return

		makeQuantityOption(item.local_identity, item.quantity, prices)
	}

	const getPricing = async (url_slug : string, local_identity: string, pricing_parameters : PricingParameters) => {
		featured_pricing.value = await quote_api_service.getFeaturedPricing(url_slug, pricing_parameters)
		if( !featured_pricing || !featured_pricing.value )
			return


		product_variant_id.value = featured_pricing.value.product_variant_id

		return featured_pricing.value.prices;
	}

	/**
	 * Make options for quantities and set a default base on the current selected quantity
	 */
	const makeQuantityOption = async (local_identity: string, current_quantity: number, prices : QuantitySpec[]) => {
		if( !prices.length )
			return


		const mapped_new = prices.map(e => {
			return {
				label: String(e.nr),
				value: Number(e.nr)
			}
		})

		// Merge current and new
		const combined = [{ label: String(current_quantity), value: current_quantity } , ...mapped_new ]

		// Remove duplicates (by value) and Sort numerically
		const final_list = combined
			.filter((item, index, self) =>
				index === self.findIndex((t) => t.value === item.value)
			)
			.sort((a, b) => a.value - b.value);

		cart_service.setItemQuantities(local_identity, final_list)

	}

	const openCustomQtyMode = (local_identity: string) => {
		custom_qty_item_id.value = local_identity
		custom_qty_menu_open.value = false
		custom_qty_draft.value = ''
		nextTick(() => custom_qty_input_ref.value?.focus())
	}

	const commitQtySelection = (local_identity: string, next_qty: number) => {
		updateQuantity(local_identity, next_qty)
		custom_qty_item_id.value = null
		custom_qty_menu_open.value = false
		custom_qty_draft.value = ''
	}

	const handleQtyOptionSelect = (local_identity: string, value: string | number) => {
		const normalized_value = Number(value)
		if (normalized_value === -1) {
			openCustomQtyMode(local_identity)
			return
		}

		commitQtySelection(local_identity, normalized_value)
	}

	const updateQuantity = (local_identity: string, value : number) => {
		console.log(local_identity, value)
		const index = cart_service.items.value.findIndex(e => e.local_identity == local_identity)

		if( index === -1 )
			return

		cart_service.updateItemInCart(local_identity, { quantity: value })
		// Call API update here
	}


	const setCustomQtyDraft = (value: string) => {
		custom_qty_draft.value = value
	}

	const commitCustomQty = (item_id: string) => {
		const next_qty = Number(custom_qty_draft.value)
		if (!Number.isFinite(next_qty) || next_qty <= 0) {
			custom_qty_item_id.value = null
			custom_qty_menu_open.value = false
			custom_qty_draft.value = ''
			return
		}

		commitQtySelection(item_id, next_qty)
	}
	const toggleCustomQtyMenu = () => {
		custom_qty_menu_open.value = !custom_qty_menu_open.value
	}

	return {
		// 🔥 Store states
		items		: cart_service.items,
		selected_ids: cart_service.selected_ids,
		all_selected: cart_service.all_selected,
		item_quantities: cart_service.item_quantities,

		// 🔥 States
		caller,
		featured_quantities,
		custom_qty_item_id,
		custom_qty_draft,
		custom_qty_dropdown_ref,
		custom_qty_input_ref,
		custom_qty_menu_open,

		// 🔥 Methods
		mapQuantities,
		setAllSelected,
		deleteSelectedItems,
		allowArtworkUpdate,
		allowVariantUpdate,
		updateQuantity,
		openCustomQtyMode,
		commitQtySelection,
		handleQtyOptionSelect,
		setCustomQtyDraft,
		commitCustomQty,
		toggleCustomQtyMenu,
		formatImage			: cart_service.formatImage,
		toggleSelection 	: cart_service.toggleSelection,
		selectAllItem 		: cart_service.selectAllItem,
		assignEditableItem	: cart_service.assignEditableItem,
	}
}