<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';

const { t: translate } = useI18n();
const { withCountry } = useCountry();
const route = useRoute();
const guest_login_mode = useCookie<string | number | null>('guest_login_mode', {
	default: () => null,
	sameSite: 'lax',
	path: '/',
});
const is_visible = ref(false);
const toast_kind = ref<'member' | 'guest' | 'checkout'>('member');
let hide_toast_timer: ReturnType<typeof setTimeout> | null = null;
let show_toast_timer: ReturnType<typeof setTimeout> | null = null;
const SHOW_TOAST_DELAY_MS = 120;
const HIDE_TOAST_DELAY_MS = 5000;
const guest_register_path = computed(() => withCountry('/auth/register'));
const is_guest_session = computed(() => String(guest_login_mode.value ?? '') === '1');

function clearHideToastTimer() {
	if (!hide_toast_timer) return;
	clearTimeout(hide_toast_timer);
	hide_toast_timer = null;
}

function clearShowToastTimer() {
	if (!show_toast_timer) return;
	clearTimeout(show_toast_timer);
	show_toast_timer = null;
}

function showToast(kind: 'member' | 'guest' | 'checkout') {
	clearShowToastTimer();
	clearHideToastTimer();
	show_toast_timer = setTimeout(() => {
		toast_kind.value = kind;
		is_visible.value = true;
		show_toast_timer = null;
		hide_toast_timer = setTimeout(() => {
			is_visible.value = false;
			hide_toast_timer = null;
		}, HIDE_TOAST_DELAY_MS);
	}, SHOW_TOAST_DELAY_MS);
}

function consumePendingLoginSuccessToast() {
	if (!import.meta.client) return;
	const pending_value = window.localStorage.getItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
	const is_member_pending = !!pending_value;
	const is_guest_pending =
		window.localStorage.getItem(GUEST_LOGIN_TOAST_PENDING_KEY) === '1';
	if (!is_member_pending && !is_guest_pending) return;

	window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
	window.localStorage.removeItem(GUEST_LOGIN_TOAST_PENDING_KEY);

	if (is_guest_pending || is_guest_session.value) {
		showToast('guest');
	} else if (pending_value === 'checkout') {
		showToast('checkout');
	} else {
		showToast('member');
	}
}

onMounted(() => {
	consumePendingLoginSuccessToast();
	if (import.meta.client) {
		window.addEventListener(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT, consumePendingLoginSuccessToast);
	}
});

watch(
	() => route.fullPath,
	() => {
		consumePendingLoginSuccessToast();
	}
);

onBeforeUnmount(() => {
	if (import.meta.client) {
		window.removeEventListener(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT, consumePendingLoginSuccessToast);
	}
	clearShowToastTimer();
	clearHideToastTimer();
});
</script>

<template>
	<UiToast
		:visible="is_visible"
		tone="primary"
		:message="
			toast_kind === 'guest'
				? ''
				: toast_kind === 'checkout'
					? translate('checkout.member.loginSuccess')
					: translate('home.loginSuccess')
		"
		variant="outlined"
		class="layout-login-toast"
		data-testid="layout-login-success-toast"
		@close="is_visible = false"
	>
		<template v-if="toast_kind === 'guest'">
			{{ translate('home.guestToastPrefix') }}
			<NuxtLink :to="guest_register_path" class="layout-login-toast-link">
				<strong class="layout-login-toast-link-text">{{ translate('home.guestToastCta') }}</strong>
			</NuxtLink>
			{{ translate('home.guestToastSuffix') }}
		</template>
	</UiToast>
</template>

<style lang="scss">
.layout-login-toast {
	.layout-login-toast-link {
		color: inherit;
		display: inline;
	}

	.layout-login-toast-link-text {
		display: inline;
		font-weight: var(--font-weight-bold);
		font-style: normal;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 2px;
	}
}
</style>