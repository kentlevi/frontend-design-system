<script setup lang="ts">
import { useAccountAddressBook } from '~/composables/account/addressBook/useAccountAddressBook';
import AddressBookCard from './AddressBookCard.vue';

const { t } = useI18n();
const { items_by_section } = useAccountAddressBook();

const primary_sections = computed(() => items_by_section.value.filter((group) => group.section !== 'dropShipping'));
const drop_shipping_sections = computed(() => items_by_section.value.filter((group) => group.section === 'dropShipping'));
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
					>
						{{ t('account.addressBook.addNew') }}
					</UiButton>
				</header>

				<div class="account-address-book-sections" data-testid="account-address-book-sections">
					<div class="account-address-book-primary-group">
						<section
							v-for="group in primary_sections"
							:key="group.section"
							class="account-profile-section"
							:data-testid="`account-address-book-section-${group.section}`"
						>
							<div class="account-profile-section-copy" data-testid="account-address-book-info">
								<h2 class="account-profile-section-title">
									{{ t(`account.addressBook.${group.section}Title`) }}
								</h2>
								<p class="account-profile-section-description">
									{{ t(`account.addressBook.${group.section}Description`) }}
								</p>
							</div>

							<div class="account-profile-section-main" data-testid="account-address-book-list">
								<div class="account-address-book-card-grid">
									<AddressBookCard
										v-for="(item, index) in group.items"
										:key="`${group.section}-${item.name}-${index}`"
										:item="item"
										:section="group.section"
										:index="index"
									/>
								</div>
							</div>
						</section>
					</div>

					<div class="account-address-book-drop-group">
						<section
							v-for="group in drop_shipping_sections"
							:key="group.section"
							class="account-profile-section"
							:data-testid="`account-address-book-section-${group.section}`"
						>
							<div class="account-profile-section-copy" data-testid="account-address-book-info">
								<h2 class="account-profile-section-title">
									{{ t(`account.addressBook.${group.section}Title`) }}
								</h2>
								<p class="account-profile-section-description">
									{{ t(`account.addressBook.${group.section}Description`) }}
								</p>
							</div>

							<div class="account-profile-section-main" data-testid="account-address-book-list">
								<div class="account-address-book-card-grid">
									<AddressBookCard
										v-for="(item, index) in group.items"
										:key="`${group.section}-${item.name}-${index}`"
										:item="item"
										:section="group.section"
										:index="index"
									/>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
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

	.account-address-book-card-grid {
		display: grid;
		gap: 16px;
	}
}

@media (max-width: 980px) {
	.account-address-book-header {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>