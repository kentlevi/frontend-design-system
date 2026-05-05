<script setup lang="ts">
import { address_book_tag_badge_colors } from '~/composables/account/addressBook/addressBookPresentation';
import { useAddressBookDefaultShippingModal } from '~/composables/account/addressBook/useAddressBookDefaultShippingModal';

const {
	translate,

	selected_address_id,
	is_default_shipping_modal_open,
	replacement_addresses,
	default_selection_title,
	default_selection_description,

	buildAddressLines,
	shippingPhoneNumber,
	closeModal,
	skipSelection,
	saveSelection,
	getAddressLabel,
} = useAddressBookDefaultShippingModal()
</script>

<template>
	<UiModal
		:model-value="is_default_shipping_modal_open"
		align="center"
		width="710px"
		:title="default_selection_title"
		modal-class="account-address-book-default-modal-shell"
		scrollable
		@update:model-value="!$event ? closeModal() : undefined"
	>
		<section class="account-address-book-default-modal" data-testid="account-address-book-default-modal">
			<div class="account-address-book-default-modal-body">
				<p class="account-address-book-default-modal-description">
					{{ default_selection_description }}
				</p>

				<div class="account-address-book-default-modal-list">
					<label
						v-for="address in replacement_addresses"
						:key="address.id"
						class="account-address-book-default-modal-card"
						:data-selected="selected_address_id === address.id"
					>
						<div class="account-address-book-default-modal-card-head">
							<UiRadio
								v-model="selected_address_id"
								:value="address.id"
								name="default-shipping-address"
								class="account-address-book-default-modal-radio"
							/>
							<h4 class="account-address-book-default-modal-card-name">
								{{ address.contact_name }}
							</h4>
						</div>

						<div class="account-address-book-default-modal-card-body">
							<div
								v-if="shippingPhoneNumber(address) || buildAddressLines(address).trim() || address.company"
								class="account-address-book-default-modal-card-copy"
							>
								<p v-if="shippingPhoneNumber(address)" class="account-address-book-default-modal-card-phone">
									{{ shippingPhoneNumber(address) }}
								</p>
								<p v-if="buildAddressLines(address).trim()" class="account-address-book-default-modal-card-address">
									{{ buildAddressLines(address) }}
								</p>
								<p v-if="address.company" class="account-address-book-default-modal-card-company">
									{{ address.company }}
								</p>
							</div>
							<div class="account-address-book-default-modal-card-footer">
								<UiBadge
									v-if="address.label"
									variant="tonal"
									tone="default"
									size="md"
									:bg-color="address_book_tag_badge_colors[address.label]?.bgColor || 'var(--gray-10)'"
									:text-color="address_book_tag_badge_colors[address.label]?.textColor || 'var(--gray-60)'"
								>
									{{ getAddressLabel(address.label) }}
								</UiBadge>
							</div>
						</div>
					</label>
				</div>
			</div>
		</section>

		<template #footer>
			<div class="account-address-book-default-modal-actions ui-modal-footer-item">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					class="account-address-book-default-modal-cancel"
					@click="closeModal"
				>
					{{ translate('account.addressBook.cancel') }}
				</UiButton>
			</div>

			<div class="account-address-book-default-modal-actions-right ui-modal-footer-item">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					class="account-address-book-default-modal-skip"
					@click="skipSelection"
				>
					{{ translate('account.addressBook.skipAndSelectLater') }}
				</UiButton>

				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="account-address-book-default-modal-save"
					:disabled="selected_address_id === null"
					@click="saveSelection"
				>
					{{ translate('account.addressBook.save') }}
				</UiButton>
			</div>
		</template>
	</UiModal>
</template>

<style scoped lang="scss">
.account-address-book-default-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	width: 100%;

	.account-address-book-default-modal-body {
		display: flex;
		flex-direction: column;
		gap: 24px;

		.account-address-book-default-modal-description {
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}

		.account-address-book-default-modal-list {
			display: flex;
			flex-direction: column;
			gap: 16px;

			.account-address-book-default-modal-card {
				display: flex;
				flex-direction: column;
				border: 1px solid var(--border-default);
				border-radius: 12px;
				background: var(--contrast-light);
				cursor: pointer;
				overflow: hidden;
				transition: border-color 0.18s ease, box-shadow 0.18s ease;

				&[data-selected='true'] {
					border-color: var(--gray-60);
					background-color: var(--gray-40);
					.account-address-book-default-modal-card-head {
						border-color: var(--gray-60);
					}
				}

				.account-address-book-default-modal-card-head {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 12px 20px;
					border-bottom: 1px solid var(--gray-20);

					.account-address-book-default-modal-card-name {
						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
						font-weight: var(--font-weight-semibold);
						color: var(--text-primary);
					}
				}

				.account-address-book-default-modal-card-body {
					display: flex;
					gap: 24px;
					padding: 12px 20px;
					justify-content: space-between;
					align-items: center;

					.account-address-book-default-modal-card-copy {
						display: flex;
						flex-direction: column;

						.account-address-book-default-modal-card-phone,
						.account-address-book-default-modal-card-address,
						.account-address-book-default-modal-card-company {
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
						}

						.account-address-book-default-modal-card-phone {
							color: var(--text-primary);
							font-weight: var(--font-weight-semibold);
						}

						.account-address-book-default-modal-card-address {
							color: var(--text-secondary);
						}

						.account-address-book-default-modal-card-company {
							color: var(--text-secondary);
						}
					}



					.account-address-book-default-modal-card-footer {
						display: flex;
						align-items: center;
						gap: 16px;
						flex-shrink: 0;
					}
				}
			}
		}
	}
}

:global(.account-address-book-default-modal-shell) {
	max-width: 710px;
	border-radius: 16px;
	overflow: hidden;
}

@media (max-width: 767px) {
	.account-address-book-default-modal {
		.account-address-book-default-modal-body {
			padding: 20px;

			.account-address-book-default-modal-list {
				.account-address-book-default-modal-card {
					.account-address-book-default-modal-card-body {
						flex-direction: column;
						align-items: stretch;

						.account-address-book-default-modal-card-footer {
							justify-content: flex-start;
						}
					}
				}
			}
		}
	}
}
</style>