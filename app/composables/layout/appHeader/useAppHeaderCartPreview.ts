import { computed } from 'vue';
import { normalizeAppPath } from '~/utils/auth/redirect';
import { useCountry } from '~/composables/app/country/useCountry';
import { useUploadService } from '~/services/product/upload.service';

export function useAppHeaderCartPreview(params: {
	closeAccountMenu: () => void;
	closeLocaleModal: () => void;
	closeSearchModal: () => void;
}) {
	const route = useRoute();
	const { withCountry } = useCountry();
	const upload_service = useUploadService();

	const cart_preview_open = computed({
		get: () => upload_service.is_preview_open.value,
		set: (val) => upload_service.is_preview_open.value = val
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
		upload_service.openPreview();
	}

	function closeCartPreview() {
		upload_service.closePreview();
	}

	return {
		cart_preview_open,
		openCartPreview,
		closeCartPreview,
	};
}