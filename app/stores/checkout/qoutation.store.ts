import type { OrderQuotationDetails } from "~/types/checkout/quotation"

export const useQuotationStore = defineStore('checkout_qoutation', ()=>{

	const order_quotation = ref<OrderQuotationDetails| null>(null)

	const setOrderQuotation = (data:OrderQuotationDetails) => {
		order_quotation.value = data
	}

	return {
		order_quotation,

		setOrderQuotation,
	}
})