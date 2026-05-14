<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import { address_book_tag_badge_colors } from '~/composables/account/addressBook/addressBookPresentation';
import { useAddressBookConfirmDefaultChangeModal } from '~/composables/account/addressBook/useAddressBookConfirmDefaultChangeModal';

const {
	translate,

	is_confirm_default_change_modal_open,
	current_default_address,
	pending_default_address,
	modal_title,
	modal_description,
	current_default_address_lines,
	pending_default_address_lines,

	getLabelCopy,
	isShippingAddress,
	confirmModal,
	closeModal,
} = useAddressBookConfirmDefaultChangeModal()
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
			<MuLinearWrapper
				class="account-address-book-confirm-default-modal-body"
				direction="column"
				:gap="24"
			>
				<MuText color="text-secondary" class="account-address-book-confirm-default-modal-description">
					{{ modal_description }}
				</MuText>

				<div
					v-if="current_default_address && pending_default_address"
					class="account-address-book-confirm-default-modal-compare"
				>
					<MuCard padding="none" class="account-address-book-confirm-default-modal-card">
						<MuLinearWrapper
							class="account-address-book-confirm-default-modal-card-head"
							align="center"
							:gap="12"
						>
							<MuHeading variant="6" weight="semi-bold" color="text-primary" class="account-address-book-confirm-default-modal-card-name">
								{{ current_default_address.contact_name }}
							</MuHeading>
							<UiBadge
								variant="outline"
								tone="default"
								size="md"
								class="account-address-book-confirm-default-modal-default-badge"
							>
								{{ translate('account.addressBook.default') }}
							</UiBadge>
						</MuLinearWrapper>

						<MuLinearWrapper
							class="account-address-book-confirm-default-modal-card-body"
							direction="column"
							:gap="10"
						>
							<MuLinearWrapper
								class="account-address-book-confirm-default-modal-card-address-row"
								justify="space-between"
								align="flex-start"
								:gap="24"
							>
								<MuLinearWrapper
									v-if="current_default_address_lines || current_default_address.company"
									class="account-address-book-confirm-default-modal-card-info"
									direction="column"
								>
									<MuText
										v-if="isShippingAddress(current_default_address)"
										weight="semi-bold"
										color="text-primary"
										class="account-address-book-confirm-default-modal-card-phone"
									>
										{{ current_default_address.phone_number }}
									</MuText>
									<MuText v-if="current_default_address_lines" color="text-secondary" class="account-address-book-confirm-default-modal-card-address">
										{{ current_default_address_lines }}
									</MuText>
									<MuText v-if="current_default_address.company" color="text-secondary" class="account-address-book-confirm-default-modal-card-company">
										{{ current_default_address.company }}
									</MuText>
								</MuLinearWrapper>
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
							</MuLinearWrapper>
						</MuLinearWrapper>
					</MuCard>

					<div class="account-address-book-confirm-default-modal-arrow" aria-hidden="true">
						<UiIcon name="regular-long-arrow-right" :size="24" />
					</div>

					<MuCard
						padding="none"
						class="account-address-book-confirm-default-modal-card account-address-book-confirm-default-modal-card--next"
					>
						<MuLinearWrapper
							class="account-address-book-confirm-default-modal-card-head"
							align="center"
							:gap="12"
						>
							<MuHeading variant="6" weight="semi-bold" color="text-primary" class="account-address-book-confirm-default-modal-card-name">
								{{ pending_default_address.contact_name }}
							</MuHeading>
						</MuLinearWrapper>

						<MuLinearWrapper
							class="account-address-book-confirm-default-modal-card-body"
							direction="column"
							:gap="10"
						>
							<MuLinearWrapper
								class="account-address-book-confirm-default-modal-card-address-row"
								justify="space-between"
								align="flex-start"
								:gap="24"
							>
								<MuLinearWrapper
									v-if="pending_default_address_lines || pending_default_address.company"
									class="account-address-book-confirm-default-modal-card-info"
									direction="column"
								>
									<MuText
										v-if="isShippingAddress(pending_default_address)"
										weight="semi-bold"
										color="text-primary"
										class="account-address-book-confirm-default-modal-card-phone"
									>
										{{ pending_default_address.phone_number }}
									</MuText>
									<MuText v-if="pending_default_address_lines" color="text-secondary" class="account-address-book-confirm-default-modal-card-address">
										{{ pending_default_address_lines }}
									</MuText>
									<MuText v-if="pending_default_address.company" color="text-secondary" class="account-address-book-confirm-default-modal-card-company">
										{{ pending_default_address.company }}
									</MuText>
								</MuLinearWrapper>

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
							</MuLinearWrapper>
						</MuLinearWrapper>
					</MuCard>
				</div>
			</MuLinearWrapper>
		</section>

		<template #footer>
			<div class="account-address-book-confirm-default-modal-actions ui-modal-footer-item">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					class="account-address-book-confirm-default-modal-cancel"
					@click="closeModal"
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
				overflow: hidden;

				&.account-address-book-confirm-default-modal-card--next {
					box-shadow: inset 0 0 0 1px var(--success-base);
					.account-address-book-confirm-default-modal-card-head {
						border-color: var(--success-base);
					}
				}

				.account-address-book-confirm-default-modal-card-head {
					padding: 12px 20px;
					border-bottom: 1px solid var(--gray-20);

					.account-address-book-confirm-default-modal-card-name {
						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
					}

					.account-address-book-confirm-default-modal-default-badge {
						flex-shrink: 0;
						font-weight: var(--font-weight-medium);
					}
				}

				.account-address-book-confirm-default-modal-card-body {
					padding: 12px 20px;

					.account-address-book-confirm-default-modal-card-address-row {
						.account-address-book-confirm-default-modal-card-info {
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
							flex-direction: column !important;
							align-items: stretch !important;
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
