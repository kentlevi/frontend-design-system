<script setup lang="ts">
import type { AddressItem, ShippingAddress } from '~/types/address';
import { useAddressHelper } from '~/utils/address';
import { useAddressBookDefaultContext } from '~/composables/account/addressBook/context/useAddressBookDefaultContext';

const { buildAddressLines } = useAddressHelper()
const address_book_default_context = useAddressBookDefaultContext()

const is_confirm_default_change_modal_open = address_book_default_context.is_confirm_default_change_modal_open
const current_default_address = address_book_default_context.current_default_address
const pending_default_address = address_book_default_context.pending_default_address

const closeConfirmDefaultChangeModal = address_book_default_context.closeConfirmDefaultChangeModal
const confirmDefaultAddressChange = address_book_default_context.confirmDefaultAddressChange

const tag_badge_colors = {
	home: {
		bgColor: 'var(--aloha-10)',
		textColor: 'var(--aloha-60)',
	},
	office: {
		bgColor: 'var(--neon-blue-10)',
		textColor: 'var(--neon-blue-60)',
	},
	client: {
		bgColor: 'var(--azure-10)',
		textColor: 'var(--azure-60)',
	},
} as const

const address_type_copy = computed(() => {
	if (!pending_default_address.value) return 'address'
	return pending_default_address.value.type === 'drop'
		? 'drop shipping address'
		: `${pending_default_address.value.type} address`
})

const modal_title = computed(() => {
	if (!pending_default_address.value) return 'Confirm Default Address Change'

	const type_label = pending_default_address.value.type === 'drop'
		? 'Drop Shipping'
		: `${pending_default_address.value.type.charAt(0).toUpperCase()}${pending_default_address.value.type.slice(1)}`

	return `Confirm Default ${type_label} Address Change`
})

const modal_description = computed(() => {
	return `You're about to set this as your default ${address_type_copy.value}. Confirm to proceed.`
})

function getLabelCopy(label: AddressItem['label']) {
	return label.charAt(0).toUpperCase() + label.slice(1)
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
		padding="0"
		gap="0"
		width="710px"
		modal-class="account-address-book-confirm-default-modal-shell"
		@update:model-value="!$event ? closeModal() : undefined"
	>
		<section class="account-address-book-confirm-default-modal" data-testid="account-address-book-confirm-default-modal">
			<header class="account-address-book-confirm-default-modal-header">
				<h3 class="account-address-book-confirm-default-modal-title">
					{{ modal_title }}
				</h3>

				<button
					type="button"
					class="account-address-book-confirm-default-modal-close"
					aria-label="Close confirm default address change modal"
					data-testid="account-address-book-confirm-default-modal-close"
					@click="cancelModal"
				>
					<UiIcon name="regular-times" :size="24" />
				</button>
			</header>

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
								Default
							</UiBadge>
						</header>

						<div class="account-address-book-confirm-default-modal-card-body">
							<p
								v-if="isShippingAddress(current_default_address)"
								class="account-address-book-confirm-default-modal-card-phone"
							>
								{{ current_default_address.phone_number }}
							</p>

							<div class="account-address-book-confirm-default-modal-card-address-row">
								<p class="account-address-book-confirm-default-modal-card-address">
									{{ buildAddressLines(current_default_address) }}
								</p>

								<UiBadge
									v-if="current_default_address.label"
									variant="tonal"
									tone="default"
									size="md"
									:bg-color="tag_badge_colors[current_default_address.label]?.bgColor || 'var(--gray-10)'"
									:text-color="tag_badge_colors[current_default_address.label]?.textColor || 'var(--gray-60)'"
									class="account-address-book-confirm-default-modal-label-badge"
								>
									{{ getLabelCopy(current_default_address.label) }}
								</UiBadge>
							</div>

							<p v-if="current_default_address.company" class="account-address-book-confirm-default-modal-card-company">
								{{ current_default_address.company }}
							</p>
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
							<p
								v-if="isShippingAddress(pending_default_address)"
								class="account-address-book-confirm-default-modal-card-phone"
							>
								{{ pending_default_address.phone_number }}
							</p>

							<div class="account-address-book-confirm-default-modal-card-address-row">
								<p class="account-address-book-confirm-default-modal-card-address">
									{{ buildAddressLines(pending_default_address) }}
								</p>

								<UiBadge
									v-if="pending_default_address.label"
									variant="tonal"
									tone="default"
									size="md"
									:bg-color="tag_badge_colors[pending_default_address.label]?.bgColor || 'var(--gray-10)'"
									:text-color="tag_badge_colors[pending_default_address.label]?.textColor || 'var(--gray-60)'"
									class="account-address-book-confirm-default-modal-label-badge"
								>
									{{ getLabelCopy(pending_default_address.label) }}
								</UiBadge>
							</div>

							<p v-if="pending_default_address.company" class="account-address-book-confirm-default-modal-card-company">
								{{ pending_default_address.company }}
							</p>
						</div>
					</article>
				</div>
			</div>

			<footer class="account-address-book-confirm-default-modal-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					class="account-address-book-confirm-default-modal-cancel"
					@click="cancelModal"
				>
					Cancel
				</UiButton>

				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="account-address-book-confirm-default-modal-confirm"
					@click="confirmModal"
				>
					Confirm
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-address-book-confirm-default-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	width: 100%;

	.account-address-book-confirm-default-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 1px solid var(--gray-20);

		.account-address-book-confirm-default-modal-title {
			font-size: var(--type-size-300);
			line-height: var(--type-line-300);
			font-weight: var(--font-weight-bold);
			color: var(--text-primary);
		}

		.account-address-book-confirm-default-modal-close {
			display: grid;
			place-items: center;
			padding: 0;
			border: 0;
			background: transparent;
			cursor: pointer;
			color: var(--text-primary);
		}
	}

	.account-address-book-confirm-default-modal-body {
		display: flex;
		flex-direction: column;
		gap: 28px;
		padding: 28px 24px 0;

		.account-address-book-confirm-default-modal-description {
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}

		.account-address-book-confirm-default-modal-compare {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1fr);
			align-items: stretch;
			gap: 20px;

			.account-address-book-confirm-default-modal-arrow {
				display: grid;
				place-items: center;
				color: var(--text-primary);
			}

			.account-address-book-confirm-default-modal-card {
				display: flex;
				flex-direction: column;
				border: 1px solid var(--border-default);
				border-radius: 12px;
				background: var(--contrast-light);
				overflow: hidden;

				&.account-address-book-confirm-default-modal-card--next {
					border-color: var(--green-50, #59d94f);
				}

				.account-address-book-confirm-default-modal-card-head {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 18px 20px;
					border-bottom: 1px solid var(--gray-20);

					.account-address-book-confirm-default-modal-card-name {
						flex: 1 1 auto;
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
					padding: 18px 20px;

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
						gap: 16px;

						.account-address-book-confirm-default-modal-card-address {
							flex: 1 1 auto;
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

	.account-address-book-confirm-default-modal-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
		padding: 26px 24px 24px;

		.account-address-book-confirm-default-modal-confirm {
			min-width: 88px;
			border-radius: 18px;
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

		.account-address-book-confirm-default-modal-actions {
			flex-direction: column;
			align-items: stretch;
			padding: 20px;
		}
	}
}
</style>
