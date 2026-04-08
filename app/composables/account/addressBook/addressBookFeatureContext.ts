import { inject, provide, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import type {
	AddressItem,
	AddressDynamicFields,
	AddressFormMap,
	AddressMap,
	AddressType,
	UpdateDynamicFieldPayload,
	UpdateFieldPayload
} from '~/types/address';

type AddressBookMenuAction = 'edit' | 'delete' | 'default'

type AddressBookMenuPayload = {
	action: AddressBookMenuAction
	item: AddressMap[AddressType]
}

export type AddressBookFeatureContext = {

	/** Modal */
	is_form_modal_open: Ref<boolean>
	form_modal_mode: Ref<'create' | 'edit'>
	form_submit_label: ComputedRef<string>
	is_delete_modal_open: Ref<boolean>
	is_default_shipping_modal_open: Ref<boolean>
	replacement_addresses: ComputedRef<AddressItem[]>
	is_confirm_default_change_modal_open: Ref<boolean>

	/** Data Variables */
	current_default_address: Ref<AddressItem | null>
	pending_default_address: Ref<AddressItem | null>
	form_type: Ref<AddressType>
	active_form: ComputedRef<AddressFormMap[AddressType]>
	dynamic_fields: ComputedRef<AddressDynamicFields[]>
	form_field_errors: Ref<Record<string, string>>

	/** Form Actions */
	setFormType: (type: AddressType) => void
	updateActiveFormField: (payload: UpdateFieldPayload) => void
	updateDynamicField: (payload: UpdateDynamicFieldPayload) => void
	submitAddressForm: () => void
	closeFormModal: () => void

	/** Delete Actions */
	cancelDeleteFlow: () => void
	confirmDeleteAddress: () => Promise<void>

	/** Default Actions */
	cancelDefaultShippingFlow: () => void
	skipDefaultShippingSelection: () => void
	saveDefaultShippingSelection: (type: AddressType, address_id: number) => Promise<void>
	closeConfirmDefaultChangeModal: () => void
	confirmDefaultAddressChange: (type: AddressType, address_id: number) => void

	/** Card Actions */
	handleCardMenuAction: (payload: AddressBookMenuPayload) => void
}

const address_book_feature_context_key: InjectionKey<AddressBookFeatureContext> = Symbol('address-book-feature-context');

export function provideAddressBookFeatureContext(context: AddressBookFeatureContext) {
	provide(address_book_feature_context_key, context);
}

export function useAddressBookFeatureContext() {
	const context = inject(address_book_feature_context_key);

	if (!context) {
		throw new Error('Address book feature context is not available.');
	}

	return context;
}