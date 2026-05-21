<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import AddressBookSection from './AddressBookSection.vue';
import { useIndexUI } from '~/composables/account/addressBook/useIndexUI';
import { provideUserAddress } from '~/composables/account/addressBook/context/useUserAddressContext';

const AddressBookFormModal = defineAsyncComponent(
	() => import('./AddressBookFormModal.vue')
);
const AddressBookDeleteConfirmModal = defineAsyncComponent(
	() => import('./AddressBookDeleteConfirmModal.vue')
);
const AddressBookConfirmDefaultChangeModal = defineAsyncComponent(
	() => import('./AddressBookConfirmDefaultChangeModal.vue')
);
const AddressBookDefaultShippingModal = defineAsyncComponent(
	() => import('./AddressBookDefaultShippingModal.vue')
);

const {
	translate,

	sections,
	is_loading,
	has_addresses,

	handleOpenAddModal
} = useIndexUI()

provideUserAddress()

</script>

<template>
	<section class="account-page" data-testid="account-address-book-page">
		<div class="account-content" data-testid="account-address-book-content">
			<header class="account-address-book-header" data-testid="account-address-book-header">
				<h1 class="account-address-book-title" data-testid="account-address-book-title">
					{{ translate('account.addressBook.title') }}
				</h1>
				<UiSkeleton
					v-if="is_loading"
					width="164px"
					height="var(--space-2xl)"
					border-radius="var(--radius-xl)"
				/>
				<UiButton
					v-else-if="has_addresses"
					variant="filled"
					tone="neutral"
					size="md"
					icon="regular-plus"
					icon-size="24"
					icon-position="left"
					data-testid="account-address-book-add-button"
					@click="handleOpenAddModal"
				>
					{{ translate('account.addressBook.addNew') }}
				</UiButton>
			</header>

			<div
				v-if="has_addresses || is_loading"
				class="account-address-book-sections"
				data-testid="account-address-book-sections"
			>
				<div class="account-address-book-primary-group">
					<AddressBookSection
						v-for="(section, index) in sections"
						:key="index"
						:section="section.section"
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
						<i18n-t
							keypath="account.addressBook.emptyDescription"
							tag="p"
							class="account-address-book-empty-state-description"
						>
							<template #action>
								<strong>"{{ translate('account.addressBook.addAddressLabel') }}"</strong>
							</template>
						</i18n-t>
					</div>
					<UiButton
						variant="filled"
						tone="neutral"
						size="md"
						icon-size="24"
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
						font-weight: var(--font-weight-semibold);
						color: var(--text-primary);
					}

					.account-address-book-empty-state-description {
						max-width: 480px;
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						color: var(--text-secondary);
						white-space: pre-line;

						strong {
							color: var(--black-base);
						}
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