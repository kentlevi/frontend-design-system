<script setup lang="ts">
import type { Ref } from 'vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';

type AddressBookUI = {
	translate: (key: string) => string;
	is_loading: Ref<boolean>;
	has_addresses: Ref<boolean>;
	handleOpenAddModal: () => void;
}

const {
	translate,
	is_loading,
	has_addresses,
	handleOpenAddModal,
} = inject<AddressBookUI>('addressBook:ui')!
</script>

<template>
	<MuLinearWrapper
		class="account-address-book-header"
		data-testid="account-address-book-header"
		justify="space-between"
		align="center"
	>
		<MuHeading variant="4" weight="bold" data-testid="account-address-book-title">
			{{ translate('account.addressBook.title') }}
		</MuHeading>
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
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
@media (max-width: 980px) {
	.account-address-book-header {
		align-items: flex-start !important;
		flex-direction: column !important;
	}
}
</style>