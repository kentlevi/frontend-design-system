<script setup lang="ts">
import type { AddressItem, AddressMap, AddressType } from '~/types/address';
import AddressBookSection from './AddressBookSection.vue';
import AddressBookFormModal from './AddressBookFormModal.vue';
import AddressBookDeleteConfirmModal from './AddressBookDeleteConfirmModal.vue';
import AddressBookConfirmDefaultChangeModal from './AddressBookConfirmDefaultChangeModal.vue';
import AddressBookDefaultShippingModal from './AddressBookDefaultShippingModal.vue';
import { useAddressBookList } from '~/composables/account/addressBook/useAddressBookList';
import { useAddressCreateForm } from '~/composables/account/addressBook/useAddressCreateForm';
import { useAddressEditForm } from '~/composables/account/addressBook/useAddressEditForm';
import { useAddressModalState } from '~/composables/account/addressBook/useAddressModalState';
import { useAddressFieldStore } from '~/stores/address';
import { useAddressFormState } from '~/composables/account/addressBook/useAddressFormState';
import { useAddressDeleteForm } from '~/composables/account/addressBook/useAddressDeleteForm';
import { useAddressDefaultFlow } from '~/composables/account/addressBook/useAddressDefaultFlow';
import { provideAddressBookFeatureContext } from '~/composables/account/addressBook/addressBookFeatureContext';

withDefaults(defineProps<{
	embedded?: boolean;
}>(), {
	embedded: false,
});

const { t: translate } = useI18n();

/**
 * Store
 */
const loading_overlay_store = useLoadingOverlayStore()
const address_field_store = useAddressFieldStore()
const dynamic_fields = computed(() => address_field_store.dynamic_address_fields ?? [])

const {
	shipping_address,
	billing_address,
	drop_address,
	has_shipping_addresses,
	has_billing_addresses,
	has_drop_addresses,
	has_addresses,

	getAddresses,
} = useAddressBookList()

const {
	form_state,
	form_type,
	active_form,
	form_field_errors,

	setFormType,
	populateDynamicFields,
	clearFormFieldErrors,
	updateActiveFormField,
	updateDynamicField,
	resetForm,
} = useAddressFormState()

const {
	is_form_modal_open,
	is_delete_modal_open,
	is_default_shipping_modal_open,
	is_confirm_default_change_modal_open,
	form_modal_mode,
	form_submit_label,
	setCreateMode,
	openCreateFormModal,
	openEditFormModal,
	closeFormModal,
	openDeleteDialog,
	closeDeleteDialog,
	openDefaultShippingModal,
	closeDefaultShippingModal,
	openConfirmDefaultChangeModal,
	closeConfirmDefaultChangeModal: closeConfirmDefaultChangeStateModal,
} = useAddressModalState()

const {
	pending_default_address,
	current_default_address,

	setAddressDefault,
	setAddressDefaultWithToast,
	startDefaultFlow,
} = useAddressDefaultFlow({
	openConfirmDefaultChangeModal,
})

const {
	createAddress,
	prepareCreateModal,
} = useAddressCreateForm({
	form_state,
	form_type,
	active_form,
	form_field_errors,

	openCreateFormModal,
	closeFormModal,
	resetForm,
	clearFormFieldErrors,
	populateDynamicFields,
})

const {
	pending_delete_address,

	startDeleteFlow,
	cancelDeleteFlow,
	getReplacementAddresses,
	confirmDeleteAddress,
} = useAddressDeleteForm({
	shipping_address,
	billing_address,
	drop_address,

	openDeleteDialog,
	closeDeleteDialog,
	openDefaultShippingModal,
	closeDefaultShippingModal,
})

const {
	resetEditState,
	openEditModal,
	updateAddress,
} = useAddressEditForm({
	form_state,
	form_type,
	active_form,
	form_field_errors,

	openEditFormModal,
	closeFormModal,
	setCreateMode,
	clearFormFieldErrors,
})

const replacement_addresses = computed<AddressItem[]>(() => {
	const pending_type = pending_delete_address.value?.type
	return pending_type ? getReplacementAddresses(pending_type) : []
})

provideAddressBookFeatureContext({
	is_form_modal_open,
	form_modal_mode,
	form_submit_label,
	is_delete_modal_open,
	is_default_shipping_modal_open,
	replacement_addresses,
	is_confirm_default_change_modal_open,
	current_default_address,
	pending_default_address,
	form_type,
	active_form,
	dynamic_fields,
	form_field_errors,
	setFormType,
	updateActiveFormField,
	updateDynamicField,
	submitAddressForm,
	closeFormModal,
	cancelDeleteFlow,
	confirmDeleteAddress,
	cancelDefaultShippingFlow,
	skipDefaultShippingSelection,
	saveDefaultShippingSelection: deleteAndSetDefault,
	closeConfirmDefaultChangeModal,
	confirmDefaultAddressChange,
	handleCardMenuAction,
})

onMounted(() => {
	getAddresses('shipping')
	getAddresses('billing')
	getAddresses('drop')
	address_field_store.getDynamicFields()
})

function handleCardMenuAction(payload: {
	action: 'edit' | 'delete' | 'default';
	item: AddressMap[AddressType];
}) {
	if (payload.action === 'edit') {
		openEditModal(payload.item)
		return
	}

	if (payload.action === 'delete') {
		startDeleteFlow(payload.item)
		return
	}

	if (payload.action === 'default') {
		startDefaultFlow(payload.item)
	}
}

function handleOpenAddModal() {
	resetEditState()
	setCreateMode()
	prepareCreateModal()
	openCreateFormModal()
}

function submitAddressForm() {
	if (form_modal_mode.value === 'edit') {
		updateAddress()
		return
	}

	createAddress()
}

async function deleteAndSetDefault(type: AddressType, address_id: number) {

	loading_overlay_store.startLoading('set_default', {
		showCopy: true,
		testId: 'account-address-set-default-overlay',
		position: 'fixed'
	})

	await Promise.all([
		confirmDeleteAddress({ skip_default_shipping_modal: true, overlay: false }),
		setAddressDefault(type, address_id),
	])

	loading_overlay_store.stopLoading('set_default')
}

function closeConfirmDefaultChangeModal() {
	closeConfirmDefaultChangeStateModal()
	current_default_address.value = null
	pending_default_address.value = null
}

function confirmDefaultAddressChange(type: AddressType, address_id: number) {
	setAddressDefaultWithToast(type, address_id)
}

function cancelDefaultShippingFlow() {
	closeDefaultShippingModal()
	cancelDeleteFlow()
}

function skipDefaultShippingSelection() {
	confirmDeleteAddress({ skip_default_shipping_modal: true })
}
</script>

<template>
	<section class="account-page" data-testid="account-address-book-page">
		<AccountShellSection :embedded="embedded" active-tab="address-book">
			<div class="account-content" data-testid="account-address-book-content">
				<header class="account-address-book-header" data-testid="account-address-book-header">
					<h1 class="account-address-book-title" data-testid="account-address-book-title">
						{{ translate('account.addressBook.title') }}
					</h1>
					<UiButton
						v-if="has_addresses"
						variant="filled"
						tone="neutral"
						size="md"
						icon="regular-plus"
						icon-position="left"
						data-testid="account-address-book-add-button"
						@click="handleOpenAddModal"
					>
						{{ translate('account.addressBook.addNew') }}
					</UiButton>
				</header>

				<div
					v-if="has_addresses"
					class="account-address-book-sections"
					data-testid="account-address-book-sections"
				>
					<div class="account-address-book-primary-group">
						<AddressBookSection
							v-if="has_shipping_addresses"
							section="shipping"
							:items="shipping_address"
						/>
						<AddressBookSection
							v-if="has_billing_addresses"
							section="billing"
							:items="billing_address"
						/>
						<AddressBookSection
							v-if="has_drop_addresses"
							section="drop"
							:items="drop_address"
						/>
					</div>
				</div>

				<section
					v-else
					class="account-address-book-empty-state"
					data-testid="account-address-book-empty-state"
				>
					<div class="account-address-book-empty-state-icon">
						<img
							src="/icons/custom/account/address-empty-state.svg"
							alt=""
							class="account-address-book-empty-state-icon-image"
						>
					</div>
					<div class="account-address-book-empty-state-content">
						<div class="account-address-book-empty-state-copy">
							<h2 class="account-address-book-empty-state-title">
								{{ translate('account.addressBook.emptyTitle') }}
							</h2>
							<p class="account-address-book-empty-state-description">
								{{ translate('account.addressBook.emptyDescription') }}
							</p>
						</div>
						<UiButton
							variant="filled"
							tone="neutral"
							size="md"
							icon="regular-plus"
							icon-position="left"
							class="account-address-book-empty-state-button"
							data-testid="account-address-book-empty-add-button"
							@click="handleOpenAddModal"
						>
							{{ translate('account.addressBook.addNew') }}
						</UiButton>
					</div>
				</section>
			</div>

			<AddressBookFormModal />
			<AddressBookDeleteConfirmModal />
			<AddressBookDefaultShippingModal />
			<AddressBookConfirmDefaultChangeModal />
		</AccountShellSection>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);

	.account-content {
		padding-top: 40px;
		display: flex;
		flex-direction: column;
		gap: 40px;

		.account-address-book-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.account-address-book-title {
				font-size: var(--type-size-450);
				font-weight: var(--font-weight-bold);
				line-height: var(--type-line-450);
				color: var(--text-primary);
			}
		}

		.account-address-book-sections {
			display: flex;
			flex-direction: column;
			gap: 56px;

			.account-address-book-primary-group {
				display: flex;
				flex-direction: column;
				gap: 32px;
			}
		}

		.account-address-book-empty-state {
			display: flex;
			gap: 24px;
			flex-direction: column;
			align-items: center;
			text-align: center;

			.account-address-book-empty-state-icon {
				display: grid;
				place-items: center;

				.account-address-book-empty-state-icon-image {
					display: block;
					width: 72px;
					height: 72px;
				}
			}

			.account-address-book-empty-state-content {
				display: flex;
				flex-direction: column;
				gap: 40px;
				align-items: center;

				.account-address-book-empty-state-copy {
					display: flex;
					flex-direction: column;
					gap: 16px;
					align-items: center;

					.account-address-book-empty-state-title {
						font-size: var(--type-size-300);
						line-height: var(--type-line-300);
						font-weight: var(--font-weight-bold);
						color: var(--text-primary);
					}

					.account-address-book-empty-state-description {
						max-width: 480px;
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						color: var(--text-secondary);
					}
				}

				.account-address-book-empty-state-button {
					min-width: 164px;
				}
			}
		}
	}
}

@media (max-width: 980px) {
	.account-page {
		.account-content {
			.account-address-book-header {
				align-items: flex-start;
				flex-direction: column;
			}

			.account-address-book-empty-state {
				min-height: 320px;
				padding-inline: 0;
			}
		}
	}
}
</style>