import { useCartService } from "~/services/cart/cart.service"
import { useCountry } from "~/composables/app/country/useCountry"
import { featuredProducts } from "~/data/products/featured"
import { CHECKOUT_SELECTION_STORAGE_KEY } from '~/data/cart/page'
import { homeProductTypePathById } from '~/data/products/homeTypes'
import { useUploadService } from '~/services/product/upload.service'
import type { CartRow } from '~/types/cart/cart'
import type { ProductItem } from '~/types/products/catalog'
import lottie from 'lottie-web'

export const useCartPreviewHandler = (_caller: string = 'unknown') => {
	const router = useRouter()
	const { t: translate } = useI18n()
	const { withCountry } = useCountry()
	const cart_service = useCartService()
	const upload_service = useUploadService()

	const open_deletion_modal = computed(() => Boolean(cart_service.deletion_id.value) || cart_service.deletion_ids.value.length > 0)
	const editing_item = computed(() => Boolean(cart_service.selected_item.value))

	const redirecting_to_cart = ref(false)
	const saving_inline_edit = ref(false)
	const redirect_loader_ref = ref<HTMLElement | null>(null)
	const CART_REDIRECT_DELAY_MS = 1000
	let redirect_loader_animation: ReturnType<typeof lottie.loadAnimation> | null = null

	const featured_items = ref<ProductItem[]>(featuredProducts.map(p => ({
		id: p.id,
		name: p.name,
		icon: p.icon,
		image: p.image,
		blurb: p.blurb,
	})))

	const is_all_items = computed(() => {
		const targetCount = cart_service.deletion_ids.value.length
		return targetCount > 1 && targetCount === cart_service.items.value.length
	})

	const is_multiple_items = computed(() => cart_service.deletion_ids.value.length > 1)

	const deletion_item = computed(() => {
		const targetId = cart_service.deletion_id.value;
		if (!targetId) return null;
		return cart_service.rows.value.find(row => row.id === String(targetId)) || null;
	});

	const deletion_title = computed(() => {
		if (is_all_items.value) return translate('cart.cartPage.removeAllTitle')
		if (is_multiple_items.value) return translate('cart.cartPage.deleteSelectedTitle', { count: cart_service.deletion_ids.value.length })
		if (deletion_item.value) return translate('cart.cartPage.deleteItemTitleWithName', { name: deletion_item.value.title })
		return translate('cart.cartPage.deleteItemTitle')
	})

	const deletion_description = computed(() => {
		if (is_all_items.value) return translate('cart.cartPage.removeAllDescription')
		if (is_multiple_items.value) return translate('cart.cartPage.deleteSelectedDescription', { count: cart_service.deletion_ids.value.length })
		if (deletion_item.value) return translate('cart.cartPage.deleteItemDescriptionWithName', { name: deletion_item.value.title })
		return translate('cart.cartPage.deleteItemDescription')
	})

	const deletion_confirm_label = computed(() => {
		if (is_all_items.value) return translate('cart.cartPage.removeAllConfirm')
		if (is_multiple_items.value) return translate('cart.cartPage.deleteSelectedConfirm', { count: cart_service.deletion_ids.value.length })
		return translate('cart.cartPage.removeConfirm')
	})

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value)
	}

	const composePreview = () => {
		cart_service.getCartItems(true)
	}

	const confirmDeleteItem = async () => {
		const targetId = cart_service.deletion_id.value
		const targetIds = cart_service.deletion_ids.value
		cart_service.setForDeleteItem(null)
		cart_service.setForDeleteItems([])
		if (targetId) {
			cart_service.requestDeletion(targetId)
		} else if (targetIds.length > 0) {
			cart_service.requestBulkDeletion(targetIds)
		}
	}

	const closeDeleteModal = () => {
		cart_service.setForDeleteItem(null)
		cart_service.setForDeleteItems([])
	}

	const destroyRedirectAnimation = () => {
		if (!redirect_loader_animation) return
		redirect_loader_animation.destroy()
		redirect_loader_animation = null
	}

	const mountRedirectAnimation = async () => {
		if (typeof window === 'undefined' || !redirect_loader_ref.value) return
		destroyRedirectAnimation()
		try {
			const response = await fetch('/animations/musticker-loader.json')
			if (!response.ok) return
			const animation_data = await response.json()
			redirect_loader_animation = lottie.loadAnimation({
				container: redirect_loader_ref.value,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				animationData: animation_data,
				rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
			})
		} catch (e) {
			console.error('Failed to load lottie animation', e)
		}
	}

	const goToCart = async (closeCb?: () => void) => {
		if (redirecting_to_cart.value) return
		redirecting_to_cart.value = true
		await nextTick()
		await mountRedirectAnimation()
		await new Promise((resolve) => setTimeout(resolve, CART_REDIRECT_DELAY_MS))
		await router.push(withCountry('/cart'))
		closeCb?.()
		destroyRedirectAnimation()
		redirecting_to_cart.value = false
	}

	const goToCheckout = async (closeCb?: () => void) => {
		if (redirecting_to_cart.value) return
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(
				CHECKOUT_SELECTION_STORAGE_KEY,
				JSON.stringify(cart_service.rows.value.map((item: CartRow) => item.id))
			)
		}
		closeCb?.()
		await router.push(withCountry('/checkout'))
	}

	const customizeFeaturedProduct = async (product_id: string, closeCb?: () => void) => {
		const target_path = homeProductTypePathById[product_id]
		if (!target_path) return
		closeCb?.()
		await router.push(withCountry(target_path))
	}

	return {
		...cart_service,
		items: cart_service.items,
		grand_total: cart_service.grand_total,
		loading: cart_service.loading,
		number_of_items: cart_service.number_of_items,
		formatImage: cart_service.formatImage,
		deletion_id: cart_service.deletion_id,
		deletion_ids: cart_service.deletion_ids,
		selected_item: cart_service.selected_item,

		is_open: computed({
			get: () => upload_service.is_preview_open.value,
			set: (val) => upload_service.is_preview_open.value = val
		}),
		open: () => upload_service.openPreview(),
		close: () => upload_service.closePreview(),

		open_deletion_modal,
		editing_item,
		deletionTitle: deletion_title,
		deletionDescription: deletion_description,
		deletionConfirmLabel: deletion_confirm_label,

		featured_items,
		redirecting_to_cart,
		saving_inline_edit,
		redirect_loader_ref,

		formatPrice,
		composePreview,
		confirmDeleteItem,
		closeDeleteModal,
		goToCart,
		goToCheckout,
		customizeFeaturedProduct,
		t,
	}
}