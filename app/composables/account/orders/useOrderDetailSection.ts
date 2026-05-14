import { computed, onBeforeUnmount, ref, type Ref } from 'vue'
import type { AccountOrder, AccountOrderLineItem } from '~/types/account/orders'
import { useCountry } from '~/composables/app/country/useCountry'
import { useOrdersService } from '~/services/account/orders.service'

export const useOrderDetailSection = (order: Ref<AccountOrder>) => {
	const { t: translate } = useI18n()
	const { withCountry } = useCountry()
	const orders_service = useOrdersService()
	const upload_toast_visible = ref(false)
	const upload_toast_message = ref('')
	let upload_toast_timeout: ReturnType<typeof setTimeout> | null = null

	const action_icon_map = {
		invoice: 'regular-file-dollar',
		paymentProof: 'regular-dollar-sign',
		message: 'regular-message',
	} as const

	const summary_totals = computed(() => [
		{ key: 'subtotal', value: order.value.totals.subtotalLabel },
		{
			key: 'shippingFee',
			value: order.value.totals.shippingFeeLabel,
			params: { method: translate('account.orders.shippingMethod') },
		},
		{ key: 'discounts', value: order.value.totals.discountsLabel, className: 'is-discount' },
		{ key: 'total', value: order.value.totals.totalLabel, className: 'is-total' },
	])

	const item_page_path = (item: AccountOrderLineItem) =>
		withCountry(`/order-items/${order.value.id}/${item.number}`)

	const open_upload_modal = (item: AccountOrderLineItem) => {
		orders_service.openUploadModal(item)
	}

	const hide_upload_toast = () => {
		upload_toast_visible.value = false
		if (upload_toast_timeout) {
			clearTimeout(upload_toast_timeout)
			upload_toast_timeout = null
		}
	}

	const handle_upload_submit = (payload: { itemNumber: string }) => {
		upload_toast_message.value = translate('account.orders.detail.itemUploadSuccess', { number: payload.itemNumber })
		upload_toast_visible.value = true

		if (upload_toast_timeout) {
			clearTimeout(upload_toast_timeout)
		}

		upload_toast_timeout = setTimeout(() => {
			upload_toast_visible.value = false
			upload_toast_timeout = null
		}, 3000)
	}

	onBeforeUnmount(() => {
		hide_upload_toast()
	})

	return {
		t,
		action_icon_map,
		summary_totals,
		item_page_path,
		open_upload_modal,
		upload_toast_visible,
		upload_toast_message,
		hide_upload_toast,
		handle_upload_submit,
	}
}