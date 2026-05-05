import { useDismissibleTooltip } from "~/composables/checkout/features/useDismissibleTooltip";
import { useUserAddressFormStateContext } from "./context/useUserAddressFormStateContext";
import { useUserAddressUIContext } from "./context/useUserAddressUIContext";
import type { AddressType } from "~/types/user-address";
import type { icons } from "~/data/ui/icons";

export function useAddressBookFormModalUI () {
	/**
     * Contexts
     */
	const {
		is_form_modal_open,
		form_modal_mode,
		form_submit_label,

		closeFormModal
	} = useUserAddressUIContext()
	const { form_type } = useUserAddressFormStateContext()


	/**
     * Helpers
     */
	const { t: translate } = useI18n();


	/**
     * Types
     */
	type IconName = keyof typeof icons;


	/**
     * Variables
     */
	const default_address_tooltip_open = ref(false)
	const default_address_tooltip_ref = ref<HTMLElement | null>(null)
	const address_type_options: Array<{
		value: AddressType;
		label_key: string;
		icon: IconName;
	}> = [
		{ value: 'shipping', label_key: 'shippingTitle', icon: 'regular-truck' },
		{ value: 'billing', label_key: 'billingTitle', icon: 'regular-file-dollar' },
		{ value: 'drop', label_key: 'dropTitle', icon: 'regular-boxes' },
	]
	const default_address_tooltip_props = {
		side: 'right',
		align: 'start',
		mobileSide: 'bottom',
		tone: 'neutral',
		offset: 10,
		slideDistance: 24,
		contentWidth: '480px',
		contentMinWidth: '480px',
		contentMaxWidth: 'min(480px, calc(100vw - 32px))',
		mobileContentWidth: 'min(320px, calc(100vw - 32px))',
	} as const


	/**
     * Computed
     */
	const save_label = computed(() => {
		return translate(`account.addressBook.${form_submit_label.value}`)
	})
	const default_toggle_copy = computed(() => {
		return translate(`account.addressBook.defaultToggle${capitalizeFirst(form_type.value)}`)
	})
	const default_address_tooltip_content = computed(() => {
		if (form_type.value === 'shipping') {
			return {
				title: translate('account.addressBook.defaultTooltipShippingTitle'),
				text: translate('account.addressBook.defaultTooltipShippingText'),
			}
		}

		if (form_type.value === 'billing') {
			return {
				title: translate('account.addressBook.defaultTooltipBillingTitle'),
				text: translate('account.addressBook.defaultTooltipBillingText'),
			}
		}

		return {
			title: translate('account.addressBook.defaultTooltipDropTitle'),
			text: translate('account.addressBook.defaultTooltipDropText'),
		}
	})
	const modal_title = computed(() => {
		return form_modal_mode.value === 'edit'
			? translate('account.addressBook.editTitle')
			: translate('account.addressBook.addNew')
	})


	/**
     * Functions
     */
	useDismissibleTooltip(default_address_tooltip_ref, default_address_tooltip_open)

	function toggleDefaultAddressTooltip() {
		default_address_tooltip_open.value = !default_address_tooltip_open.value
	}


	return {
		translate,

		form_type,
		is_form_modal_open,
		form_modal_mode,
		default_address_tooltip_open,
		default_address_tooltip_ref,
		address_type_options,
		default_address_tooltip_props,
		save_label,
		default_toggle_copy,
		default_address_tooltip_content,
		modal_title,

		closeFormModal,
		toggleDefaultAddressTooltip
	}
}