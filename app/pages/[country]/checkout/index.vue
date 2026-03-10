<script setup lang="ts">
definePageMeta({
	layout: 'checkout',
});

const userStore = useUserStore();
const authToken = useCookie<string | null>('auth_token', {
	default: () => null,
	sameSite: 'lax',
	path: '/',
});
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
	Boolean(userStore.email || mockUser.value?.email || authToken.value)
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