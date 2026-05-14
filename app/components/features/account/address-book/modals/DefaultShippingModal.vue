<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
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
			<MuLinearWrapper
				class="account-address-book-default-modal-body"
				direction="column"
				:gap="24"
			>
				<MuText color="text-secondary" class="account-address-book-default-modal-description">
					{{ default_selection_description }}
				</MuText>

				<MuLinearWrapper
					class="account-address-book-default-modal-list"
					direction="column"
					:gap="16"
				>
					<label
						v-for="address in replacement_addresses"
						:key="address.id"
						class="account-address-book-default-modal-card"
						:data-selected="selected_address_id === address.id"
					>
						<MuLinearWrapper
							class="account-address-book-default-modal-card-head"
							align="center"
							:gap="12"
						>
							<UiRadio
								v-model="selected_address_id"
								:value="address.id"
								name="default-shipping-address"
								class="account-address-book-default-modal-radio"
							/>
							<MuHeading variant="6" weight="semi-bold" color="text-primary" class="account-address-book-default-modal-card-name">
								{{ address.contact_name }}
							</MuHeading>
						</MuLinearWrapper>

						<MuLinearWrapper
							class="account-address-book-default-modal-card-body"
							justify="space-between"
							align="center"
							:gap="24"
						>
							<MuLinearWrapper
								v-if="shippingPhoneNumber(address) || buildAddressLines(address).trim() || address.company"
								class="account-address-book-default-modal-card-copy"
								direction="column"
							>
								<MuText v-if="shippingPhoneNumber(address)" weight="semi-bold" color="text-primary" class="account-address-book-default-modal-card-phone">
									{{ shippingPhoneNumber(address) }}
								</MuText>
								<MuText v-if="buildAddressLines(address).trim()" color="text-secondary" class="account-address-book-default-modal-card-address">
									{{ buildAddressLines(address) }}
								</MuText>
								<MuText v-if="address.company" color="text-secondary" class="account-address-book-default-modal-card-company">
									{{ address.company }}
								</MuText>
							</MuLinearWrapper>
							<MuLinearWrapper
								class="account-address-book-default-modal-card-footer"
								align="center"
								:gap="16"
							>
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
							</MuLinearWrapper>
						</MuLinearWrapper>
					</label>
				</MuLinearWrapper>
			</MuLinearWrapper>
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
		.account-address-book-default-modal-list {
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
					padding: 12px 20px;
					border-bottom: 1px solid var(--gray-20);

					.account-address-book-default-modal-card-name {
						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
					}
				}

				.account-address-book-default-modal-card-body {
					padding: 12px 20px;

					.account-address-book-default-modal-card-footer {
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
						flex-direction: column !important;
						align-items: stretch !important;

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