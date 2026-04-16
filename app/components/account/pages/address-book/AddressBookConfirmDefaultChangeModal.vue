<script setup lang="ts">
import type { AddressItem, ShippingAddress } from '~/types/user-address';
import { useAddressHelper } from '~/utils/address';
import { useAddressBookDefaultContext } from '~/composables/account/addressBook/context/useAddressBookDefaultContext';
import { address_book_tag_badge_colors, getTranslatedAddressBookLabel } from '~/composables/account/addressBook/addressBookPresentation';

const { t: translate } = useI18n()
const { buildAddressLines } = useAddressHelper()
const address_book_default_context = useAddressBookDefaultContext()

const is_confirm_default_change_modal_open = address_book_default_context.is_confirm_default_change_modal_open
const current_default_address = address_book_default_context.current_default_address
const pending_default_address = address_book_default_context.pending_default_address

const closeConfirmDefaultChangeModal = address_book_default_context.closeConfirmDefaultChangeModal
const confirmDefaultAddressChange = address_book_default_context.confirmDefaultAddressChange

const address_type_copy = computed(() => {
	if (!pending_default_address.value) return translate('account.addressBook.confirmDefaultChangeTypeAddress', { type: '' }).trim()

	const type = pending_default_address.value.type
	if (type === 'drop') return translate('account.addressBook.confirmDefaultChangeTypeDrop')
	if (type === 'shipping') return translate('account.addressBook.confirmDefaultChangeTypeShipping')
	return translate('account.addressBook.confirmDefaultChangeTypeBilling')
})

const modal_title = computed(() => {
	if (!pending_default_address.value) return translate('account.addressBook.confirmDefaultChangeTitle')

	const type = pending_default_address.value.type
	const key = `confirmDefaultChangeTitle${type.charAt(0).toUpperCase()}${type.slice(1)}`

	return translate(`account.addressBook.${key}`)
})

const modal_description = computed(() => {
	return translate('account.addressBook.confirmDefaultChangeDescription', {
		type: address_type_copy.value,
	})
})
const current_default_address_lines = computed(() => {
	if (!current_default_address.value) return ''
	return buildAddressLines(current_default_address.value).trim()
})
const pending_default_address_lines = computed(() => {
	if (!pending_default_address.value) return ''
	return buildAddressLines(pending_default_address.value).trim()
})

function getLabelCopy(label: AddressItem['label']) {
	return getTranslatedAddressBookLabel(label, translate)
}

function isShippingAddress(address: AddressItem): address is ShippingAddress {
	return address.type === 'shipping'
}

function closeModal() {
	closeConfirmDefaultChangeModal()
}

function cancelModal() {
	closeConfirmDefaultChangeModal()
}

function confirmModal() {
	const next_address = pending_default_address.value

	if (!next_address) return

	closeConfirmDefaultChangeModal()
	confirmDefaultAddressChange(next_address.type, next_address.id)
}
</script>

<template>
	<UiModal
		:model-value="is_confirm_default_change_modal_open"
		align="center"
		width="710px"
		:title="modal_title"
		modal-class="account-address-book-confirm-default-modal-shell"
		@update:model-value="!$event ? closeModal() : undefined"
	>
		<section class="account-address-book-confirm-default-modal" data-testid="account-address-book-confirm-default-modal">
			<div class="account-address-book-confirm-default-modal-body">
				<p class="account-address-book-confirm-default-modal-description">
					{{ modal_description }}
				</p>

				<div
					v-if="current_default_address && pending_default_address"
					class="account-address-book-confirm-default-modal-compare"
				>
					<article class="account-address-book-confirm-default-modal-card">
						<header class="account-address-book-confirm-default-modal-card-head">
							<h4 class="account-address-book-confirm-default-modal-card-name">
								{{ current_default_address.contact_name }}
							</h4>
							<UiBadge
								variant="outline"
								tone="default"
								size="md"
								class="account-address-book-confirm-default-modal-default-badge"
							>
								{{ translate('account.addressBook.default') }}
							</UiBadge>
						</header>

						<div class="account-address-book-confirm-default-modal-card-body">
							<div class="account-address-book-confirm-default-modal-card-address-row">
								<div v-if="current_default_address_lines || current_default_address.company" class="account-address-book-confirm-default-modal-card-info">
									<p
										v-if="isShippingAddress(current_default_address)"
										class="account-address-book-confirm-default-modal-card-phone"
									>
										{{ current_default_address.phone_number }}
									</p>
									<p v-if="current_default_address_lines" class="account-address-book-confirm-default-modal-card-address">
										{{ current_default_address_lines }}
									</p>
									<p v-if="current_default_address.company" class="account-address-book-confirm-default-modal-card-company">
										{{ current_default_address.company }}
									</p>
								</div>
								<UiBadge
									v-if="current_default_address.label"
									variant="tonal"
									tone="default"
									size="md"
									:bg-color="address_book_tag_badge_colors[current_default_address.label]?.bgColor || 'var(--gray-10)'"
									:text-color="address_book_tag_badge_colors[current_default_address.label]?.textColor || 'var(--gray-60)'"
									class="account-address-book-confirm-default-modal-label-badge"
								>
									{{ getLabelCopy(current_default_address.label) }}
								</UiBadge>
							</div>
						</div>
					</article>

					<div class="account-address-book-confirm-default-modal-arrow" aria-hidden="true">
						<UiIcon name="regular-long-arrow-right" :size="24" />
					</div>

					<article class="account-address-book-confirm-default-modal-card account-address-book-confirm-default-modal-card--next">
						<header class="account-address-book-confirm-default-modal-card-head">
							<h4 class="account-address-book-confirm-default-modal-card-name">
								{{ pending_default_address.contact_name }}
							</h4>
						</header>

						<div class="account-address-book-confirm-default-modal-card-body">
							<div class="account-address-book-confirm-default-modal-card-address-row">
								<div v-if="pending_default_address_lines || pending_default_address.company" class="account-address-book-confirm-default-modal-card-info">
									<p
										v-if="isShippingAddress(pending_default_address)"
										class="account-address-book-confirm-default-modal-card-phone"
									>
										{{ pending_default_address.phone_number }}
									</p>
									<p v-if="pending_default_address_lines" class="account-address-book-confirm-default-modal-card-address">
										{{ pending_default_address_lines }}
									</p>
									<p v-if="pending_default_address.company" class="account-address-book-confirm-default-modal-card-company">
										{{ pending_default_address.company }}
									</p>
								</div>

								<UiBadge
									v-if="pending_default_address.label"
									variant="tonal"
									tone="default"
									size="md"
									:bg-color="address_book_tag_badge_colors[pending_default_address.label]?.bgColor || 'var(--gray-10)'"
									:text-color="address_book_tag_badge_colors[pending_default_address.label]?.textColor || 'var(--gray-60)'"
									class="account-address-book-confirm-default-modal-label-badge"
								>
									{{ getLabelCopy(pending_default_address.label) }}
								</UiBadge>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>

		<template #footer>
			<div class="account-address-book-confirm-default-modal-actions ui-modal-footer-item">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					class="account-address-book-confirm-default-modal-cancel"
					@click="cancelModal"
				>
					{{ translate('account.addressBook.cancel') }}
				</UiButton>

				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="account-address-book-confirm-default-modal-confirm"
					@click="confirmModal"
				>
					{{ translate('account.addressBook.confirm') }}
				</UiButton>
			</div>
		</template>
	</UiModal>
</template>

<style scoped lang="scss">
.account-address-book-confirm-default-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	width: 100%;

	.account-address-book-confirm-default-modal-body {
		display: flex;
		flex-direction: column;
		gap: 24px;

		.account-address-book-confirm-default-modal-description {
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}

		.account-address-book-confirm-default-modal-compare {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr);
			align-items: stretch;
			gap: 16px;

			.account-address-book-confirm-default-modal-arrow {
				display: grid;
				place-items: center;
				color: var(--text-primary);
			}

			.account-address-book-confirm-default-modal-card {
				display: flex;
				flex-direction: column;
				border: 1px solid transparent;
				box-shadow: 0 0 0 1px var(--border-default);
				border-radius: 12px;
				background: var(--contrast-light);
				overflow: hidden;

				&.account-address-book-confirm-default-modal-card--next {
					box-shadow: 0 0 0 1px var(--success-base);
					.account-address-book-confirm-default-modal-card-head {
						border-color: var(--success-base);
					}
				}

				.account-address-book-confirm-default-modal-card-head {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 12px 20px;
					border-bottom: 1px solid var(--gray-20);

					.account-address-book-confirm-default-modal-card-name {
						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
						font-weight: var(--font-weight-semibold);
						color: var(--text-primary);
					}

					.account-address-book-confirm-default-modal-default-badge {
						flex-shrink: 0;
						font-weight: var(--font-weight-medium);
					}
				}

				.account-address-book-confirm-default-modal-card-body {
					display: flex;
					flex-direction: column;
					gap: 10px;
					padding: 12px 20px;

					.account-address-book-confirm-default-modal-card-phone {
						color: var(--text-primary);
						font-size: var(--type-size-100);
						font-weight: var(--font-weight-semibold);
						line-height: var(--type-line-100);
					}

					.account-address-book-confirm-default-modal-card-address,
					.account-address-book-confirm-default-modal-card-company {
						color: var(--text-secondary);
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
					}

					.account-address-book-confirm-default-modal-card-address-row {
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						gap: 24px;

						.account-address-book-confirm-default-modal-card-info {
							display: flex;
							flex-direction: column;
							max-width: 176px;
						}

						.account-address-book-confirm-default-modal-card-address {
							word-break: break-word;
						}

						.account-address-book-confirm-default-modal-label-badge {
							flex-shrink: 0;
						}
					}
				}
			}
		}
	}
}

:global(.account-address-book-confirm-default-modal-shell) {
	max-width: 710px;
	border-radius: 16px;
	overflow: hidden;
}

@media (max-width: 640px) {
	.account-address-book-confirm-default-modal {
		.account-address-book-confirm-default-modal-body {
			padding: 20px;

			.account-address-book-confirm-default-modal-compare {
				grid-template-columns: minmax(0, 1fr);

				.account-address-book-confirm-default-modal-arrow {
					display: none;
				}

				.account-address-book-confirm-default-modal-card {
					.account-address-book-confirm-default-modal-card-body {
						.account-address-book-confirm-default-modal-card-address-row {
							flex-direction: column;
							align-items: stretch;
						}
					}
				}
			}
		}

		:deep(.ui-modal-footer) {
			flex-direction: column;
			align-items: stretch;
			padding: 20px;
		}
	}
}
</style>