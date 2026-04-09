import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { FlagCode } from '~/data/ui/flags';
import type { SupportedCountry } from '~/constants/countries';
import { isSupportedCountry } from '~/constants/countries';
import {
	header_account_link_config,
	header_locale_option_config,
	header_nav_link_config,
} from '~/data/layout/header';
import { useCountry } from '~/composables/app/country/useCountry';
import { useUsersStore } from '~/stores/users/users.store';
import { normalizeAppPath } from '~/utils/auth/redirect';
import { useAuthUser } from '~/composables/auth/useAuthUser';

const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const ACCOUNT_CLOSE_DELAY_MS = 120;

type MockUserCookie = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

export function useAppHeaderAccount() {
	const { t, setLocale } = useI18n();
	const route = useRoute();
	const { withCountry, country } = useCountry();
	const { state, auth_state_ready, auth_state_loading } = storeToRefs(useUsersStore());


	const preferred_locale = useCookie<SupportedCountry | null>('preferred_locale', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});
	const auth_token = useCookie<string | null>('auth_token');
	const guest_login_mode = useCookie<string | number | null>('guest_login_mode', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});
	const mock_user = useCookie<MockUserCookie | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});

	const account_open = ref(false);
	const locale_modal_open = ref(false);
	const account_menu_ref = ref<HTMLElement | null>(null);
	const user_avatar_url = ref<string | null>(null);
	const account_opened_by_click = ref(false);
	let account_close_timeout: ReturnType<typeof setTimeout> | null = null;

	const nav_links = computed(() =>
		header_nav_link_config.map((item) => ({
			...item,
			label: t(item.labelKey),
			to: withCountry(item.to),
		}))
	);

	const selected_locale = computed<FlagCode>(() => country.value as FlagCode);

	const locale_options = computed(() =>
		header_locale_option_config.map((option) => ({
			code: option.code,
			flagCode: option.flagCode,
			label: t(option.labelKey),
		}))
	);

	const account_links = computed(() =>
		header_account_link_config.map((item) => ({
			...item,
			label: t(item.labelKey),
			to: item.to,
		}))
	);

	const has_member_identity = computed(() =>
		Boolean(auth_token.value || state.value.email || mock_user.value?.email?.trim())
	);
	const has_auth_hint = computed(() =>
		Boolean(
			auth_token.value
			|| mock_user.value?.email?.trim()
			|| String(guest_login_mode.value || '') === '1'
		)
	);
	const is_mock_logged_in = computed(
		() => has_member_identity.value && String(guest_login_mode.value || '') !== '1'
	);
	const is_guest_logged_in = computed(
		() => String(guest_login_mode.value || '') === '1' && !is_mock_logged_in.value
	);

	const display_email = computed(() => {
		return (
			state.value.email ||
			mock_user.value?.email?.trim() ||
			state.value.onboardingProfile?.email?.trim() ||
			''
		);
	});

	const account_transition_name = computed(() =>
		is_mock_logged_in.value || is_guest_logged_in.value
			? 'account-dropdown'
			: 'account-dropdown-guest'
	);
	const header_account_ready = computed(() => {
		if (!import.meta.client) return false;
		if (auth_state_loading.value) return false;
		if (has_auth_hint.value) return auth_state_ready.value;
		return true;
	});
	const header_account_skeleton_count = computed(() => {
		if (!header_account_ready.value) return 2;
		if (is_mock_logged_in.value) return 2;
		if (String(guest_login_mode.value || '') === '1') return 1;
		if (auth_token.value || mock_user.value?.email?.trim()) return 2;
		return 1;
	});

	function clearAccountCloseTimeout() {
		if (!account_close_timeout) return;
		clearTimeout(account_close_timeout);
		account_close_timeout = null;
	}

	function closeAccountMenu() {
		clearAccountCloseTimeout();
		account_open.value = false;
		account_opened_by_click.value = false;
	}

	function toggleAccountMenu() {
		clearAccountCloseTimeout();

		if (account_open.value && !account_opened_by_click.value) {
			account_opened_by_click.value = true;
			return;
		}

		const next_open = !account_open.value;
		account_open.value = next_open;
		account_opened_by_click.value = next_open;
	}

	function openLocaleModal() {
		locale_modal_open.value = true;
	}

	function closeLocaleModal() {
		locale_modal_open.value = false;
	}

	function onAccountMouseEnter() {
		clearAccountCloseTimeout();
		if (!account_opened_by_click.value) {
			account_open.value = true;
		}
	}

	function onAccountMouseLeave() {
		if (account_opened_by_click.value) return;
		clearAccountCloseTimeout();
		account_close_timeout = setTimeout(() => {
			account_open.value = false;
		}, ACCOUNT_CLOSE_DELAY_MS);
	}

	function isNavLinkActive(path: string) {
		const current_path = normalizeAppPath(route.path);
		const target_path = normalizeAppPath(path);
		if (target_path === withCountry('/')) {
			return current_path === target_path;
		}

		return current_path === target_path || current_path.startsWith(`${target_path}/`);
	}

	async function selectLocale(next_locale: SupportedCountry) {
		if (!isSupportedCountry(next_locale)) return;

		const current_full_path = route.fullPath || `/${country.value}`;
		const normalized_current_path = current_full_path.startsWith('/')
			? current_full_path
			: `/${current_full_path}`;
		const next_path = normalized_current_path.replace(
			new RegExp(`^/${country.value}(?=/|$)`),
			`/${next_locale}`
		);

		preferred_locale.value = next_locale;
		await setLocale(next_locale);
		closeLocaleModal();

		if (next_locale !== country.value) {
			await navigateTo(next_path);
		}
	}

	async function logoutMock() {
		closeAccountMenu();
		await nextTick();

		const { logoutUser } = useAuthUser();
		await logoutUser();
	}

	function handleAvatarUpdated(event: Event) {
		const custom_event = event as CustomEvent<string | null>;
		user_avatar_url.value = custom_event.detail || null;
	}

	function handleDocumentClick(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (account_menu_ref.value?.contains(target)) return;
		closeAccountMenu();
	}

	onMounted(() => {
		if (!import.meta.client) return;

		user_avatar_url.value = window.localStorage.getItem(ACCOUNT_LOCAL_AVATAR_KEY);
		window.addEventListener(
			ACCOUNT_AVATAR_UPDATED_EVENT,
			handleAvatarUpdated as EventListener
		);
		document.addEventListener('click', handleDocumentClick);
	});

	onBeforeUnmount(() => {
		clearAccountCloseTimeout();
		if (!import.meta.client) return;

		window.removeEventListener(
			ACCOUNT_AVATAR_UPDATED_EVENT,
			handleAvatarUpdated as EventListener
		);
		document.removeEventListener('click', handleDocumentClick);
	});

	watch(
		() => route.fullPath,
		() => {
			closeAccountMenu();
			closeLocaleModal();
		}
	);

	return {
		account_open,
		account_menu_ref,
		locale_modal_open,
		nav_links,
		selected_locale,
		locale_options,
		account_links,
		is_mock_logged_in,
		is_guest_logged_in,
		user_avatar_url,
		display_email,
		account_transition_name,
		header_account_ready,
		header_account_skeleton_count,
		isNavLinkActive: isNavLinkActive,
		toggleAccountMenu: toggleAccountMenu,
		closeAccountMenu: closeAccountMenu,
		onAccountMouseEnter: onAccountMouseEnter,
		onAccountMouseLeave: onAccountMouseLeave,
		openLocaleModal: openLocaleModal,
		closeLocaleModal: closeLocaleModal,
		selectLocale: selectLocale,
		logoutMock: logoutMock,
	};
}