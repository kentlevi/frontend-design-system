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

export function useAppHeaderAccount() {
    const { t, locale, setLocale } = useI18n();
    const route = useRoute();
    const { withCountry, apiCountry } = useCountry();
    const api = useApi();
    const userStore = useUserStore();
    const authToken = useCookie<string | null>('auth_token');
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
    const localeModalOpen = ref(false);

    const navLinks = computed(() =>
        headerNavLinkConfig.map((item) => ({
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
    const userInitial = computed(() => {
        const first = resolvedFirstName.value.trim().charAt(0).toUpperCase();
        const last = resolvedLastName.value.trim().charAt(0).toUpperCase();
        return `${first || 'U'}${last || ''}`;
    });
    const displayName = computed(() =>
        [resolvedFirstName.value, resolvedLastName.value].filter(Boolean).join(' ').trim() || 'User'
    );
    const displayEmail = computed(() => resolvedEmail.value);
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

    watch(
        () => route.fullPath,
        () => {
            closeAccountMenu();
            closeLocaleModal();
        }
    );

    onMounted(() => {
        document.addEventListener('click', onDocClick);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', onDocClick);
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
        userInitial,
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
