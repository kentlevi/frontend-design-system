import { computed, onMounted, ref } from 'vue';
import { quantityOptions } from '~/data/products/categoryExperience';
import { cartPaymentOptions } from '~/data/cart/page';
import {
	readStoredCartStateFromStorage,
	resolveStoredCartProduct,
	writeCheckoutSelectionIdsToStorage,
	writeStoredCartStateToStorage,
	type StoredCartState,
	type LocalizedCatalogProduct,
} from '~/helpers/cart/cartState.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import { formatCurrencyByCountry } from '~/utils/currency';
import { sizeDimOnly } from '~/utils/cart';

export type CartRow = {
	id: string;
	category: StoredCartState['category'];
	product: LocalizedCatalogProduct;
	sizeLabel: string;
	qty: number;
	total: number;
	artworkPreviewUrl: string;
};

export function useCartPage() {
	const { t } = useI18n();
	const { withCountry, country } = useCountry();
	const router = useRouter();

	const cartState = ref<StoredCartState[]>([]);
	const selectedIds = ref<string[]>([]);

	const rows = computed<CartRow[]>(() =>
		cartState.value
			.map((entry) => {
				const product = resolveStoredCartProduct(
					entry,
					(productId) => t(`product.items.${productId}.name`)
				);
				if (!product) return null;

				return {
					id: entry.id,
					category: entry.category,
					product,
					sizeLabel: t(`product.sizes.${entry.sizeKey}.label`),
					qty: entry.qty,
					total: entry.total,
					artworkPreviewUrl: entry.artworkPreviewUrl || '',
				};
			})
			.filter((item): item is CartRow => Boolean(item))
	);

	const allSelected = computed({
		get: () => rows.value.length > 0 && selectedIds.value.length === rows.value.length,
		set: (checked: boolean) => {
			selectedIds.value = checked ? rows.value.map((row) => row.id) : [];
		},
	});

	const selectedRows = computed(() =>
		rows.value.filter((row) => selectedIds.value.includes(row.id))
	);

	const selectedTotal = computed(() =>
		selectedRows.value.reduce((sum, row) => sum + row.total, 0)
	);

	const qtySelectOptions = computed(() =>
		quantityOptions.map((qty) => ({
			label: qty.toLocaleString(),
			value: qty,
		}))
	);

	function toggleRowSelection(itemId: string, checked: boolean) {
		if (checked) {
			if (!selectedIds.value.includes(itemId)) {
				selectedIds.value = [...selectedIds.value, itemId];
			}
			return;
		}
		selectedIds.value = selectedIds.value.filter((id) => id !== itemId);
	}

	function updateQty(itemId: string, nextQty: number) {
		const qty = Number(nextQty);
		if (!Number.isFinite(qty) || qty <= 0) return;

		cartState.value = cartState.value.map((item) => {
			if (item.id !== itemId) return item;
			const unitPrice = item.qty > 0 ? item.total / item.qty : 0;

			return {
				...item,
				qty,
				total: unitPrice * qty,
			};
		});

		writeStoredCartStateToStorage(cartState.value);
	}

	function removeByIds(ids: string[]) {
		if (!ids.length) return;
		cartState.value = cartState.value.filter((item) => !ids.includes(item.id));
		selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
		writeStoredCartStateToStorage(cartState.value);
	}

	function goToCheckout() {
		if (!selectedRows.value.length) return;
		writeCheckoutSelectionIdsToStorage(selectedRows.value.map((row) => row.id));
		void router.push(withCountry('/checkout'));
	}

	const continueShoppingPath = computed(() => withCountry('/'));

	onMounted(() => {
		cartState.value = readStoredCartStateFromStorage();
		selectedIds.value = cartState.value.map((item) => item.id);
	});

	return {
		rows,
		selectedIds,
		allSelected,
		selectedRows,
		selectedTotal,
		qtySelectOptions,
		paymentOptions: cartPaymentOptions,
		continueShoppingPath,
		toggleRowSelection,
		updateQty,
		removeByIds,
		goToCheckout,
		formatPrice: (value: number) =>
			formatCurrencyByCountry(value, country.value),
		sizeDimOnly,
	};
}