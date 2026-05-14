<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import FormModal from '~/components/features/account/address-book/modals/FormModal.vue';
import DeleteConfirmModal from '~/components/features/account/address-book/modals/DeleteConfirmModal.vue';
import ConfirmDefaultChangeModal from '~/components/features/account/address-book/modals/ConfirmDefaultChangeModal.vue';
import DefaultShippingModal from '~/components/features/account/address-book/modals/DefaultShippingModal.vue';
import { useIndexUI } from '~/composables/account/addressBook/useIndexUI';
import { provideUserAddress } from '~/composables/account/addressBook/context/useUserAddressContext';

provideUserAddress()

const {
	translate,
	sections,
	is_loading,
	has_addresses,
	handleOpenAddModal,
} = useIndexUI()

provide('addressBook:ui', {
	translate,
	sections,
	is_loading,
	has_addresses,
	handleOpenAddModal,
})
</script>

<template>
	<section class="account-page" data-testid="account-address-book-page">
		<MuLinearWrapper
			class="account-content"
			data-testid="account-address-book-content"
			direction="column"
			:gap="40"
		>
			<FeaturesAccountAddressBookHeader />
			<FeaturesAccountAddressBookContent />
		</MuLinearWrapper>

		<FormModal />
		<DeleteConfirmModal />
		<DefaultShippingModal />
		<ConfirmDefaultChangeModal />
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);

	.account-content {
		padding-top: 40px;
	}
}
</style>