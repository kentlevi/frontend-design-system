import { computed, ref } from 'vue';
import { normalizeAppPath } from '~/utils/auth/redirect';
import { useCountry } from '~/composables/app/country/useCountry';
import { useCartPreview } from '~/composables/cart/preview/useCartPreview';

export function useAppHeaderCartPreview(params: {
	closeAccountMenu: () => void;
	closeLocaleModal: () => void;
	closeSearchModal: () => void;
}) {
	const route = useRoute();
	const { withCountry } = useCountry();

	const cart_preview_open = ref(false);

	const { itemCount: cart_item_count } = useCartPreview({
		closePreview: () => {
			cart_preview_open.value = false;
		}
	});

	const is_cart_page = computed(
		() => normalizeAppPath(route.path) === normalizeAppPath(withCountry('/cart'))
	);

	function openCartPreview() {
		if (is_cart_page.value) {
			if (typeof window !== 'undefined') {
				window.location.assign(withCountry('/cart'));
			}
			return;
		}

		params.closeAccountMenu();
		params.closeLocaleModal();
		params.closeSearchModal();
		cart_preview_open.value = true;
	}

	function closeCartPreview() {
		cart_preview_open.value = false;
	}

	return {
		cart_preview_open,
		cart_item_count,
		openCartPreview: openCartPreview,
		closeCartPreview: closeCartPreview,
	};
}