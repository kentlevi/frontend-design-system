<template>
	<MuLinearWrapper class="orders-content" :gap="24" align="flex-start">
		<FeaturesAccountOrdersContentSide v-if="role_code == 'MEMBER'" class="orders-side" />
		<FeaturesAccountOrdersContentMain class="orders-main" />
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import { useUsersStore } from '~/stores/users/users.store';

const users_store = useUsersStore();
const { role_code } = storeToRefs(users_store);
</script>

<style lang="scss" scoped>
.orders-side {
	width: 342px;
}
</style>