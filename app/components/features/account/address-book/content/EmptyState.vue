<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';

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
	<MuLinearWrapper
		class="account-address-book-empty-state"
		data-testid="account-address-book-empty-state"
		direction="column"
		align="center"
		:gap="24"
	>
		<div class="account-address-book-empty-state-icon">
			<img
				src="/icons/custom/account/address-empty-state.svg"
				alt=""
				class="account-address-book-empty-state-icon-image"
			>
		</div>
		<MuLinearWrapper
			class="account-address-book-empty-state-content"
			direction="column"
			align="center"
			:gap="40"
		>
			<MuLinearWrapper
				class="account-address-book-empty-state-copy"
				direction="column"
				align="center"
				:gap="16"
			>
				<MuHeading variant="3" class="account-address-book-empty-state-title" weight="semi-bold">
					{{ translate('account.addressBook.emptyTitle') }}
				</MuHeading>
				<i18n-t
					keypath="account.addressBook.emptyDescription"
					tag="p"
					class="account-address-book-empty-state-description"
				>
					<template #action>
						<strong>"{{ translate('account.addressBook.addAddressLabel') }}"</strong>
					</template>
				</i18n-t>
			</MuLinearWrapper>
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
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-address-book-empty-state {
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
		.account-address-book-empty-state-copy {
			.account-address-book-empty-state-title {
				font-size: var(--type-size-300);
				line-height: var(--type-line-300);
			}

			.account-address-book-empty-state-description {
				max-width: 480px;
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
