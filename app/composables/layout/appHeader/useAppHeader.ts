import { computed, defineAsyncComponent, inject, onBeforeUnmount, onMounted, provide, ref, watch, type InjectionKey } from 'vue'
import { useAppHeaderAccount } from '~/composables/layout/appHeader/useAppHeaderAccount'
import { useAppHeaderCartPreview } from '~/composables/layout/appHeader/useAppHeaderCartPreview'
import { useAppHeaderKeyboardShortcuts } from '~/composables/layout/appHeader/useAppHeaderKeyboardShortcuts'
import { useCartService as useCartCoreService } from '~/services/core/cart/cart.service'

export function useAppHeader() {
	const route = useRoute()
	const cart_core_service = useCartCoreService('app-header')

	const {
		account_open,
		account_menu_ref,
		locale_modal_open,
		nav_links,
		selected_locale,
		locale_options,
		account_links,
		header_account_ready,
		header_account_skeleton_count,
		is_mock_logged_in,
		is_guest_logged_in,
		display_email,
		account_transition_name,
		isNavLinkActive,
		toggleAccountMenu,
		closeAccountMenu,
		onAccountMouseEnter,
		onAccountMouseLeave,
		openLocaleModal: openLocaleModalBase,
		closeLocaleModal,
		selectLocale,
		logoutMock,
	} = useAppHeaderAccount()
	const search_modal_open = ref(false)
	const {
		cart_preview_open,
		openCartPreview: openCartPreviewBase,
		closeCartPreview,
	} = useAppHeaderCartPreview({
		closeAccountMenu,
		closeLocaleModal,
		closeSearchModal,
	})

	const AppHeaderLocaleModal = defineAsyncComponent(
		() => import('~/components/layout/app-header/AppHeaderLocaleModal.vue')
	)
	const CartPreview = defineAsyncComponent(
		() => import('~/components/cart/preview/CartPreview.vue')
	)

	let body_overflow_before_cart_lock = ''
	let cart_body_scroll_locked = false
	let idle_prefetch_timer: ReturnType<typeof setTimeout> | null = null
	let idle_prefetch_handle: number | null = null
	const cart_preview_rendered = ref(false)
	const prefetched_header_overlays = ref(false)

	const simple = computed(() => route.meta.isSimpleHeader === true)
	const should_lock_body_scroll = computed(
		() => cart_preview_open.value || search_modal_open.value
	)
	const cart_badge_count = computed(() => cart_core_service.number_of_items.value)

	async function prefetchHeaderOverlayModules() {
		if (prefetched_header_overlays.value) return

		prefetched_header_overlays.value = true
		await Promise.allSettled([
			import('~/components/layout/app-header/AppHeaderLocaleModal.vue'),
			import('~/components/cart/preview/CartPreview.vue'),
		])
	}

	function setAccountMenuRef(el: HTMLElement | null) {
		account_menu_ref.value = el
	}

	function openLocaleModal() {
		void prefetchHeaderOverlayModules()
		closeSearchModal()
		closeCartPreview()
		openLocaleModalBase()
	}

	function closeSearchModal() {
		search_modal_open.value = false
	}

	function openSearchModal() {
		void prefetchHeaderOverlayModules()
		closeAccountMenu()
		closeLocaleModal()
		closeCartPreview()
		search_modal_open.value = true
	}

	function openCartPreview() {
		void prefetchHeaderOverlayModules()
		cart_preview_rendered.value = true
		openCartPreviewBase()
	}

	function setCartBodyScrollLock(locked: boolean) {
		if (typeof document === 'undefined') return

		if (locked) {
			if (cart_body_scroll_locked) return
			body_overflow_before_cart_lock = document.body.style.overflow
			document.body.style.overflow = 'hidden'
			cart_body_scroll_locked = true
			return
		}

		if (!cart_body_scroll_locked) return
		document.body.style.overflow = body_overflow_before_cart_lock
		cart_body_scroll_locked = false
	}

	useAppHeaderKeyboardShortcuts({
		handleSearchKeydown: () => false,
		isSearchModalOpen: () => search_modal_open.value,
		isLocaleModalOpen: () => locale_modal_open.value,
		closeSearchModal,
		closeLocaleModal,
		closeAccountMenu,
		openSearchModal,
	})

	onMounted(() => {
		cart_core_service.calculateCartItems()

		if (typeof window === 'undefined') return

		if ('requestIdleCallback' in window) {
			idle_prefetch_handle = window.requestIdleCallback(() => {
				void prefetchHeaderOverlayModules()
			})
			return
		}

		idle_prefetch_timer = setTimeout(() => {
			void prefetchHeaderOverlayModules()
		}, 1200)
	})

	watch(should_lock_body_scroll, (should_lock) => {
		setCartBodyScrollLock(should_lock)
	})

	watch(cart_preview_open, (is_open) => {
		if (is_open) {
			cart_preview_rendered.value = true
			void prefetchHeaderOverlayModules()
		}
	})

	watch(
		() => route.fullPath,
		() => {
			closeSearchModal()
		}
	)

	onBeforeUnmount(() => {
		if (typeof window === 'undefined') return

		if (idle_prefetch_handle !== null && 'cancelIdleCallback' in window) {
			window.cancelIdleCallback(idle_prefetch_handle)
		}

		if (idle_prefetch_timer) {
			clearTimeout(idle_prefetch_timer)
		}

		setCartBodyScrollLock(false)
	})

	return {
		AppHeaderLocaleModal,
		CartPreview,
		simple,
		nav_links,
		selected_locale,
		account_open,
		is_mock_logged_in,
		is_guest_logged_in,
		header_loading: computed(() => !header_account_ready.value),
		header_account_skeleton_count,
		display_email,
		account_transition_name,
		account_links,
		cart_badge_count,
		locale_modal_open,
		locale_options,
		search_modal_open,
		cart_preview_rendered,
		isNavLinkActive,
		setAccountMenuRef,
		prefetchHeaderOverlayModules,
		openLocaleModal,
		openSearchModal,
		openCartPreview,
		toggleAccountMenu,
		closeAccountMenu,
		onAccountMouseEnter,
		onAccountMouseLeave,
		logoutMock,
		closeLocaleModal,
		selectLocale,
		closeSearchModal,
	}
}

const AppHeaderKey: InjectionKey<ReturnType<typeof useAppHeader>> = Symbol('AppHeader')

export function provideAppHeader() {
	const app_header = useAppHeader()
	provide(AppHeaderKey, app_header)
	return app_header
}

export function useAppHeaderContext() {
	const app_header = inject(AppHeaderKey)

	if (!app_header) {
		throw new Error('useAppHeaderContext must be used within provideAppHeader')
	}

	return app_header
}