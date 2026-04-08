import type { ApiResponse } from "../config/api"

export type PaymentCode = "TOSS" | "BANK_TRANSFER" | "CREDIT_CARD"

export type PaymentAction = "process" | "error"

export type AvailablePaymentMethods = {
    id : number
    code : string
    name : string
    logo : string
}

export type AvailablePaymentMethodsResponse = ApiResponse<AvailablePaymentMethods[]>