<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import { provideOrderDetail } from '~/composables/orders/context/useOrderDetailContext';
import { provideOrdersList } from '~/composables/orders/context/useOrdersListContext';
import { provideUploadArtworkModal } from '~/composables/features/account/orders/context/useUploadArtworkModalContext';
import { useUserOrdersPage } from '~/composables/orders/useUserOrdersPage';
import { useUsersStore } from '~/stores/users/users.store';


withDefaults(defineProps<{
	embedded?: boolean;
}>(), {
	embedded: false,
});

const { is_loading, has_any_orders } = provideOrdersList()
const { selected_id, fetchItems } = provideOrderDetail()
provideUploadArtworkModal({ selected_id, fetchItems })
useUserOrdersPage()

const users_store = useUsersStore()
const { role_code } = storeToRefs(users_store)

</script>

<template>
	<section class="account-page" data-testid="account-orders-page">
		<MuLinearWrapper v-if="is_loading || has_any_orders" :class="['account-page-content',{ 'member' : role_code == 'MEMBER' }]" data-testid="account-page-content" direction="column" :gap="24">
			<FeaturesAccountOrdersHeader v-if="role_code == 'MEMBER'"/>
			<FeaturesAccountOrdersContent />


			<FeaturesAccountOrdersModalsUploadArworkModal />
			<FeaturesAccountOrdersModalsReplaceArtwork />
			<FeaturesAccountOrdersModalsRequestChanges />
			<FeaturesAccountOrdersModalsApproveFinalProof />
			<FeaturesAccountOrdersModalsArtworkDetailModal />
			<FeaturesAccountOrdersModalsFinalProofTerms />
		</MuLinearWrapper>
		<MuLinearWrapper v-else class="account-page-no-content" data-testid="account-page-no-content" direction="column" :gap="24">
			<FeaturesAccountOrdersNoContent />
		</MuLinearWrapper>
	</section>
</template>

<style scoped lang="scss">
.account-page-content{
	&.member {
		padding: 40px 0;
	}
}
.account-page-no-content{
	padding: 168px 0;
}
</style>