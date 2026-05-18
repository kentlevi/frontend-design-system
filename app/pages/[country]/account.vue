<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUsersStore } from '~/stores/users/users.store';

import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import { useGetOverview } from '~/services/profile/overview.service';

const users_store = useUsersStore()
const { role_code } = storeToRefs(users_store)

definePageMeta({
	layout: 'home',
	footerVariant: 'compact',
});

const { getOverview } = useGetOverview()

onMounted(() => {
	getOverview()
})

</script>

<template>
	<MuLinearWrapper class="account-shell" direction="column" data-testid="account-shell">
		<FeaturesAccountTop v-if="role_code == 'MEMBER'" />
		<FeaturesAccountTabs v-if="role_code == 'MEMBER'"/>
		<NuxtPage :page-key="(route) => `${route.params.country ?? ''}::${route.name?.toString() ?? route.path}`" />
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-shell {
	max-width: 1200px;
	margin: 0 auto;
	padding: 40px 0 104px;
}
</style>