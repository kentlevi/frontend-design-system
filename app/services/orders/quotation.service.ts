import type { CreateQuotationPayload } from "~/types/checkout/quotation"
import { createOrderQuotation, fetchOrderQuotaionDetails } from "./api.service"
import { useQuotationStore } from "~/stores/checkout/qoutation.store"

export const useQuotationService = () => {

	const quotation_store = useQuotationStore()

	const createQuotation = async (params : CreateQuotationPayload) => {
		try{
			const request = await createOrderQuotation(params)

			if(!request.data) throw new Error('No Order Quotation found')

			quotation_store.setOrderQuotation(request.data)

		}catch(error){
			console.error(error)
		}
	}

	const getOrderQuotaionDetails = async (id : number) => {
		try{
			const request = await fetchOrderQuotaionDetails(id)

			if(!request.data) throw new Error('No Order Quotation found')

			quotation_store.setOrderQuotation(request.data)

		}catch(error){
			console.error(error)
		}
	}



	return {
		createQuotation,
		getOrderQuotaionDetails,
	}
}