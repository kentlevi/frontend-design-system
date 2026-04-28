import { useCartService } from "~/services/core/cart/cart.service"
import { useQuoteApiService } from "~/services/core/quote/api.service";
import { useUploadService } from '~/services/product/upload.service';
import type { CartItem } from "~/types/cart/cart";
import type { PricingResponse, FeaturedDataResponse, PricingParameters, SizeSpec, QuantitySpec } from "~/types/products/attributes";

export const useEditItemHandler = (caller : string) => {

	const { t : translate } = useI18n();

	const cart_service = useCartService('cart-edit-item-handler')

	const upload_service = useUploadService()

	const quote_api_service = useQuoteApiService()

	// use for artwork
	const selected_file = computed(() => upload_service.artwork_file.value)

	// use for artwork file preview
	const selected_file_preview = computed(() => upload_service.artwork_preview.value)

	const open_edit_modal = computed(() => Boolean(cart_service.editable_item.value) )

	const active_editable_item = computed(() => cart_service.editable_item.value)


	// use for closing the edit details modal
	const closeModal = () => {
		cart_service.unsetEditableItem()
	}

	// Submission of artwork changes
	const submitArtworkChanges = async (
		file_name: string,
		file: File,
		instruction: string |'',
	) => {

		if( !cart_service.item_picking_artwork.value ) {
			console.warn('Item for artwork was not set.')
			return
		}

		const process = await cart_service.updateArtwork(
			file_name,
			file,
			instruction,
			cart_service.item_picking_artwork.value?.local_identity
		)

		if( process && process.success )
			upload_service.clearArtwork()

		return process && process.success;
	}


	const featured_data = ref<FeaturedDataResponse>()

	const featured_pricing = ref<PricingResponse>()

	const product_variant_id = ref<number>()
	/**
	 * Get the featured data of a selected item from database
	 */
	const getFeaturedData = async (item : CartItem) => {
		if( !item )
			return

		const data_request = await quote_api_service.getFeaturedData(item.url_slug)
		if(!data_request)
			return

		featured_data.value = data_request

		makeSizesOption(featured_data.value.featured_sizes)

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

	type SelectOption = {
		label: string;
		value: string | number;
		description?: string;
		style?: Record<string, string | number>;
	}

	const sizes = ref<SelectOption []>([])

	const custom_width_input_ref = ref<HTMLInputElement | null>(null);

	const custom_width = ref<string>('')

	const custom_height = ref<string>('')

	const size_key = ref<string | number>('')

	/**
	 * Prepare all options for size and set a default value base on the current selected
	 */
	const makeSizesOption = (featured_sizes: SizeSpec[]) => {
		sizes.value = featured_sizes.map(e => {
			return {
				label: `${e.width}x${e.height} mm`,
				value: `${e.width}x${e.height}`
			}
		})

		sizes.value.push({
			label: translate('cart.cartPreview.editModal.customSize'),
			value: 'custom'
		})

		const temp_size_key = `${active_editable_item.value?.width}x${active_editable_item.value?.height}`

		updateSize(temp_size_key)
	}

	/**
	 * Update size event
	 */
	const updateSize = async (value : string | number) => {
		const normalized_value = String(value);

		size_key.value = normalized_value;
		if (normalized_value === 'custom') {
			nextTick(() => {
				custom_width_input_ref.value?.focus();
			});
			return;
		}

		const selected_option = sizes.value.find((item) => String(item.value) === normalized_value);
		const matched = selected_option?.label.match(/(\d+)\D+(\d+)/i);
		custom_width.value = matched?.[1] ?? '';
		custom_height.value = matched?.[2] ?? '';
	}

	const quantities = ref<SelectOption []>([])

	const quantity = ref<number>()

	const custom_quantity_ref = ref<HTMLInputElement | null>(null);

	const custom_quantity = ref<string>('')


	/**
	 * Make options for quantities and set a default base on the current selected quantity
	 */
	const makeQuantityOption = async (prices : QuantitySpec[]) => {
		if( !prices.length )
			return

		quantities.value = prices.map(e => {
			return {
				label: String(e.nr),
				value: Number(e.nr)
			}
		})

		quantities.value.push({
			label: translate('cart.cartPreview.editModal.customQuantity'),
			value: -1
		})

		updateQuantity(Number(active_editable_item.value?.quantity))
	}

	const updateQuantity = async (value : number) => {
		quantity.value = value
		console.log(quantity.value)
		if (value === -1) {
			nextTick(() => {
				custom_quantity_ref.value?.focus();
			});
			return;
		}
	}








	// ⚠️ Static & temporary
	const updateItemSize = () => {
		console.log(1)
	}
	const updateItemQty = () => {
		console.log(1)
	}

	const show_quantity = ref<boolean>(true)
	// ⚠️ Static & temporary
	return {
		// 🔥 States
		caller,
		show_quantity,
		sizes,
		selected_file,
		selected_file_preview,
		custom_width_input_ref,
		custom_width,
		custom_height,
		size_key,
		active_editable_item,
		quantities,
		quantity,
		custom_quantity_ref,
		custom_quantity,
		open_edit_modal : open_edit_modal,
		updating_artwork : cart_service.updating_artwork,

		// 🔥 Service Methods
		formatImage : cart_service.formatImage,


		// 🔥 Methods
		getFeaturedData,
		updateItemSize,
		updateItemQty,
		closeModal,
		submitArtworkChanges,
		updateSize,
		updateQuantity,
		setArtwork: upload_service.setArtwork,
		clearArtworkChanges : upload_service.clearArtwork,
	}
}