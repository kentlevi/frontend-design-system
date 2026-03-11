import { nextTick, onBeforeUnmount, ref, type Ref } from 'vue';
import lottie from 'lottie-web';
import { CHECKOUT_SELECTION_STORAGE_KEY } from '~/data/cart/page';
import { homeProductTypePathById } from '~/data/products/homeTypes';
import { useCountry } from '~/composables/app/country/useCountry';
import { sizeDimOnly } from '~/utils/cart';
import type {
	CartPreviewItem,
	CartPreviewSizeOptionModel,
} from '~/types/cart/preview';

export function useCartPreview(params: {
	cartItems: Ref<CartPreviewItem[]>;
	sizeOptionModels: Ref<CartPreviewSizeOptionModel[]>;
	quantityOptions: Ref<readonly number[]>;
	grandTotal: Ref<number>;
	closePreview: () => void;
	emitUpdateItem: (payload: { itemId: string; sizeKey: string; qty: number }) => void;
}) {
	const router = useRouter();
	const { withCountry } = useCountry();

	const editing_item_id = ref<string | null>(null);
	const draft_size_key = ref('');
	const draft_qty = ref(0);
	const redirecting_to_cart = ref(false);
	const redirect_loader_ref = ref<HTMLElement | null>(null);
	const CART_REDIRECT_DELAY_MS = 1000;
	let redirect_loader_animation: ReturnType<typeof lottie.loadAnimation> | null = null;

	function open_inline_edit(item: CartPreviewItem) {
		editing_item_id.value = item.id;
		draft_size_key.value = item.sizeKey;
		draft_qty.value = item.qty;
	}

	function cancel_inline_edit() {
		editing_item_id.value = null;
		draft_size_key.value = '';
		draft_qty.value = 0;
	}

	function save_inline_edit(item_id: string) {
		if (!draft_size_key.value || draft_qty.value <= 0) return;

		params.emitUpdateItem({
			itemId: item_id,
			sizeKey: draft_size_key.value,
			qty: draft_qty.value,
		});

		cancel_inline_edit();
	}

	function edited_item_total(item: CartPreviewItem) {
		if (editing_item_id.value !== item.id) return item.total;
		if (!Number.isFinite(draft_qty.value) || draft_qty.value <= 0 || item.qty <= 0) {
			return item.total;
		}

		const unit_price = item.total / item.qty;
		return unit_price * draft_qty.value;
	}

	function edited_grand_total() {
		if (!editing_item_id.value) return params.grandTotal.value;

		const editing_item = params.cartItems.value.find((item) => item.id === editing_item_id.value);
		if (!editing_item) return params.grandTotal.value;

		return params.grandTotal.value - editing_item.total + edited_item_total(editing_item);
	}

	function get_inline_size_options(item: CartPreviewItem) {
		if (params.sizeOptionModels.value.length === 0) {
			return [
				{
					label: sizeDimOnly(item.sizeLabel),
					value: item.sizeKey,
				},
			];
		}

		return params.sizeOptionModels.value.map((size) => ({
			label: sizeDimOnly(`${size.name} ${size.dim}`),
			value: size.key,
		}));
	}

	function get_inline_qty_options(item: CartPreviewItem) {
		if (params.quantityOptions.value.length === 0) {
			return [
				{
					label: item.qty.toLocaleString(),
					value: item.qty,
				},
			];
		}

		return params.quantityOptions.value.map((qty) => ({
			label: qty.toLocaleString(),
			value: qty,
		}));
	}

	function destroy_redirect_animation() {
		if (!redirect_loader_animation) return;
		redirect_loader_animation.destroy();
		redirect_loader_animation = null;
	}

	async function mount_redirect_animation() {
		if (typeof window === 'undefined' || !redirect_loader_ref.value) return;

		destroy_redirect_animation();
		const response = await fetch('/animations/musticker-loader.json');
		if (!response.ok) return;

		const animation_data = await response.json();
		redirect_loader_animation = lottie.loadAnimation({
			container: redirect_loader_ref.value,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			animationData: animation_data,
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid meet',
			},
		});
	}

	async function go_to_cart() {
		if (redirecting_to_cart.value) return;

		redirecting_to_cart.value = true;
		await nextTick();
		await mount_redirect_animation();
		await new Promise((resolve) => setTimeout(resolve, CART_REDIRECT_DELAY_MS));
		await router.push(withCountry('/cart'));
		params.closePreview();
		destroy_redirect_animation();
		redirecting_to_cart.value = false;
	}

	async function go_to_checkout() {
		if (redirecting_to_cart.value) return;

		if (typeof window !== 'undefined') {
			window.localStorage.setItem(
				CHECKOUT_SELECTION_STORAGE_KEY,
				JSON.stringify(params.cartItems.value.map((item) => item.id))
			);
		}

		params.closePreview();
		await router.push(withCountry('/checkout'));
	}

	async function customize_featured_product(product_id: string) {
		const target_path = homeProductTypePathById[product_id];
		if (!target_path) return;

		params.closePreview();
		await router.push(withCountry(target_path));
	}

	onBeforeUnmount(() => {
		destroy_redirect_animation();
	});

	return {
		editingItemId: editing_item_id,
		draftSizeKey: draft_size_key,
		draftQty: draft_qty,
		redirectingToCart: redirecting_to_cart,
		redirectLoaderRef: redirect_loader_ref,
		openInlineEdit: open_inline_edit,
		cancelInlineEdit: cancel_inline_edit,
		saveInlineEdit: save_inline_edit,
		editedItemTotal: edited_item_total,
		editedGrandTotal: edited_grand_total,
		getInlineSizeOptions: get_inline_size_options,
		getInlineQtyOptions: get_inline_qty_options,
		goToCart: go_to_cart,
		goToCheckout: go_to_checkout,
		customizeFeaturedProduct: customize_featured_product,
	};
}