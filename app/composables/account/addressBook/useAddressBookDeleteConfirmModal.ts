import { useUserAddressUIContext } from "./context/useUserAddressUIContext";
import { useUserAddressContext } from "./context/useUserAddressContext";

export function useAddressBookDeleteConfirmModal() {

	/**
     * Contexts
     */
	const { is_delete_modal_open } = useUserAddressUIContext()
	const { cancelDeleteFlow, confirmDeleteAddress } = useUserAddressContext()


	/**
     * Helpers
     */
	const { t: translate } = useI18n();

	return {
		translate,

		is_delete_modal_open,

		cancelDeleteFlow,
		confirmDeleteAddress,
	}
}