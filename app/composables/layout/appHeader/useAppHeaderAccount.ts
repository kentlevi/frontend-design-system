import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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

	const is_mock_logged_in = computed(() => Boolean(auth_token.value));
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

	function clear_account_close_timeout() {
		if (!account_close_timeout) return;
		clearTimeout(account_close_timeout);
		account_close_timeout = null;
	}

	function close_account_menu() {
		clear_account_close_timeout();
		account_open.value = false;
		account_opened_by_click.value = false;
	}

	function toggle_account_menu() {
		clear_account_close_timeout();

		if (account_open.value && !account_opened_by_click.value) {
			account_opened_by_click.value = true;
			return;
		}

		const next_open = !account_open.value;
		account_open.value = next_open;
		account_opened_by_click.value = next_open;
	}

	function open_locale_modal() {
		locale_modal_open.value = true;
	}

	function close_locale_modal() {
		locale_modal_open.value = false;
	}

	function on_account_mouse_enter() {
		clear_account_close_timeout();
		if (!account_opened_by_click.value) {
			account_open.value = true;
		}
	}

	function on_account_mouse_leave() {
		if (account_opened_by_click.value) return;
		clear_account_close_timeout();
		account_close_timeout = setTimeout(() => {
			account_open.value = false;
		}, ACCOUNT_CLOSE_DELAY_MS);
	}

	function is_nav_link_active(path: string) {
		return normalizeAppPath(route.path) === normalizeAppPath(path);
	}

	async function select_locale(next_locale: SupportedCountry) {
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
		close_locale_modal();

		if (next_locale !== country.value) {
			await navigateTo(next_path);
		}
	}

	async function logout_mock() {
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
		close_account_menu();
		await navigateTo(withCountry('/'));
	}

	function handle_avatar_updated(event: Event) {
		const custom_event = event as CustomEvent<string | null>;
		user_avatar_url.value = custom_event.detail || null;
	}

	function handle_document_click(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (account_menu_ref.value?.contains(target)) return;
		close_account_menu();
	}

	onMounted(() => {
		if (!import.meta.client) return;

		user_avatar_url.value = window.localStorage.getItem(ACCOUNT_LOCAL_AVATAR_KEY);
		window.addEventListener(
			ACCOUNT_AVATAR_UPDATED_EVENT,
			handle_avatar_updated as EventListener
		);
		document.addEventListener('click', handle_document_click);
	});

	onBeforeUnmount(() => {
		clear_account_close_timeout();
		if (!import.meta.client) return;

		window.removeEventListener(
			ACCOUNT_AVATAR_UPDATED_EVENT,
			handle_avatar_updated as EventListener
		);
		document.removeEventListener('click', handle_document_click);
	});

	watch(
		() => route.fullPath,
		() => {
			close_account_menu();
			close_locale_modal();
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
		isNavLinkActive: is_nav_link_active,
		toggleAccountMenu: toggle_account_menu,
		closeAccountMenu: close_account_menu,
		onAccountMouseEnter: on_account_mouse_enter,
		onAccountMouseLeave: on_account_mouse_leave,
		openLocaleModal: open_locale_modal,
		closeLocaleModal: close_locale_modal,
		selectLocale: select_locale,
		logoutMock: logout_mock,
	};
}