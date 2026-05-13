<script setup lang="ts">
type AddressBookUI = {
	translate: (key: string) => string;
	handleOpenAddModal: () => void;
}

const {
	translate,
	handleOpenAddModal,
} = inject<AddressBookUI>('addressBook:ui')!
</script>

<template>
	<section
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
</template>

<style scoped lang="scss">
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

@media (max-width: 980px) {
	.account-address-book-empty-state {
		min-height: 320px;
		padding-inline: 0;
	}
}
</style>
