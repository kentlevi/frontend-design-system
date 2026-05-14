import type { ComponentPublicInstance } from 'vue'
import { useCartService } from '~/services/cart/cart.service'

type QtyOption = {
	label: string
	value: string | number
}

export const useCartPageList = () => {
	const { t: translate } = useI18n()
	const cart_service = useCartService('cart-page-list')

	const custom_qty_item_id = ref<string | null>(null)
	const custom_qty_draft = ref('')
	const custom_qty_dropdown_ref = ref<HTMLElement | null>(null)
	const custom_qty_input_ref = ref<HTMLInputElement | null>(null)
	const custom_qty_menu_open = ref(false)

	const qty_select_options = [10, 25, 50, 100].map((value): QtyOption => ({
		label: String(value),
		value,
	}))

	const sizeDimOnly = (label: string) => label.replace(/"$/, '').trim()

	const getArtworkActionLabel = (has_artwork: boolean) =>
		has_artwork ? translate('cart.cartPage.changeArtwork') : translate('cart.cartPage.addArtwork')

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value)
	}

	const bindCustomQtyDropdownRef = (element: Element | ComponentPublicInstance | null) => {
		const resolved = element && '$el' in element
			? (element.$el as Element | null)
			: (element as Element | null)
		custom_qty_dropdown_ref.value = resolved instanceof HTMLElement ? resolved : null
	}

	const bindCustomQtyInputRef = (element: Element | ComponentPublicInstance | null) => {
		const resolved = element && '$el' in element
			? (element.$el as Element | null)
			: (element as Element | null)
		custom_qty_input_ref.value = resolved instanceof HTMLInputElement ? resolved : null
	}

	const openDeleteModal = (ids: string[]) => {
		cart_service.setForDeleteItems(ids)
	}

	const openEditSize = (item_id: string) => {
		cart_service.openEditSizeModal(item_id)
	}

	const openCustomQtyMode = (item_id: string) => {
		custom_qty_item_id.value = item_id
		custom_qty_menu_open.value = false
		custom_qty_draft.value = ''
		nextTick(() => custom_qty_input_ref.value?.focus())
	}

	const commitQtySelection = (item_id: string, next_qty: number) => {
		cart_service.updateItemQty(item_id, next_qty)
		custom_qty_item_id.value = null
		custom_qty_menu_open.value = false
		custom_qty_draft.value = ''
	}

	const handleQtyOptionSelect = (item_id: string, value: string | number) => {
		const normalized_value = Number(value)
		if (normalized_value === -1) {
			openCustomQtyMode(item_id)
			return
		}

		commitQtySelection(item_id, normalized_value)
	}

	const commitCustomQty = (item_id: string) => {
		const next_qty = Number(custom_qty_draft.value)
		if (!Number.isFinite(next_qty) || next_qty <= 0) {
			custom_qty_item_id.value = null
			custom_qty_menu_open.value = false
			custom_qty_draft.value = ''
			return
		}

		commitQtySelection(item_id, next_qty)
	}

	const toggleCustomQtyMenu = () => {
		custom_qty_menu_open.value = !custom_qty_menu_open.value
	}

	const setCustomQtyDraft = (value: string) => {
		custom_qty_draft.value = value
	}

	const preventNonDigitInput = (event: InputEvent) => {
		if (event.data && !/^\d+$/.test(event.data)) event.preventDefault()
	}

	const handleCustomQtyOutsidePress = (event: PointerEvent) => {
		if (
			custom_qty_dropdown_ref.value
			&& !custom_qty_dropdown_ref.value.contains(event.target as Node)
		) {
			custom_qty_item_id.value = null
			custom_qty_menu_open.value = false
		}
	}

	onMounted(() => {
		window.addEventListener('pointerdown', handleCustomQtyOutsidePress, true)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('pointerdown', handleCustomQtyOutsidePress, true)
	})

	return {
		rows: cart_service.rows,
		selected_ids: cart_service.selected_ids,
		all_selected: cart_service.all_selected,
		custom_qty_item_id,
		custom_qty_draft,
		custom_qty_menu_open,
		qty_select_options,
		sizeDimOnly,
		getArtworkActionLabel,
		formatPrice,
		bindCustomQtyDropdownRef,
		bindCustomQtyInputRef,
		openDeleteModal,
		openEditSize,
		handleQtyOptionSelect,
		commitCustomQty,
		toggleCustomQtyMenu,
		setCustomQtyDraft,
		preventNonDigitInput,
		toggleSelection: cart_service.toggleSelection,
		setAllSelected: (checked: boolean) => {
			cart_service.all_selected.value = checked
		},
	}
}