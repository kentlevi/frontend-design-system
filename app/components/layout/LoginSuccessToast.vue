<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';

const { t } = useI18n();
const { withCountry } = useCountry();
const route = useRoute();
const guest_login_mode = useCookie<string | number | null>('guest_login_mode', {
	default: () => null,
	sameSite: 'lax',
	path: '/',
});
const is_visible = ref(false);
const toast_kind = ref<'member' | 'guest'>('member');
let hide_toast_timer: ReturnType<typeof setTimeout> | null = null;
let show_toast_timer: ReturnType<typeof setTimeout> | null = null;
const SHOW_TOAST_DELAY_MS = 320;
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

function showToast(kind: 'member' | 'guest') {
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
	const is_member_pending =
		window.localStorage.getItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY) === '1';
	const is_guest_pending =
		window.localStorage.getItem(GUEST_LOGIN_TOAST_PENDING_KEY) === '1';
	if (!is_member_pending && !is_guest_pending) return;

	window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
	window.localStorage.removeItem(GUEST_LOGIN_TOAST_PENDING_KEY);
	showToast(is_guest_pending || is_guest_session.value ? 'guest' : 'member');
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
		:tone="toast_kind === 'guest' ? 'warning' : 'primary'"
		:message="toast_kind === 'guest' ? '' : t('home.loginSuccess')"
		variant="outlined"
		class="layout-login-toast"
		data-testid="layout-login-success-toast"
		@close="is_visible = false"
	>
		<template v-if="toast_kind === 'guest'">
			<span class="layout-login-toast__message">
				You're currently using a guest account.
				<NuxtLink :to="guest_register_path" class="layout-login-toast__link">
					Create an Account
				</NuxtLink>
				to access all features.
			</span>
		</template>
	</UiToast>
</template>

<style lang="scss">
.layout-login-toast {
	&.ui-toast[data-tone='warning'] {
		background: #f8df4f;
		color: #111827;
		border: 2px solid #111827;
		box-shadow: 4px 4px 0 rgba(17, 24, 39, 0.95);
	}

	.layout-login-toast__message {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 4px;
		align-items: center;
	}

	.layout-login-toast__link {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 2px;
		font-weight: var(--font-weight-bold);
	}
}
</style>