import { computed, ref } from 'vue';
import { checkoutProvinceOptions } from '~/data/checkout/options';

export function useCheckoutAddressForm() {
	const { t } = useI18n();

	const fullName = ref('');
	const company = ref('');
	const address1 = ref('');
	const address2 = ref('');
	const province = ref('');
	const city = ref('');
	const postalCode = ref('');
	const phone = ref('');

	const provinceOptions = computed(() =>
		checkoutProvinceOptions
			.filter((option) => option.enabled !== false)
			.map((option) => ({
				value: option.value,
				label: t(option.i18nKey),
			}))
	);

	return {
		fullName,
		company,
		address1,
		address2,
		province,
		city,
		postalCode,
		phone,
		provinceOptions,
	};
}
