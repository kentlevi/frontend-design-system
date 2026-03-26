<script setup lang="ts">
import type { AccountAddressBookItem, AddressSection } from '~/types/account/addressBook';
import AddressBookCard from './AddressBookCard.vue';

defineProps<{
	section: AddressSection;
	items: AccountAddressBookItem[];
}>();

const { t } = useI18n();
</script>

<template>
	<section
		class="account-profile-section"
		:data-testid="`account-address-book-section-${section}`"
	>
		<div class="account-profile-section-copy" data-testid="account-address-book-info">
			<h2 class="account-profile-section-title">
				{{ t(`account.addressBook.${section}Title`) }}
			</h2>
			<p class="account-profile-section-description">
				{{ t(`account.addressBook.${section}Description`) }}
			</p>
		</div>

		<div class="account-profile-section-main" data-testid="account-address-book-list">
			<div class="account-address-book-card-grid">
				<AddressBookCard
					v-for="(item, index) in items"
					:key="`${section}-${item.name}-${index}`"
					:item="item"
					:section="section"
					:index="index"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.account-address-book-card-grid {
	display: grid;
	gap: 16px;
}
</style>