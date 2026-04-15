import { inject, provide, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type {
	AddressDynamicFields,
	AddressFormMap,
	AddressType,
	UpdateDynamicFieldPayload,
	UpdateFieldPayload,
} from '~/types/address'

export type AddressBookFormContext = {
	is_form_modal_open: Ref<boolean>
	form_modal_mode: Ref<'create' | 'edit'>
	form_submit_label: ComputedRef<string>
	is_submitting: Ref<boolean> | ComputedRef<boolean>
	form_type: Ref<AddressType>
	active_form: ComputedRef<AddressFormMap[AddressType]>
	dynamic_fields: ComputedRef<AddressDynamicFields[]>
	form_field_errors: Ref<Record<string, string>>
	setFormType: (type: AddressType) => void
	updateFormFieldByType: (type: AddressType, payload: UpdateFieldPayload) => void
	updateDynamicFieldByType: (type: AddressType, payload: UpdateDynamicFieldPayload) => void
	submitAddressForm: () => void
	closeFormModal: () => void
}

const address_book_form_context_key: InjectionKey<AddressBookFormContext> = Symbol('address-book-form-context')

export function provideAddressBookFormContext(context: AddressBookFormContext) {
	provide(address_book_form_context_key, context)
}

export function useAddressBookFormContext() {
	const context = inject(address_book_form_context_key)

	if (!context) {
		throw new Error('Address book form context is not available.')
	}

	return context
}