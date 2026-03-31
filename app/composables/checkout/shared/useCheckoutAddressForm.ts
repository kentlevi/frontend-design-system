import { computed, ref } from 'vue';
import { checkoutProvinceOptions } from '~/data/checkout/options';

export function useCheckoutAddressForm() {
	const { t } = useI18n();

	const full_name = ref('');
	const company = ref('');
	const address_1 = ref('');
	const address_2 = ref('');
	const province = ref('');
	const city = ref('');
	const postal_code = ref('');
	const phone = ref('');

	const province_options = computed(() =>
		checkoutProvinceOptions
			.filter((option) => option.enabled !== false)
			.map((option) => ({
				value: option.value,
				label: t(option.i18nKey),
			}))
	);

	return {
		full_name,
		company,
		address_1,
		address_2,
		province,
		city,
		postal_code,
		phone,
		province_options,
	};
}