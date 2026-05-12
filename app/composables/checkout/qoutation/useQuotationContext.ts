import { provide, inject } from 'vue'
import { useQuotationFlow } from './useQuotationFlow'

type QuotationContext = ReturnType<typeof useQuotationFlow>

const quotation_key = Symbol('quotation')

export const provideQuotation = () => {
	const flow = useQuotationFlow()

	const context = {
		...flow,
	}

	provide(quotation_key, context)

	return context
}

export const useQuotationContext = () => {
	const context = inject<QuotationContext>(quotation_key)

	if (!context) {
		throw new Error(
			'useQuotationContext must be used within provideQuotation'
		)
	}

	return context
}