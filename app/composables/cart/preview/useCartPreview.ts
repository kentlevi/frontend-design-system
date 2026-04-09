import { nextTick, onBeforeUnmount, ref } from 'vue';
import lottie from 'lottie-web';
import { CHECKOUT_SELECTION_STORAGE_KEY } from '~/data/cart/page';
import { homeProductTypePathById } from '~/data/products/homeTypes';
import { useCountry } from '~/composables/app/country/useCountry';
import type { ProductItem } from '~/types/products/catalog';
import { useCartStore } from '~/stores/cart/cart.store';

export function useCartPreview(params: {
	closePreview: () => void;
}) {
	const router = useRouter();
	const { withCountry } = useCountry();
	const featured_items = ref<ProductItem[]>([
		{ id: 'hologram-sticker', name: 'Hologram Sticker', icon: 'strong-star', image: '/illustrations/products/stickers/hologram.svg', blurb: 'Premium holographic finish.' },
		{ id: 'clear-sticker', name: 'Clear Sticker', icon: 'strong-stars', image: '/illustrations/products/stickers/clear.svg', blurb: 'Transparent vinyl stickers.' }
	]);
	const redirecting_to_cart = ref(false);
	const saving_inline_edit = ref(false);
	const redirect_loader_ref = ref<HTMLElement | null>(null);
	const CART_REDIRECT_DELAY_MS = 1000;
	let redirect_loader_animation: ReturnType<typeof lottie.loadAnimation> | null = null;
	const cart_store = useCartStore();

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
				JSON.stringify(cart_store.items.map((item) => item.id))
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
		featuredItems: featured_items,
		redirectingToCart: redirecting_to_cart,
		savingInlineEdit: saving_inline_edit,
		redirectLoaderRef: redirect_loader_ref,
		goToCart,
		goToCheckout,
		customizeFeaturedProduct,
	};
}