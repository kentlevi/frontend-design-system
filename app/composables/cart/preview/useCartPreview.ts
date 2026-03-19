import { computed, nextTick, onBeforeUnmount, ref, type Ref } from 'vue';
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
	emitUpdateItem: (payload: { itemId: string; sizeKey: string; qty: number; customSizeLabel?: string }) => void;
}) {
	const router = useRouter();
	const { t } = useI18n();
	const { withCountry } = useCountry();
	const toast_store = useToastStore();

	const editing_item_id = ref<string | null>(null);
	const draft_size_key = ref('');
	const draft_custom_size_width = ref('');
	const draft_custom_size_height = ref('');
	const draft_qty = ref(0);
	const draft_custom_qty = ref('');
	const redirecting_to_cart = ref(false);
	const saving_inline_edit = ref(false);
	const redirect_loader_ref = ref<HTMLElement | null>(null);
	const CART_REDIRECT_DELAY_MS = 1000;
	const CART_EDIT_SAVE_DELAY_MS = 900;
	let redirect_loader_animation: ReturnType<typeof lottie.loadAnimation> | null = null;

	const editing_item = computed(() =>
		params.cartItems.value.find((item) => item.id === editing_item_id.value) ?? null
	);

	function showCartItemUpdatedToast() {
		toast_store.showToastWithTimer({
			message: t('cart.cartPage.itemUpdated'),
			tone: 'primary',
			dismissible: true,
			variant: 'default',
		}, 3000);
	}

	function formatSizeOptionLabel(label: string) {
		const matched = sizeDimOnly(label).match(/(\d+)\s*(?:x|\u00d7)\s*(\d+)/i);
		if (!matched) return sizeDimOnly(label);
		return `${matched[1]}×${matched[2]}mm`;
	}

	function openInlineEdit(item: CartPreviewItem) {
		editing_item_id.value = item.id;
		draft_size_key.value = params.sizeOptionModels.value.some((size) => size.key === item.sizeKey) ? item.sizeKey : 'custom';
		const has_preset_qty = params.quantityOptions.value.includes(item.qty);
		draft_qty.value = has_preset_qty ? item.qty : -1;
		draft_custom_qty.value = has_preset_qty ? '' : String(item.qty);
		const matched = sizeDimOnly(item.customSizeLabel || item.sizeLabel).match(/(\d+)\s*(?:x|\u00d7)\s*(\d+)/i);
		draft_custom_size_width.value = matched?.[1] ?? '';
		draft_custom_size_height.value = matched?.[2] ?? '';
	}

	function cancelInlineEdit() {
		editing_item_id.value = null;
		draft_size_key.value = '';
		draft_custom_size_width.value = '';
		draft_custom_size_height.value = '';
		draft_qty.value = 0;
		draft_custom_qty.value = '';
	}

	async function saveInlineEdit(item_id: string) {
		const is_custom_size = draft_size_key.value === 'custom';
		const width = Number(draft_custom_size_width.value);
		const height = Number(draft_custom_size_height.value);
		const qty = draft_custom_qty.value ? Number(draft_custom_qty.value) : draft_qty.value;
		const next_size_key = draft_size_key.value;
		const next_custom_size_label = is_custom_size ? `${width}x${height}mm` : '';
		if (!draft_size_key.value || !Number.isFinite(qty) || qty <= 0) return;
		if (is_custom_size && (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0)) return;
		if (saving_inline_edit.value) return;

		saving_inline_edit.value = true;
		cancelInlineEdit();
		await nextTick();
		await mountRedirectAnimation();
		await new Promise((resolve) => setTimeout(resolve, CART_EDIT_SAVE_DELAY_MS));

		params.emitUpdateItem({
			itemId: item_id,
			sizeKey: next_size_key,
			qty,
			customSizeLabel: next_custom_size_label,
		});
		saving_inline_edit.value = false;
		destroyRedirectAnimation();
		showCartItemUpdatedToast();
	}

	function editedItemTotal(item: CartPreviewItem) {
		return item.total;
	}

	function editedGrandTotal() {
		return params.grandTotal.value;
	}

	function getInlineSizeOptions(item: CartPreviewItem) {
		if (params.sizeOptionModels.value.length === 0) {
			return [
				{
					label: formatSizeOptionLabel(item.sizeLabel),
					value: item.sizeKey,
				},
				{
					label: t('cart.cartPreview.editModal.customSize'),
					value: 'custom',
				},
			];
		}

		return [
			...params.sizeOptionModels.value.map((size) => ({
				label: formatSizeOptionLabel(`${size.name} ${size.dim}`),
				value: size.key,
			})),
			{
				label: t('cart.cartPreview.editModal.customSize'),
				value: 'custom',
			},
		];
	}

	function getInlineQtyOptions(item: CartPreviewItem) {
		if (params.quantityOptions.value.length === 0) {
			return [
				{
					label: item.qty.toLocaleString(),
					value: item.qty,
				},
				{
					label: t('cart.cartPreview.editModal.customQuantity'),
					value: -1,
				},
			];
		}

		return [
			...params.quantityOptions.value.map((qty) => ({
				label: qty.toLocaleString(),
				value: qty,
			})),
			{
				label: t('cart.cartPreview.editModal.customQuantity'),
				value: -1,
			},
		];
	}

	function destroyRedirectAnimation() {
		if (!redirect_loader_animation) return;
		redirect_loader_animation.destroy();
		redirect_loader_animation = null;
	}

	async function mountRedirectAnimation() {
		if (typeof window === 'undefined' || !redirect_loader_ref.value) return;

		destroyRedirectAnimation();
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

	async function goToCart() {
		if (redirecting_to_cart.value) return;

		redirecting_to_cart.value = true;
		await nextTick();
		await mountRedirectAnimation();
		await new Promise((resolve) => setTimeout(resolve, CART_REDIRECT_DELAY_MS));
		await router.push(withCountry('/cart'));
		params.closePreview();
		destroyRedirectAnimation();
		redirecting_to_cart.value = false;
	}

	async function goToCheckout() {
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

	async function customizeFeaturedProduct(product_id: string) {
		const target_path = homeProductTypePathById[product_id];
		if (!target_path) return;

		params.closePreview();
		await router.push(withCountry(target_path));
	}

	onBeforeUnmount(() => {
		destroyRedirectAnimation();
	});

	return {
		editingItemId: editing_item_id,
		editingItem: editing_item,
		draftSizeKey: draft_size_key,
		draftCustomSizeWidth: draft_custom_size_width,
		draftCustomSizeHeight: draft_custom_size_height,
		draftQty: draft_qty,
		draftCustomQty: draft_custom_qty,
		redirectingToCart: redirecting_to_cart,
		savingInlineEdit: saving_inline_edit,
		redirectLoaderRef: redirect_loader_ref,
		openInlineEdit: openInlineEdit,
		cancelInlineEdit: cancelInlineEdit,
		saveInlineEdit: saveInlineEdit,
		editedItemTotal: editedItemTotal,
		editedGrandTotal: editedGrandTotal,
		getInlineSizeOptions: getInlineSizeOptions,
		getInlineQtyOptions: getInlineQtyOptions,
		goToCart: goToCart,
		goToCheckout: goToCheckout,
		customizeFeaturedProduct: customizeFeaturedProduct,
	};
}