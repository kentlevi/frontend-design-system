<script setup lang="ts">
import type { Ref } from 'vue';
import type { AddressType } from '~/types/user-address';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';

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
	<MuLinearWrapper
		v-if="has_addresses || is_loading"
		class="account-address-book-sections"
		data-testid="account-address-book-sections"
		direction="column"
		:gap="56"
	>
		<MuLinearWrapper
			class="account-address-book-primary-group"
			direction="column"
			:gap="32"
		>
			<FeaturesAccountAddressBookContentSection
				v-for="(section, index) in sections"
				:key="index"
				:section="section.section"
			/>
		</MuLinearWrapper>
	</MuLinearWrapper>

	<FeaturesAccountAddressBookContentEmptyState v-else />
</template>