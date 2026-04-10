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
	const { t } = useI18n()
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

	const isAllItems = computed(() => {
		const targetCount = cart_service.deletion_ids.value.length
		return targetCount > 1 && targetCount === cart_service.items.value.length
	})

	const isMultipleItems = computed(() => cart_service.deletion_ids.value.length > 1)

	const deletionTitle = computed(() => {
		if (isAllItems.value) return t('cart.cartPage.removeAllTitle')
		if (isMultipleItems.value) return t('cart.cartPage.deleteSelectedTitle', { count: cart_service.deletion_ids.value.length })
		return t('cart.cartPage.deleteItemTitle')
	})

	const deletionDescription = computed(() => {
		if (isAllItems.value) return t('cart.cartPage.removeAllDescription')
		if (isMultipleItems.value) return t('cart.cartPage.deleteSelectedDescription', { count: cart_service.deletion_ids.value.length })
		return t('cart.cartPage.deleteItemDescription')
	})

	const deletionConfirmLabel = computed(() => {
		if (isAllItems.value) return t('cart.cartPage.removeAllConfirm')
		if (isMultipleItems.value) return t('cart.cartPage.deleteSelectedConfirm', { count: cart_service.deletion_ids.value.length })
		return t('cart.cartPage.removeConfirm')
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
		deletionTitle,
		deletionDescription,
		deletionConfirmLabel,

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