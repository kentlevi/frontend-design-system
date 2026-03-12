import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { FlagCode } from '~/data/ui/flags';
import type { SupportedCountry } from '~/constants/countries';
import { isSupportedCountry } from '~/constants/countries';
import {
	headerAccountLinkConfig,
	headerLocaleOptionConfig,
	headerNavLinkConfig,
} from '~/data/layout/header';
import { useCountry } from '~/composables/app/country/useCountry';
import { useUserStore } from '~/stores/user';
import { normalizeAppPath } from '~/utils/auth/redirect';

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
	const api = useApi();
	const { withCountry, apiCountry, country } = useCountry();
	const user_store = useUserStore();

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
		headerNavLinkConfig.map((item) => ({
			...item,
			label: t(item.labelKey),
			to: withCountry(item.to),
		}))
	);

	const selected_locale = computed<FlagCode>(() => country.value as FlagCode);

	const locale_options = computed(() =>
		headerLocaleOptionConfig.map((option) => ({
			code: option.code,
			flagCode: option.flagCode,
			label: t(option.labelKey),
		}))
	);

	const account_links = computed(() =>
		headerAccountLinkConfig.map((item) => ({
			...item,
			label: t(item.labelKey),
			to: item.to,
		}))
	);

	const has_member_identity = computed(() =>
		Boolean(auth_token.value || user_store.email || mock_user.value?.email?.trim())
	);
	const is_mock_logged_in = computed(
		() => has_member_identity.value && String(guest_login_mode.value || '') !== '1'
	);
	const is_guest_logged_in = computed(
		() => String(guest_login_mode.value || '') === '1' && !is_mock_logged_in.value
	);

	const display_name = computed(() => {
		const mock_first_name = mock_user.value?.firstName?.trim() || '';
		const mock_last_name = mock_user.value?.lastName?.trim() || '';
		const onboarding_first_name = user_store.onboardingProfile?.firstName?.trim() || '';
		const onboarding_last_name = user_store.onboardingProfile?.lastName?.trim() || '';
		const profile_name = [onboarding_first_name, onboarding_last_name]
			.filter(Boolean)
			.join(' ')
			.trim();
		const mock_name = [mock_first_name, mock_last_name].filter(Boolean).join(' ').trim();

		if (profile_name) return profile_name;
		if (mock_name) return mock_name;
		if (display_email.value) return display_email.value;
		return t('layout.header.account');
	});

	const display_email = computed(() => {
		return (
			user_store.email ||
			mock_user.value?.email?.trim() ||
			user_store.onboardingProfile?.email?.trim() ||
			''
		);
	});

	const user_initial = computed(() => {
		const source_name = display_name.value.trim();
		if (!source_name) return 'MU';

		const initials = source_name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part.charAt(0).toUpperCase())
			.join('');

		return initials || source_name.charAt(0).toUpperCase() || 'MU';
	});

	const account_transition_name = computed(() =>
		is_mock_logged_in.value || is_guest_logged_in.value
			? 'account-dropdown'
			: 'account-dropdown-guest'
	);

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

		void api(`/${apiCountry.value}/auth/logout`, {
			method: 'POST',
		}).catch(() => {
			// Ignore logout request failures and keep local sign-out immediate.
		});

		auth_token.value = null;
		guest_login_mode.value = null;
		mock_user.value = null;
		user_store.clearUser();
		user_store.clearOnboardingProfile();
		await navigateTo(withCountry('/'));
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
		accountOpen: account_open,
		accountMenuRef: account_menu_ref,
		localeModalOpen: locale_modal_open,
		navLinks: nav_links,
		selectedLocale: selected_locale,
		localeOptions: locale_options,
		accountLinks: account_links,
		isMockLoggedIn: is_mock_logged_in,
		isGuestLoggedIn: is_guest_logged_in,
		userInitial: user_initial,
		userAvatarUrl: user_avatar_url,
		displayName: display_name,
		displayEmail: display_email,
		accountTransitionName: account_transition_name,
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