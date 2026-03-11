<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY } from '~/data/home/onboarding';

const { t } = useI18n();
const route = useRoute();
const is_visible = ref(false);
let hide_toast_timer: ReturnType<typeof setTimeout> | null = null;
let show_toast_timer: ReturnType<typeof setTimeout> | null = null;
const SHOW_TOAST_DELAY_MS = 320;

function clear_hide_toast_timer() {
	if (!hide_toast_timer) return;
	clearTimeout(hide_toast_timer);
	hide_toast_timer = null;
}

function clear_show_toast_timer() {
	if (!show_toast_timer) return;
	clearTimeout(show_toast_timer);
	show_toast_timer = null;
}

function show_toast() {
	clear_show_toast_timer();
	clear_hide_toast_timer();
	show_toast_timer = setTimeout(() => {
		is_visible.value = true;
		show_toast_timer = null;
		hide_toast_timer = setTimeout(() => {
			is_visible.value = false;
			hide_toast_timer = null;
		}, 5000);
	}, SHOW_TOAST_DELAY_MS);
}

function consume_pending_login_success_toast() {
	if (!import.meta.client) return;
	const is_pending =
		window.localStorage.getItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY) === '1';
	if (!is_pending) return;

	show_toast();
	window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
}

onMounted(() => {
	consume_pending_login_success_toast();
});

watch(
	() => route.fullPath,
	() => {
		consume_pending_login_success_toast();
	}
);

onBeforeUnmount(() => {
	clear_show_toast_timer();
	clear_hide_toast_timer();
});
</script>

<template>
	<UiToast
		:visible="is_visible"
		tone="primary"
		:message="t('home.loginSuccess')"
		variant="outlined"
		data-testid="layout-login-success-toast"
		@close="is_visible = false"
	/>
</template>