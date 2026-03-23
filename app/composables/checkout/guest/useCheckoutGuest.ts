import { useCheckoutBase } from '../shared/useCheckoutBase';
import { useCheckoutAddressForm } from '../shared/useCheckoutAddressForm';
import { ref } from 'vue';

export function useCheckoutGuest() {
	const base = useCheckoutBase();
	const addressForm = useCheckoutAddressForm();

	// Guest specific: email input (Members use store/memberEmail)
	const email = ref('');

	return {
		...base,
		...addressForm,
		email,
	};
}