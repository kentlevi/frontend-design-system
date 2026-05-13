<script setup lang="ts">
import type { Ref } from 'vue';
import type { AddressType } from '~/types/user-address';

type AddressBookUI = {
	sections: Ref<{ section: AddressType }[]>;
	is_loading: Ref<boolean>;
	has_addresses: Ref<boolean>;
}

const {
	sections,
	is_loading,
	has_addresses,
} = inject<AddressBookUI>('addressBook:ui')!
</script>

<template>
	<div
		v-if="has_addresses || is_loading"
		class="account-address-book-sections"
		data-testid="account-address-book-sections"
	>
		<div class="account-address-book-primary-group">
			<FeaturesAccountAddressBookContentSection
				v-for="(section, index) in sections"
				:key="index"
				:section="section.section"
			/>
		</div>
	</div>

	<FeaturesAccountAddressBookContentEmptyState v-else />
</template>

<style scoped lang="scss">
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
</style>
