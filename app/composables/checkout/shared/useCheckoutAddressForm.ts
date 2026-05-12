export function useCheckoutAddressForm() {

	const full_name = ref('');
	const company = ref('');
	const address_1 = ref('');
	const address_2 = ref('');
	const province = ref('');
	const city = ref('');
	const postal_code = ref('');
	const phone = ref('');

	return {
		full_name,
		company,
		address_1,
		address_2,
		province,
		city,
		postal_code,
		phone,
	};
}