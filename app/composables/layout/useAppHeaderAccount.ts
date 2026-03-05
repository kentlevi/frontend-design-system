import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { FlagCode } from '~/data/ui/flags';
import {
	type SupportedCountry,
	isSupportedCountry,
} from '~/constants/countries';
import {
	headerAccountLinkConfig,
	headerLocaleOptionConfig,
	headerNavLinkConfig,
} from '~/data/layout/header';
import { useCountry } from '~/composables/app/useCountry';
import { useUserStore } from '~/stores/user';

const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';

export function useAppHeaderAccount() {
	const { t, locale, setLocale } = useI18n();
	const route = useRoute();
	const { withCountry, apiCountry } = useCountry();
	const api = useApi();
	const userStore = useUserStore();
	const authToken = useCookie<string | null>('auth_token');
	const guestLoginMode = useCookie<string | number | null>('guest_login_mode', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});
	const mockUser = useCookie<{
		firstName: string;
		lastName: string;
		email: string;
	} | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});

	const accountOpen = ref(false);
	const accountPinnedOpen = ref(false);
	const accountMenuRef = ref<HTMLElement | null>(null);
	const localAvatarDataUrl = ref<string | null>(null);
	const localeModalOpen = ref(false);
	const navigationCategories = ref<
		Array<{
			id?: number | string;
			name?: string;
			url_slug?: string;
			sort?: number;
		}>
	>([]);
	const navigationLoaded = ref(false);

	function hasCoreNavigationSlugs() {
		const slugs = new Set(
			navigationCategories.value
				.map((item) => (item.url_slug || '').trim().replace(/^\/+|\/+$/g, ''))
				.filter(Boolean)
		);
		return (
			slugs.has('stickers') &&
			slugs.has('roll-stickers') &&
			slugs.has('sheet-stickers')
		);
	}

	const navLinks = computed(() =>
		navigationLoaded.value && hasCoreNavigationSlugs()
			? headerNavLinkConfig.map((item) => ({
				key: item.key,
				label: t(item.labelKey),
				to: withCountry(item.to),
			}))
			: headerNavLinkConfig.map((item) => ({
				key: item.key,
				label: t(item.labelKey),
				to: withCountry(item.to),
			}))
	);

	const selectedLocale = computed<FlagCode>(() =>
		locale.value === 'kr' ? 'kr' : 'us'
	);
	const localeOptions = computed(() =>
		headerLocaleOptionConfig.map((option) => ({
			code: option.code,
			flagCode: option.flagCode,
			label: t(option.labelKey),
		}))
	);
	const accountLinks = computed(() =>
		headerAccountLinkConfig.map((link) => ({
			to: link.to,
			icon: link.icon,
			label: t(link.labelKey),
		}))
	);
	const storeFieldValues = computed(
		() => userStore.profile?.user_field_values ?? []
	);
	function getFieldValueByKey(key: 'first_name' | 'last_name') {
		const legacyId = key === 'first_name' ? 1 : 2;
		const directMatch =
			storeFieldValues.value.find(
				(field) =>
					field.country_field?.field_key === key ||
                    (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === legacyId
			)?.value?.trim() || '';
		if (directMatch) return directMatch;

		const fallbackRows = [...storeFieldValues.value]
			.filter((field) => typeof field.value === 'string' && field.value.trim())
			.sort(
				(a, b) =>
					(a.country_field_id ?? a.country_field_ids ?? a.country_fields_id ?? Number.MAX_SAFE_INTEGER) -
                    (b.country_field_id ?? b.country_field_ids ?? b.country_fields_id ?? Number.MAX_SAFE_INTEGER)
			)
			.slice(0, 2);
		if (fallbackRows.length < 2) return '';
		return key === 'first_name'
			? (fallbackRows[0]?.value?.trim() || '')
			: (fallbackRows[1]?.value?.trim() || '');
	}
	const storeFirstName = computed(() =>
		getFieldValueByKey('first_name')
	);
	const storeLastName = computed(() =>
		getFieldValueByKey('last_name')
	);
	const emailLocalPart = computed(() => {
		const source = (userStore.email || mockUser.value?.email || '').trim();
		if (!source.includes('@')) return '';
		return source.split('@')[0] || '';
	});
	const resolvedFirstName = computed(
		() => storeFirstName.value || mockUser.value?.firstName || emailLocalPart.value || 'User'
	);
	const resolvedLastName = computed(
		() => storeLastName.value || mockUser.value?.lastName || ''
	);
	const resolvedEmail = computed(
		() => userStore.email || mockUser.value?.email || ''
	);
	const isMockLoggedIn = computed(() => Boolean(userStore.email || mockUser.value?.email));
	const isGuestLoggedIn = computed(() => {
		if (!isMockLoggedIn.value) return false;
		return String(guestLoginMode.value ?? '') === '1';
	});
	const userInitial = computed(() => {
		const first = resolvedFirstName.value.trim().charAt(0).toUpperCase();
		const last = resolvedLastName.value.trim().charAt(0).toUpperCase();
		return `${first || 'U'}${last || ''}`;
	});
	const displayName = computed(() =>
		[resolvedFirstName.value, resolvedLastName.value].filter(Boolean).join(' ').trim() || 'User'
	);
	const displayEmail = computed(() => resolvedEmail.value);
	const userAvatarUrl = computed(
		() => localAvatarDataUrl.value
	);
	const accountTransitionName = computed(() =>
		isMockLoggedIn.value ? 'account-dropdown' : 'account-dropdown-guest'
	);

	function normalizeNavPath(path: string) {
		const trimmed = path.replace(/\/+$/, '') || '/';
		const segments = trimmed.split('/').filter(Boolean);

		if (segments[0] && isSupportedCountry(segments[0])) {
			segments.shift();
		}

		return segments.length ? `/${segments.join('/')}` : '/';
	}

	function isNavLinkActive(linkPath: string) {
		const normalizedRoutePath = normalizeNavPath(route.path);
		const normalizedLinkPath = normalizeNavPath(linkPath);

		if (normalizedLinkPath === '/') {
			return normalizedRoutePath === '/';
		}

		return (
			normalizedRoutePath === normalizedLinkPath ||
            normalizedRoutePath.startsWith(`${normalizedLinkPath}/`)
		);
	}

	function toggleAccountMenu() {
		if (accountOpen.value && accountPinnedOpen.value) {
			closeAccountMenu();
			return;
		}

		accountPinnedOpen.value = true;
		accountOpen.value = true;
	}

	function closeAccountMenu() {
		accountPinnedOpen.value = false;
		accountOpen.value = false;
	}

	function onAccountMouseEnter() {
		accountOpen.value = true;
	}

	function onAccountMouseLeave() {
		if (accountPinnedOpen.value) return;
		accountOpen.value = false;
	}

	function openLocaleModal() {
		localeModalOpen.value = true;
		closeAccountMenu();
	}

	function closeLocaleModal() {
		localeModalOpen.value = false;
	}

	function selectLocale(code: SupportedCountry) {
		setLocale(code);
		closeLocaleModal();
	}

	async function logoutMock() {
		closeAccountMenu();

		try {
			await api(`/${apiCountry.value}/auth/logout`, {
				method: 'POST',
			});
		} catch {
			// Continue with local sign-out cleanup even if API logout fails.
		} finally {
			mockUser.value = null;
			authToken.value = null;
			guestLoginMode.value = null;
			userStore.clearUser();
			userStore.clearOnboardingProfile();
			await navigateTo(withCountry('/'));
		}
	}

	function onDocClick(event: MouseEvent) {
		const target = event.target as Node | null;
		if (!target) return;
		if (!accountMenuRef.value?.contains(target)) {
			closeAccountMenu();
		}
	}

	function syncLocalAvatarFromStorage() {
		if (!import.meta.client) return;
		localAvatarDataUrl.value = window.localStorage.getItem(ACCOUNT_LOCAL_AVATAR_KEY);
	}

	function onAvatarUpdated(event: Event) {
		const customEvent = event as CustomEvent<string | null>;
		const nextValue = customEvent.detail;
		if (typeof nextValue === 'string' || nextValue === null) {
			localAvatarDataUrl.value = nextValue;
			return;
		}
		syncLocalAvatarFromStorage();
	}

	async function fetchNavigationCategories() {
		try {
			const response = await api<{
				success?: boolean;
				data?: Array<{
					id?: number | string;
					name?: string;
					url_slug?: string;
					sort?: number;
				}>;
			}>(`/${apiCountry.value}/navigation/categories`);

			if (!response?.success || !Array.isArray(response.data)) {
				navigationLoaded.value = true;
				return;
			}

			navigationCategories.value = response.data;
			navigationLoaded.value = true;
		} catch {
			navigationLoaded.value = true;
		}
	}

	watch(
		() => route.fullPath,
		() => {
			closeAccountMenu();
			closeLocaleModal();
		}
	);

	watch(
		() => apiCountry.value,
		() => {
			void fetchNavigationCategories();
		},
		{ immediate: true }
	);

	onMounted(() => {
		document.addEventListener('click', onDocClick);
		syncLocalAvatarFromStorage();
		window.addEventListener('storage', syncLocalAvatarFromStorage);
		window.addEventListener(ACCOUNT_AVATAR_UPDATED_EVENT, onAvatarUpdated as EventListener);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('click', onDocClick);
		window.removeEventListener('storage', syncLocalAvatarFromStorage);
		window.removeEventListener(ACCOUNT_AVATAR_UPDATED_EVENT, onAvatarUpdated as EventListener);
	});

	return {
		accountOpen,
		accountMenuRef,
		localeModalOpen,
		navLinks,
		selectedLocale,
		localeOptions,
		accountLinks,
		isMockLoggedIn,
		isGuestLoggedIn,
		userInitial,
		userAvatarUrl,
		displayName,
		displayEmail,
		accountTransitionName,
		isNavLinkActive,
		toggleAccountMenu,
		closeAccountMenu,
		onAccountMouseEnter,
		onAccountMouseLeave,
		openLocaleModal,
		closeLocaleModal,
		selectLocale,
		logoutMock,
	};
}