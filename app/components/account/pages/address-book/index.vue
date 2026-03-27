<script setup lang="ts">
import { useAccountAddressBook } from '~/composables/account/addressBook/useAccountAddressBook';
import AddressBookSection from './AddressBookSection.vue';
import AddressBookAddModal from './AddressBookAddModal.vue';

withDefaults(defineProps<{
	embedded?: boolean;
}>(), {
	embedded: false,
});

const { t } = useI18n();

const {
	shipping_address,
	billing_address,
	drop_address,

	is_add_modal_open,

	getAddresses,
	openAddModal
} = useAccountAddressBook()

const has_addresses = computed(() => {
	return shipping_address.value.length > 0
		|| billing_address.value.length > 0
		|| drop_address.value.length > 0
})

onMounted(() => {
	getAddresses('shipping')
	getAddresses('billing')
	getAddresses('drop')
})
</script>

<template>
	<section class="account-page" data-testid="account-address-book-page">
		<AccountShellSection :embedded="embedded" active-tab="address-book">
			<div class="account-content" data-testid="account-address-book-content">
				<header class="account-address-book-header" data-testid="account-address-book-header">
					<h1 class="account-address-book-title" data-testid="account-address-book-title">
						{{ t('account.addressBook.title') }}
					</h1>
					<UiButton
						v-if="has_addresses"
						variant="filled"
						tone="neutral"
						size="md"
						icon="regular-plus"
						icon-position="left"
						data-testid="account-address-book-add-button"
						@click="openAddModal"
					>
						{{ t('account.addressBook.addNew') }}
					</UiButton>
				</header>

				<div
					v-if="has_addresses"
					class="account-address-book-sections"
					data-testid="account-address-book-sections"
				>
					<div class="account-address-book-primary-group">
						<AddressBookSection
							section="shipping"
							:items="shipping_address"
						/>
						<AddressBookSection
							section="billing"
							:items="billing_address"
						/>
						<AddressBookSection
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
					<h2 class="account-address-book-empty-state-title">
						{{ t('account.addressBook.emptyTitle') }}
					</h2>
					<p class="account-address-book-empty-state-description">
						{{ t('account.addressBook.emptyDescription') }}
					</p>
					<UiButton
						variant="filled"
						tone="neutral"
						size="md"
						icon="regular-plus"
						icon-position="left"
						class="account-address-book-empty-state-button"
						data-testid="account-address-book-empty-add-button"
						@click="openAddModal"
					>
						{{ t('account.addressBook.addNew') }}
					</UiButton>
				</section>
			</div>

			<AddressBookAddModal v-model="is_add_modal_open" />
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
		gap: 24px;
	}

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
	}

	.account-address-book-primary-group {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.account-address-book-empty-state {
		min-height: 420px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 32px 16px 48px;
	}

	.account-address-book-empty-state-icon {
		display: grid;
		place-items: center;
		margin-bottom: 16px;
	}

	.account-address-book-empty-state-icon-image {
		display: block;
		width: 72px;
		height: 72px;
	}

	.account-address-book-empty-state-title {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
		margin-bottom: 12px;
	}

	.account-address-book-empty-state-description {
		max-width: 480px;
		font-size: var(--type-size-100);
		line-height: 1.8;
		color: var(--text-secondary);
		margin-bottom: 28px;
	}

	.account-address-book-empty-state-button {
		min-width: 164px;
	}
}

@media (max-width: 980px) {
	.account-address-book-header {
		align-items: flex-start;
		flex-direction: column;
	}

	.account-page {
		.account-address-book-empty-state {
			min-height: 320px;
			padding-inline: 0;
		}
	}
}
</style>