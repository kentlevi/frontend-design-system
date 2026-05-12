
import { useQuotationStore } from "~/stores/checkout/qoutation.store"
import { useCheckoutSummaryFlow } from "../summary/useCheckoutSummaryFlow"
import { useQuotationService } from "~/services/orders/quotation.service"
import { useCountry } from '~/composables/app/country/useCountry';

export const useQuotationFlow = () => {

	const { withCountry } = useCountry();

	const service_handler = useQuotationService()
	const {
		total_cost,
		sub_total_cost,
		shipping_cost,
		selected_items,
	} = useCheckoutSummaryFlow()


	const quotation_store = useQuotationStore()
	const {
		order_quotation,
	} = storeToRefs(quotation_store)

	const createOrderQuotation = async () => {
		try{
			const params = {
				subtotal_cost: sub_total_cost.value,
				shipping_cost: shipping_cost.value,
				discount: 0,
				total_cost: total_cost.value,
				cart_item_ids: selected_items.value.map(item => item.id).filter((id): id is number => id !== null)
			}
			await service_handler.createQuotation(params)

			navigateTo({
				path: withCountry('/checkout/order-quotation'),
				query: {
					quotation_id: order_quotation.value?.id
				}
			})

		}catch(error){
			console.log(error)
		}
	}

	const getOrderQuotaionDetails = async (id:number) => {
		try{
			if(order_quotation.value != null) return
			await service_handler.getOrderQuotaionDetails(id)
		}catch(error){
			console.log(error)
		}
	}

	const issued_date = computed(() =>
		new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date())
	);


	return {
		selected_items,
		order_quotation,
		issued_date,

		createOrderQuotation,
		getOrderQuotaionDetails,
	}
}