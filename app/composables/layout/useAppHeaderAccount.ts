import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { FlagCode } from '~/data/ui/flags';
import {
    headerAccountLinkConfig,
    headerLocaleOptionConfig,
    headerNavLinkConfig,
} from '~/data/layout/header';

export function useAppHeaderAccount() {
    const { t, locale, setLocale } = useI18n();
    const route = useRoute();
    const localePath = useLocalePath();
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
            to: localePath(item.to),
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
    const isMockLoggedIn = computed(() => Boolean(mockUser.value?.email));
    const userInitial = computed(() =>
        (mockUser.value?.firstName?.trim()?.charAt(0) || 'U').toUpperCase()
    );
    const displayName = computed(() =>
        `${mockUser.value?.firstName || 'Joy'} ${mockUser.value?.lastName || 'Love'}`.trim()
    );
    const displayEmail = computed(
        () => mockUser.value?.email || 'joylove1990@gmail.com'
    );
    const accountTransitionName = computed(() =>
        isMockLoggedIn.value ? 'account-dropdown' : 'account-dropdown-guest'
    );

    function isNavLinkActive(linkPath: string) {
        const normalizedRoutePath = route.path.replace(/\/+$/, '');
        const normalizedLinkPath = linkPath.replace(/\/+$/, '');
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

    function selectLocale(code: 'en' | 'kr') {
        setLocale(code);
        closeLocaleModal();
    }

    function logoutMock() {
        mockUser.value = null;
        closeAccountMenu();
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
