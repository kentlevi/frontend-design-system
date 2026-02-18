<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { FlagCode } from '~/data/ui/flags';

const { t, locale, setLocale } = useI18n();
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

const navLinks = computed(() => [
    {
        key: 'stickers',
        label: t('home.header.nav.stickers'),
        to: localePath('/stickers'),
    },
    {
        key: 'roll',
        label: t('home.header.nav.rollStickers'),
        to: localePath('/roll-stickers'),
    },
    {
        key: 'sheet',
        label: t('home.header.nav.sheetStickers'),
        to: localePath('/sheet-stickers'),
    },
]);

const route = useRoute();
const accountOpen = ref(false);
const accountPinnedOpen = ref(false);
const accountMenuRef = ref<HTMLElement | null>(null);
const localeModalOpen = ref(false);
const selectedLocale = computed<FlagCode>(() =>
    locale.value === 'kr' ? 'kr' : 'us'
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

const localeOptions = computed<
    Array<{ code: 'en' | 'kr'; flagCode: FlagCode; label: string }>
>(() => [
    { code: 'en', flagCode: 'us', label: t('home.header.locale.en') },
    { code: 'kr', flagCode: 'kr', label: t('home.header.locale.kr') },
]);

const accountLinks = computed(() => [
    {
        label: t('home.header.accountLinks.profile'),
        to: '/account/profile',
        icon: 'light-user',
    },
    {
        label: t('home.header.accountLinks.addressBook'),
        to: '/account/address-book',
        icon: 'light-home',
    },
    {
        label: t('home.header.accountLinks.orders'),
        to: '/account/orders',
        icon: 'light-box-full',
    },
    {
        label: t('home.header.accountLinks.gallery'),
        to: '/account/gallery',
        icon: 'light-image',
    },
    {
        label: t('home.header.accountLinks.points'),
        to: '/account/points',
        icon: 'light-star',
    },
    {
        label: t('home.header.accountLinks.coupons'),
        to: '/account/coupons',
        icon: 'light-ticket',
    },
    {
        label: t('home.header.accountLinks.reviews'),
        to: '/account/reviews',
        icon: 'light-comments',
    },
    {
        label: t('home.header.accountLinks.quoteRequests'),
        to: '/account/quote-requests',
        icon: 'light-file-details',
    },
    {
        label: t('home.header.accountLinks.gettingStarted'),
        to: '/auth/profile',
        icon: 'light-arrow-right',
    },
]);
const accountTransitionName = computed(() =>
    isMockLoggedIn.value ? 'account-dropdown' : 'account-dropdown-guest'
);

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
    () => closeAccountMenu()
);

onMounted(() => {
    document.addEventListener('click', onDocClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocClick);
});
</script>

<template>
    <header class="home-header">
        <div class="home-header-container">
            <NuxtLink
                :to="localePath('/')"
                class="home-header-logo"
                aria-label="Musticker"
            >
                <UiLogo
                    name="musticker"
                    variant="full"
                    color="colored"
                    :size="54"
                />
            </NuxtLink>

            <nav
                class="home-header-nav"
                :aria-label="t('home.header.primaryNav')"
            >
                <NuxtLink
                    v-for="link in navLinks"
                    :key="link.key"
                    :to="link.to"
                    class="home-header-link"
                    active-class="is-active"
                    exact-active-class="is-active"
                >
                    {{ link.label }}
                </NuxtLink>
            </nav>

            <div class="home-header-tools">
                <button
                    type="button"
                    class="home-header-icon home-header-locale"
                    :aria-label="t('home.header.locale.aria')"
                    @click="openLocaleModal"
                >
                    <UiFlag :code="selectedLocale" :size="24" />
                </button>
                <button
                    type="button"
                    class="home-header-icon"
                    :aria-label="t('home.header.search')"
                >
                    <UiIcon name="strong-search" :size="22" color="#1f2433" />
                </button>
                <button
                    type="button"
                    class="home-header-icon"
                    :aria-label="t('home.header.cart')"
                >
                    <UiIcon
                        name="strong-shop-cart"
                        :size="22"
                        color="#1f2433"
                    />
                </button>
                <button
                    v-if="isMockLoggedIn"
                    type="button"
                    class="home-header-icon home-header-bell"
                >
                    <UiIcon name="strong-bell" :size="20" color="#1f2433" />
                    <span class="home-header-dot">1</span>
                </button>

                <div
                    ref="accountMenuRef"
                    class="home-header-account-wrap"
                    @mouseenter="onAccountMouseEnter"
                    @mouseleave="onAccountMouseLeave"
                >
                    <button
                        type="button"
                        class="home-header-icon home-header-account"
                        :class="{
                            'is-open': accountOpen,
                            'is-open-guest': accountOpen && !isMockLoggedIn,
                        }"
                        :aria-label="t('home.header.account')"
                        aria-haspopup="menu"
                        :aria-expanded="accountOpen"
                        @click.stop="toggleAccountMenu"
                    >
                        <span v-if="isMockLoggedIn" class="home-header-avatar">
                            {{ userInitial }}
                        </span>
                        <UiIcon
                            v-else
                            name="strong-user"
                            :size="22"
                            color="#1f2433"
                        />
                        <UiIcon
                            v-if="isMockLoggedIn"
                            name="strong-angle-down"
                            :size="12"
                            color="#1f2433"
                        />
                    </button>

                    <Transition :name="accountTransitionName">
                        <div
                            v-if="accountOpen && isMockLoggedIn"
                            class="home-account-dropdown home-account-dropdown--member"
                            role="menu"
                            :aria-label="t('home.header.accountMenu')"
                        >
                            <div class="home-account-summary">
                                <span class="home-account-summary-avatar">{{
                                    userInitial
                                }}</span>
                                <div>
                                    <p class="home-account-summary-name">
                                        {{ displayName }}
                                    </p>
                                    <p class="home-account-summary-email">
                                        {{ displayEmail }}
                                    </p>
                                </div>
                            </div>

                            <NuxtLink
                                v-for="link in accountLinks"
                                :key="link.to"
                                :to="localePath(link.to)"
                                class="home-account-link"
                                role="menuitem"
                                @click="closeAccountMenu"
                            >
                                <UiIcon
                                    :name="link.icon"
                                    :size="16"
                                    color="#4a4e5f"
                                />
                                <span>{{ link.label }}</span>
                            </NuxtLink>

                            <button
                                type="button"
                                class="home-account-link home-account-link-button"
                                role="menuitem"
                                @click="logoutMock"
                            >
                                <UiIcon
                                    name="light-sign-out"
                                    :size="16"
                                    color="#4a4e5f"
                                />
                                <span>{{
                                    t('home.header.accountLinks.signOut')
                                }}</span>
                            </button>
                        </div>
                        <div
                            v-else-if="accountOpen"
                            class="home-account-dropdown home-account-dropdown--guest"
                            role="menu"
                            :aria-label="t('home.header.accountMenu')"
                        >
                            <NuxtLink
                                :to="localePath('/auth/login')"
                                class="home-account-link home-account-link--guest"
                                role="menuitem"
                                @click="closeAccountMenu"
                            >
                                {{ t('home.header.login') }}
                            </NuxtLink>
                            <NuxtLink
                                :to="localePath('/auth/register')"
                                class="home-account-link home-account-link--guest"
                                role="menuitem"
                                @click="closeAccountMenu"
                            >
                                {{ t('home.header.register') }}
                            </NuxtLink>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <Transition name="locale-modal">
            <div
                v-if="localeModalOpen"
                class="home-locale-overlay"
                @click.self="closeLocaleModal"
            >
                <div
                    class="home-locale-modal"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="t('home.header.locale.title')"
                >
                    <button
                        type="button"
                        class="home-locale-close"
                        :aria-label="t('home.header.locale.close')"
                        @click="closeLocaleModal"
                    >
                        <UiIcon name="strong-times" :size="24" color="#000000" />
                    </button>

                    <h3 class="home-locale-title">
                        {{ t('home.header.locale.title') }}
                    </h3>

                    <div class="home-locale-list">
                        <button
                            v-for="option in localeOptions"
                            :key="option.code"
                            type="button"
                            class="home-locale-item"
                            :class="{ 'is-active': locale === option.code }"
                            @click="selectLocale(option.code)"
                        >
                            <UiFlag :code="option.flagCode" :size="20" />
                            <span>{{ option.label }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </header>
</template>

<style scoped lang="scss">
.home-header {
    background: var(--brand-primary);

    .home-header-container {
        max-width: 1280px;
        margin: 0 auto;
        height: 96px;
        padding: 0 24px;
        display: grid;
        grid-template-columns: 200px 1fr 260px;
        align-items: center;
    }

    .home-header-logo {
        display: inline-flex;
        align-items: center;
        justify-self: start;
        width: fit-content;
    }

    .home-header-nav {
        display: flex;
        justify-content: center;
        gap: 40px;
    }

    .home-header-link {
        font-size: 16px;
        font-weight: 600;
        line-height: 28px;
        text-decoration: none;
        color: #1f2433;
        position: relative;
        padding: 10px 24px;
        border-radius: 14px;
        transition:
            background-color 220ms ease,
            color 220ms ease;

        &:hover {
            background: var(--gold-10);
            opacity: 1;
        }

        &.is-active {
            background: var(--gold-10);
            opacity: 1;
        }

        &.is-active::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -5px;
            transform: translateX(-50%) rotate(45deg);
            width: 13px;
            height: 13px;
            background: var(--gold-10);
            border-radius: 2px;
        }
    }

    .home-header-tools {
        justify-self: end;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .home-header-icon {
        height: 40px;
        min-width: 40px;
        border: 0;
        border-radius: 16px;
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    }

    .home-header-account-wrap {
        position: relative;
        display: grid;
        place-items: center;

        &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            height: 18px;
        }
    }

    .home-header-account {
        position: relative;
        z-index: 2;
        background: transparent;
        transition: background-color 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 8px;

        &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -5px;
            width: 13px;
            height: 13px;
            background-color: inherit;
            transform: translateX(-50%) rotate(45deg);
            border-radius: 2px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        &.is-open {
            background: var(--gold-10);

            &::after {
                opacity: 1;
            }
        }

        &.is-open-guest {
            background: var(--contrast-light);
        }
    }

    .home-header-locale {
        overflow: hidden;
    }

    .home-header-bell {
        position: relative;
    }

    .home-header-dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #df2f4d;
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
        display: grid;
        place-items: center;
    }

    .home-header-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #6d8491;
        color: var(--contrast-light);
        font-size: 13px;
        font-weight: 700;
        display: grid;
        place-items: center;
    }

    .home-account-dropdown {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        background: var(--contrast-light);
        border-radius: 10px;
        border: 1px solid var(--border-default);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
        z-index: 3;
        overflow: hidden;
    }

    .home-account-dropdown--member {
        width: 320px;
    }

    .home-account-dropdown--guest {
        width: 206px;
        right: auto;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 16px;
    }

    .home-account-summary {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        border-bottom: 1px solid var(--border-default);
    }

    .home-account-summary-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #6d8491;
        color: #ffffff;
        display: grid;
        place-items: center;
        font-weight: 700;
    }

    .home-account-summary-name {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
        color: #212634;
    }

    .home-account-summary-email {
        margin: 2px 0 0;
        font-size: 12px;
        color: var(--text-secondary);
        line-height: 1.2;
    }

    .home-account-link {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 42px;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
        color: #212634;
        padding: 0 12px;

        &:hover {
            background: var(--gold-20);
        }
    }

    .home-account-link--guest {
        height: 42px;
        justify-content: center;
        font-size: 14px;
        line-height: 1.2;
        font-weight: 500;
    }

    .home-account-link-button {
        border: 0;
        width: 100%;
        background: transparent;
        cursor: pointer;
        border-top: 1px solid var(--border-default);
    }

    .account-dropdown-enter-active,
    .account-dropdown-leave-active {
        transition:
            opacity 0.18s ease,
            transform 0.18s ease;
        transform-origin: top center;
    }

    .account-dropdown-enter-from,
    .account-dropdown-leave-to {
        opacity: 0;
        transform: translateY(-6px) scale(0.96);
    }

    .account-dropdown-enter-to,
    .account-dropdown-leave-from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .account-dropdown-guest-enter-active,
    .account-dropdown-guest-leave-active {
        transition:
            opacity 0.18s ease,
            transform 0.18s ease;
        transform-origin: top center;
    }

    .account-dropdown-guest-enter-from,
    .account-dropdown-guest-leave-to {
        opacity: 0;
        transform: translateX(-50%) translateY(-6px) scale(0.96);
    }

    .account-dropdown-guest-enter-to,
    .account-dropdown-guest-leave-from {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
    }

    .home-locale-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.28);
        display: grid;
        place-items: start center;
        padding-top: 88px;
        z-index: 120;
    }

    .home-locale-modal {
        width: min(520px, calc(100vw - 24px));
        background: var(--contrast-light);
        border-radius: 10px;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
        padding: 22px;
        position: relative;
    }

    .home-locale-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 24px;
        height: 24px;
        border: 0;
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
    }

    .home-locale-title {
        margin: 0 0 14px;
        font-size: 38px;
        line-height: 1.3;
        color: var(--text-primary);
    }

    .home-locale-list {
        border: 1px solid #d2d8e2;
        border-radius: 8px;
        overflow: hidden;
    }

    .home-locale-item {
        width: 100%;
        height: 44px;
        border: 0;
        border-top: 1px solid #e6eaf0;
        background: #ffffff;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 12px;
        text-align: left;
        cursor: pointer;
        color: var(--text-primary);
        font-size: 14px;
    }

    .home-locale-item:first-child {
        border-top: 0;
    }

    .home-locale-item.is-active {
        background: #e9f0ff;
    }

    .locale-modal-enter-active,
    .locale-modal-leave-active {
        transition: opacity 0.2s ease;
    }

    .locale-modal-enter-from,
    .locale-modal-leave-to {
        opacity: 0;
    }
}
</style>
