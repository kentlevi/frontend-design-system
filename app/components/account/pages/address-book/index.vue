<script setup lang="ts">
import { useAccountAddressBook } from '~/composables/account/addressBook/useAccountAddressBook';
import AddressBookAddModal from './AddressBookAddModal.vue';
import AddressBookSection from './AddressBookSection.vue';

const { t } = useI18n();
const { items_by_section } = useAccountAddressBook();
const is_add_modal_open = ref(false);

const primary_sections = computed(() => items_by_section.value.filter((group) => group.section !== 'dropShipping'));
const drop_shipping_sections = computed(() => items_by_section.value.filter((group) => group.section === 'dropShipping'));

function openAddModal() {
	is_add_modal_open.value = true;
}
</script>

<template>
	<section class="account-page" data-testid="account-address-book-page">
		<AccountShell active-tab="address-book">
			<div class="account-content" data-testid="account-address-book-content">
				<header class="account-address-book-header" data-testid="account-address-book-header">
					<h1 class="account-address-book-title" data-testid="account-address-book-title">
						{{ t('account.addressBook.title') }}
					</h1>
					<UiButton
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

				<div class="account-address-book-sections" data-testid="account-address-book-sections">
					<div class="account-address-book-primary-group">
						<AddressBookSection
							v-for="group in primary_sections"
							:key="group.section"
							:section="group.section"
							:items="group.items"
						/>
					</div>

					<div class="account-address-book-drop-group">
						<AddressBookSection
							v-for="group in drop_shipping_sections"
							:key="group.section"
							:section="group.section"
							:items="group.items"
						/>
					</div>
				</div>
			</div>

			<AddressBookAddModal v-model="is_add_modal_open" />
		</AccountShell>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);

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
}

@media (max-width: 980px) {
	.account-address-book-header {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>