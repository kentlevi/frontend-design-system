<script setup lang="ts">
import { useUsersStore } from '~/stores/users/users.store';

definePageMeta({
	layout: 'checkout',
});

const userStore = useUsersStore();
const guestLoginMode = useCookie<string | number | null>('guest_login_mode', {
	default: () => null,
	sameSite: 'lax',
	path: '/',
});
const mockUser = useCookie<{ email?: string } | null>('mock_user', {
	default: () => null,
	sameSite: 'lax',
	path: '/',
});

const hasMemberIdentity = computed(() =>
	Boolean(userStore.state.email || mockUser.value?.email)
);

const isMemberCheckout = computed(() => {
	if (String(guestLoginMode.value ?? '') === '1') return false;
	return hasMemberIdentity.value;
});
</script>

<template>
	<CheckoutMemberPage v-if="isMemberCheckout" />
	<CheckoutGuestPage v-else />
</template>