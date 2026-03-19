import { computed, onMounted, ref } from 'vue';
import { homeProductTypes } from '~/data/products/homeTypes';
import { productCatalog } from '~/data/products/catalog';
import { quantityOptions, sizeOptions } from '~/data/products/categoryExperience';
import { cartPaymentOptions } from '~/data/cart/page';
import { getProductSlugByCategory } from '~/helpers/products/productCategory.helper';
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
import type { ProductCategoryKey } from '~/types/products/catalog';

export type CartRow = {
	id: string;
	category: StoredCartState['category'];
	product: LocalizedCatalogProduct;
	sizeKey: string;
	sizeLabel: string;
	customSizeLabel: string;
	qty: number;
	total: number;
	artworkName: string;
	artworkSizeLabel: string;
	specialInstructions: string;
	artworkPreviewUrl: string;
};

export type CartEmptyProduct = {
	id: string;
	label: string;
	image: string;
	to: string;
};

export function useCartPage() {
	const { t } = useI18n();
	const { withCountry, country } = useCountry();
	const router = useRouter();

	function resolveCartSizeLabel(entry: Pick<StoredCartState, 'sizeKey' | 'customSizeLabel'>) {
		if (entry.customSizeLabel) return entry.customSizeLabel;
		if (entry.sizeKey === 'custom') return '';
		return t(`product.sizes.${entry.sizeKey}.label`);
	}

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
					sizeKey: entry.sizeKey,
					sizeLabel: resolveCartSizeLabel(entry),
					customSizeLabel: entry.customSizeLabel || '',
					qty: entry.qty,
					total: entry.total,
					artworkName: entry.artworkName,
					artworkSizeLabel: entry.artworkSizeLabel || '',
					specialInstructions: entry.specialInstructions || '',
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
	const featuredProductIds = homeProductTypes.map((item) => item.productId);
	const featuredProductIdSet = new Set(featuredProductIds);
	const featuredEmptyItems = computed<CartEmptyProduct[]>(() =>
		homeProductTypes
			.map((item) => {
				for (const category of Object.values(productCatalog)) {
					const product = category.products.find((entry) => entry.id === item.productId);
					if (!product) continue;

					return {
						id: product.id,
						label: t(`product.items.${product.id}.name`),
						image: item.image,
						to: withCountry(item.to),
					};
				}

				return null;
			})
			.filter((item): item is CartEmptyProduct => Boolean(item))
	);
	const discoverEmptyItems = computed<CartEmptyProduct[]>(() =>
		(Object.entries(productCatalog) as Array<[ProductCategoryKey, (typeof productCatalog)[ProductCategoryKey]]>)
			.flatMap(([categoryKey, category]) =>
				category.products.map((product) => ({
					id: product.id,
					label: t(`product.items.${product.id}.name`),
					image: product.image,
					to: withCountry(`/${categoryKey}/${getProductSlugByCategory(product.id, categoryKey)}`),
				}))
			)
			.filter((item) => !featuredProductIdSet.has(item.id))
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
	const sizeOptionModels = computed(() =>
		sizeOptions.map((size) => {
			const label = t(`product.sizes.${size}.label`);
			const [name, ...rest] = label.split(' ');

			return {
				key: size,
				name: name || '',
				dim: rest.join(' '),
			};
		})
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

	function updateItemArtworkDetails(
		itemId: string,
		payload: {
			artworkName: string;
			artworkSizeLabel: string;
			artworkPreviewUrl: string;
			specialInstructions: string;
		}
	) {
		cartState.value = cartState.value.map((item) => (
			item.id !== itemId
				? item
				: {
					...item,
					artworkName: payload.artworkName,
					artworkSizeLabel: payload.artworkSizeLabel,
					artworkPreviewUrl: payload.artworkPreviewUrl,
					specialInstructions: payload.specialInstructions,
				}
		));

		writeStoredCartStateToStorage(cartState.value);
	}

	function updateSize(itemId: string, nextSizeKey: string, customSizeLabel = '') {
		const normalizedSizeKey = sizeOptions.includes(
			nextSizeKey as (typeof sizeOptions)[number]
		)
			? nextSizeKey
			: 'custom';

		cartState.value = cartState.value.map((item) => {
			if (item.id !== itemId) return item;

			return {
				...item,
				sizeKey: normalizedSizeKey,
				customSizeLabel: normalizedSizeKey === 'custom' ? customSizeLabel : '',
			};
		});

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
		featuredEmptyItems,
		discoverEmptyItems,
		selectedTotal,
		sizeOptionModels,
		qtySelectOptions,
		paymentOptions: cartPaymentOptions,
		continueShoppingPath,
		toggleRowSelection,
		updateQty,
		updateSize,
		updateItemArtworkDetails,
		removeByIds,
		goToCheckout,
		formatPrice: (value: number) =>
			formatCurrencyByCountry(value, country.value),
		sizeDimOnly,
	};
}