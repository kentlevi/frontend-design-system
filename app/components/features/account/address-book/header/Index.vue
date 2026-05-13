<script setup lang="ts">
import type { Ref } from 'vue';

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
	<header class="account-address-book-header" data-testid="account-address-book-header">
		<h1 class="account-address-book-title" data-testid="account-address-book-title">
			{{ translate('account.addressBook.title') }}
		</h1>
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
	</header>
</template>

<style scoped lang="scss">
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

@media (max-width: 980px) {
	.account-address-book-header {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>
