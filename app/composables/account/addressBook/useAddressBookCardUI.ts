import type { AddressMap, AddressType } from "~/types/user-address";
import { useAddressHelper } from "~/utils/address";
import { getTranslatedAddressBookLabel } from "./addressBookPresentation";
import { useUserAddressUIContext } from "./context/useUserAddressUIContext";
import { useUserAddressContext } from "./context/useUserAddressContext";

type CardProps = {
	item?: AddressMap[AddressType];
	index?: number;
	loading?: boolean;
};

export function useAddressBookCardUI(props: CardProps) {

	/**
     * Contexts
     */
	const { editing_address_snapshot, pending_delete_address, pending_default_address, current_default_address, setAddressDefaultWithToast } = useUserAddressContext()
	const { openEditFormModal, openDeleteDialog, openConfirmDefaultChangeModal } = useUserAddressUIContext()


	/**
     * Types
     */
	type MenuActionKey = 'edit' | 'delete' | 'default';

	/**
     * Helpers
     */
	const { t: translate } = useI18n();
	const { buildAddressLines, shippingPhoneNumber, getAddressListByType } = useAddressHelper()

	/**
     * Computed
     */
	const shipping_phone_number = computed(() => props.item ? shippingPhoneNumber(props.item) : '')
	const address_line_text = computed(() => props.item ? buildAddressLines(props.item).trim() : '')



	/**
     * Variables
     */
	const is_menu_open = ref(false)
	const active_menu_action = ref<MenuActionKey | null>(null)
	const menu_wrap_ref = ref<HTMLElement | null>(null)
	const menu_actions = computed(() => {
		return [
			{
				key: 'edit',
				label: translate('account.addressBook.editAddress'),
				tone: 'default',
			},
			{
				key: 'delete',
				label: translate('account.addressBook.deleteAddress'),
				tone: 'danger',
			},
			{
				key: 'default',
				label: translate('account.addressBook.setAsDefault'),
				tone: 'default',
			},
		] as const
	})

	/**
     * Functions
     */
	function closeMenu() {
		is_menu_open.value = false
		active_menu_action.value = null
	}

	function setMenuWrapRef(element: Element | ComponentPublicInstance | null) {
		menu_wrap_ref.value = element instanceof HTMLElement ? element : null
	}

	function toggleMenu() {
		if (is_menu_open.value) {
			closeMenu()
		} else {
			is_menu_open.value = true
		}
	}

	function handleDocumentClick(event: MouseEvent) {
		if (!is_menu_open.value || !menu_wrap_ref.value) return

		const target = event.target

		if (!(target instanceof Node) || menu_wrap_ref.value.contains(target)) return

		closeMenu()
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return

		closeMenu()
	}

	async function handleMenuAction(action: MenuActionKey) {
		if (!props?.item) return

		closeMenu()

		if (action === 'edit') {
			editing_address_snapshot.value = props.item
			openEditFormModal()
			return
		}

		if (action === 'delete') {
			pending_delete_address.value = props.item
			openDeleteDialog()
			return
		}

		if (action === 'default') {
			await startDefaultFlow(props.item)
			return
		}
	}

	async function startDefaultFlow(selected_address: AddressMap[AddressType]) {
		if (!selected_address.is_default) {
			const existing_default = getAddressListByType(selected_address.type)
				.find((address) => address.is_default && address.id !== selected_address.id)

			if (existing_default) {
				current_default_address.value = existing_default
				pending_default_address.value = selected_address
				openConfirmDefaultChangeModal()
				return;
			}
		}

		await setAddressDefaultWithToast(selected_address.type, selected_address.id)
	}

	function getAddressLabel(label: string) {
		return getTranslatedAddressBookLabel(label, translate)
	}

	onMounted(() => {
		document.addEventListener('click', handleDocumentClick, true)
		window.addEventListener('keydown', handleWindowKeydown)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleDocumentClick, true)
		window.removeEventListener('keydown', handleWindowKeydown)
	})


	return {
		translate,

		shipping_phone_number,
		address_line_text,
		is_menu_open,
		active_menu_action,
		menu_actions,

		setMenuWrapRef,
		toggleMenu,
		handleMenuAction,
		getAddressLabel,
	}
}