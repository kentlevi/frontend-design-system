import { useCheckoutBase } from '../shared/useCheckoutBase';
import { useCheckoutAddressForm } from '../shared/useCheckoutAddressForm';
import { ref } from 'vue';

type UseCheckoutGuestOptions = Parameters<typeof useCheckoutBase>[0];

export function useCheckoutGuest(options: UseCheckoutGuestOptions = {}) {
	const base = useCheckoutBase(options);
	const address_form = useCheckoutAddressForm();

	// Guest specific: email input (Members use store/memberEmail)
	const email = ref('');

	return {
		...base,
		...address_form,
		email,
	};
}