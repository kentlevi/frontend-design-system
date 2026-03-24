import { useAttributesStore } from '~/stores/product'

export const usePricingService = () => {
	// const { $api } = useNuxtApp()

	const attributesStore = useAttributesStore()

	const pricing_ready = ref<boolean>(true)

	const shipping_fee = ref(50)

	const discount = ref(6)

	const standard_price = ref(23.98)

	const price = ref(22.54)

	const unit_price = ref(3.5)

	const product_base_price = computed(() => attributesStore.quantities && attributesStore.quantities?.length ? attributesStore.quantities[0] : null)


	const updatePricing = (s_fee : number, p: number) => {
		shipping_fee.value = s_fee
		price.value = p
	}

	return {
		pricing_ready,
		shipping_fee,
		product_base_price,
		discount,
		standard_price,
		unit_price,
		price,
		updatePricing,
	}
}