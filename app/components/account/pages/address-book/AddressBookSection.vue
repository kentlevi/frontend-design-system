<script setup lang="ts">
import type { AddressMap, AddressType } from '~/types/address';
import AddressBookCard from './AddressBookCard.vue';

type SectionProps = {
	section: AddressType;
	items: AddressMap[AddressType][];
};

const props = defineProps<SectionProps>();

const { t } = useI18n();
</script>

<template>
	<section
		class="account-profile-section"
		:data-testid="`account-address-book-section-${props.section}`"
	>
		<div class="account-profile-section-copy" data-testid="account-address-book-info">
			<h2 class="account-profile-section-title">
				{{ t(`account.addressBook.${props.section}Title`) }}
			</h2>
			<p class="account-profile-section-description">
				{{ t(`account.addressBook.${props.section}Description`) }}
			</p>
		</div>

		<div class="account-profile-section-main" data-testid="account-address-book-list">
			<div class="account-address-book-card-grid">
				<AddressBookCard
					v-for="(item, index) in props.items"
					:key="`${props.section}-${item.id}-${index}`"
					:item="item"
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