<script setup lang="ts">
import type { AddressMap, AddressType } from '~/types/address';
import { useAddressHelper } from '~/utils/address';

const { buildAddressLines, shippingPhoneNumber } = useAddressHelper()

const props = defineProps<{
	modelValue: boolean;
	addresses: AddressMap[AddressType][];
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'cancel'): void;
	(e: 'skip'): void;
	(e: 'save', type: AddressType, address_id: number): void;
}>();

const selected_address_id = ref<number | null>(null)

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

watch(() => props.modelValue, (is_open) => {
	if (is_open) {
		selected_address_id.value = null
	}
})

function closeModal() {
	emit('update:modelValue', false)
}

function cancelModal() {
	closeModal()
	emit('cancel')
}

function skipSelection() {
	closeModal()
	emit('skip')
}

function saveSelection() {
	if (selected_address_id.value === null) return

	closeModal()

	const selected_address = props.addresses.find((address) => address.id === selected_address_id.value)

	if (!selected_address) return

	emit('save', selected_address.type, selected_address_id.value)
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="center"
		padding="0"
		gap="0"
		width="710px"
		modal-class="account-address-book-default-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<section class="account-address-book-default-modal" data-testid="account-address-book-default-modal">
			<header class="account-address-book-default-modal-header">
				<h3 class="account-address-book-default-modal-title">
					Select New Default Shipping Address
				</h3>

				<button
					type="button"
					class="account-address-book-default-modal-close"
					aria-label="Close select default shipping address modal"
					data-testid="account-address-book-default-modal-close"
					@click="cancelModal"
				>
					<UiIcon name="regular-times" :size="24" />
				</button>
			</header>

			<div class="account-address-book-default-modal-body">
				<p class="account-address-book-default-modal-description">
					Your default shipping address has been deleted. Please select a new default address now, or you can choose one later.
				</p>

				<div class="account-address-book-default-modal-list">
					<label
						v-for="address in props.addresses"
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
							<p v-if="shippingPhoneNumber(address)" class="account-address-book-default-modal-card-phone">
								{{ shippingPhoneNumber(address) }}
							</p>
							<p class="account-address-book-default-modal-card-address">
								{{ buildAddressLines(address) }}
							</p>
							<div class="account-address-book-default-modal-card-footer">
								<span v-if="address.company" class="account-address-book-default-modal-card-company">
									{{ address.company }}
								</span>
								<UiBadge
									v-if="address.label"
									variant="tonal"
									tone="default"
									size="md"
									:bg-color="tag_badge_colors[address.label]?.bgColor || 'var(--gray-10)'"
									:text-color="tag_badge_colors[address.label]?.textColor || 'var(--gray-60)'"
								>
									{{ address.label.charAt(0).toUpperCase() + address.label.slice(1) }}
								</UiBadge>
							</div>
						</div>
					</label>
				</div>

				<footer class="account-address-book-default-modal-actions">
					<UiButton
						type="button"
						variant="ghost"
						tone="neutral"
						size="md"
						class="account-address-book-default-modal-cancel"
						@click="cancelModal"
					>
						Cancel
					</UiButton>

					<div class="account-address-book-default-modal-actions-right">
						<UiButton
							type="button"
							variant="ghost"
							tone="neutral"
							size="md"
							class="account-address-book-default-modal-skip"
							@click="skipSelection"
						>
							Skip &amp; Select Later
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
							Save
						</UiButton>
					</div>
				</footer>
			</div>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-address-book-default-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	width: 100%;

	.account-address-book-default-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 24px;
		border-bottom: 1px solid var(--gray-20);

		.account-address-book-default-modal-title {
			font-size: var(--type-size-300);
			line-height: var(--type-line-300);
			font-weight: var(--font-weight-bold);
			color: var(--text-primary);
		}

		.account-address-book-default-modal-close {
			display: grid;
			place-items: center;
			padding: 0;
			border: 0;
			background: transparent;
			cursor: pointer;
			color: var(--text-primary);
		}
	}

	.account-address-book-default-modal-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 28px 24px 24px;

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
					border-color: var(--border-strong);
					box-shadow: var(--shadow-sm);
				}

				.account-address-book-default-modal-card-head {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 18px 20px;
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
					flex-direction: column;
					gap: 8px;
					padding: 18px 20px;

					.account-address-book-default-modal-card-phone {
						color: var(--text-primary);
						font-size: var(--type-size-100);
						font-weight: var(--font-weight-semibold);
						line-height: var(--type-line-100);
					}

					.account-address-book-default-modal-card-address,
					.account-address-book-default-modal-card-company {
						color: var(--text-secondary);
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
					}

					.account-address-book-default-modal-card-footer {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 16px;
					}
				}
			}
		}

		.account-address-book-default-modal-actions {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			padding-top: 12px;

			.account-address-book-default-modal-actions-right {
				display: inline-flex;
				align-items: center;
				gap: 12px;

				.account-address-book-default-modal-save {
					min-width: 74px;
					border-radius: 18px;
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
						.account-address-book-default-modal-card-footer {
							flex-direction: column;
							align-items: stretch;
						}
					}
				}
			}

			.account-address-book-default-modal-actions,
			.account-address-book-default-modal-actions-right {
				flex-direction: column;
				align-items: stretch;
			}
		}
	}
}
</style>