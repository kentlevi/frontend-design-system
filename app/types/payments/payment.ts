import type { ApiResponse } from "../config/api"
import type { CheckoutResponseData } from "~/types/checkout"

export type PaymentCode = "TOSS" | "BANK_TRANSFER" | "CREDIT_CARD"

export type PaymentAction = "process" | "error"

export type AvailablePaymentMethods = {
	id : number
	code : string
	name : string
	logo : string
}

export type PaymentProcessPayload = CheckoutResponseData | undefined
export type PaymentPayloadByAction = {
	process?: PaymentProcessPayload;
	error?: Error | undefined;
}
export type PaymentHandlerMap = {
	[K in PaymentAction]: (payload: PaymentPayloadByAction[K]) => void;
}

export type AvailablePaymentMethodsResponse = ApiResponse<AvailablePaymentMethods[]>