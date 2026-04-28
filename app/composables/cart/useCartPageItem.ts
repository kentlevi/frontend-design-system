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

	const default_custom_qty = {
		label: translate('cart.cartPreview.editModal.customQuantity'),
		value: -1
	}

	const item_quantities = ref<Record<string, SelectOption[]>>({})

	const getTemporaryOption = (local_identity: string, quantity: number) => {
		item_quantities.value[local_identity] = [
			{
				label: String(quantity),
				value: quantity
			},
			default_custom_qty
		]

		return item_quantities.value[local_identity]
	}

	const showQuantities = async (item : CartItem) => {
		selected_item.value = item
		featured_quantities.value = [
			{
				label: String(item.quantity),
				value: item.quantity
			},
			default_custom_qty
		]

		await getPricing(item.url_slug, {
			width		: Number(item.width),
			height		: Number(item.height),
			color_id	: item.color_id ? Number(item.color_id) : undefined,
			font_id		: item.font_id ? Number(item.font_id) : undefined,
		})
	}

	const getPricing = async (url_slug : string, pricing_parameters : PricingParameters) => {
		featured_pricing.value = await quote_api_service.getFeaturedPricing(url_slug, pricing_parameters)
		if( !featured_pricing || !featured_pricing.value )
			return


		product_variant_id.value = featured_pricing.value.product_variant_id

		makeQuantityOption(featured_pricing.value.prices)
	}

	/**
	 * Make options for quantities and set a default base on the current selected quantity
	 */
	const makeQuantityOption = async (prices : QuantitySpec[]) => {
		if( !prices.length )
			return

		featured_quantities.value = prices.map(e => {
			return {
				label: String(e.nr),
				value: Number(e.nr)
			}
		})

		featured_quantities.value.push(default_custom_qty)

		updateQuantity(Number(selected_item.value?.quantity))
	}

	const updateQuantity = (value : number) => {
		console.log(value)
	}

	return {
		// 🔥 Store states
		items		: cart_service.items,
		selected_ids: cart_service.selected_ids,
		all_selected: cart_service.all_selected,

		// 🔥 States
		caller,
		featured_quantities,

		// 🔥 Methods
		showQuantities,
		setAllSelected,
		deleteSelectedItems,
		allowArtworkUpdate,
		allowVariantUpdate,
		getTemporaryOption,
		formatImage			: cart_service.formatImage,
		toggleSelection 	: cart_service.toggleSelection,
		selectAllItem 		: cart_service.selectAllItem,
		assignEditableItem	: cart_service.assignEditableItem,
	}
}