<script setup lang="ts">
import AppHeaderAccountMenu from '~/components/layout/app-header/AppHeaderAccountMenu.vue';
import type { FlagCode } from '~/data/ui/flags';
import { useCountry } from '@/composables/app/useCountry';

const { t } = useI18n();
const { withCountry } = useCountry();
type IconName = keyof typeof import('~/data/ui/icons').icons;

type NavLink = {
    key: string;
    label: string;
    to: string;
};

type AccountLink = {
    to: string;
    icon: IconName;
    label: string;
};

const props = defineProps<{
    navLinks: NavLink[];
    isNavLinkActive: (path: string) => boolean;
    selectedLocale: FlagCode;
    isMockLoggedIn: boolean;
    accountOpen: boolean;
    userInitial: string;
    displayName: string;
    displayEmail: string;
    accountTransitionName: string;
    accountLinks: AccountLink[];
    cartItemCount: number;
    setAccountMenuRef: (el: HTMLElement | null) => void;
}>();

const emit = defineEmits<{
    (e: 'open-locale'): void;
    (e: 'open-search'): void;
    (e: 'open-cart'): void;
    (e: 'prefetch-locale'): void;
    (e: 'prefetch-search'): void;
    (e: 'prefetch-cart'): void;
    (e: 'toggle-account'): void;
    (e: 'close-account'): void;
    (e: 'account-mouse-enter'): void;
    (e: 'account-mouse-leave'): void;
    (e: 'logout'): void;
}>();
</script>

<template>
    <div class="home-header-container" data-testid="app-header-main-bar-container">
        <NuxtLink :to="withCountry('/')" class="home-header-logo" aria-label="Musticker" data-testid="app-header-logo-link">
            <UiLogo
                name="musticker"
                variant="full"
                color="colored"
                :size="54"
                :width="112"
                loading="eager"
                fetchpriority="high"
            />
        </NuxtLink>

        <nav class="home-header-nav" :aria-label="t('layout.header.primaryNav')" data-testid="app-header-nav">
            <NuxtLink
                v-for="link in props.navLinks"
                :key="link.key"
                :to="link.to"
                class="home-header-link"
                :class="{ 'is-active': props.isNavLinkActive(link.to) }"
                :data-testid="`app-header-nav-link-${link.key}`"
            >
                {{ link.label }}
            </NuxtLink>
        </nav>

        <div class="home-header-tools" data-testid="app-header-tools">
            <button
                type="button"
                class="home-header-icon home-header-locale"
                :aria-label="t('layout.header.locale.aria')"
                data-testid="app-header-locale-button"
                @click="emit('open-locale')"
                @mouseenter="emit('prefetch-locale')"
                @focus="emit('prefetch-locale')"
            >
                <UiFlag :code="props.selectedLocale" :size="24" />
            </button>
            <UiButton
                variant="ghost"
                tone="default"
                size="md"
                :icon-only="true"
                icon="strong-search"
                icon-size="md"
                class="home-header-icon"
                :aria-label="t('layout.header.search')"
                data-testid="app-header-search-button"
                @click="emit('open-search')"
                @mouseenter="emit('prefetch-search')"
                @focus="emit('prefetch-search')"
            />
            <div class="home-header-cart-wrap">
                <UiButton
                    variant="ghost"
                    tone="default"
                    size="md"
                    :icon-only="true"
                    icon="strong-shop-cart"
                    icon-size="md"
                    class="home-header-icon"
                    :aria-label="t('layout.header.cart')"
                    data-testid="app-header-cart-button"
                    @click="emit('open-cart')"
                    @mouseenter="emit('prefetch-cart')"
                    @focus="emit('prefetch-cart')"
                />
                <span
                    v-if="props.cartItemCount > 0"
                    class="home-header-cart-dot"
                    data-testid="app-header-cart-count"
                >
                    {{ props.cartItemCount > 99 ? '99+' : props.cartItemCount }}
                </span>
            </div>
            <button
                v-if="props.isMockLoggedIn"
                type="button"
                class="home-header-icon home-header-bell"
                data-testid="app-header-notification-button"
            >
                <UiIcon name="strong-bell" :size="20" color="var(--text-primary)" />
            </button>

            <AppHeaderAccountMenu
                :account-open="props.accountOpen"
                :is-mock-logged-in="props.isMockLoggedIn"
                :user-initial="props.userInitial"
                :display-name="props.displayName"
                :display-email="props.displayEmail"
                :account-transition-name="props.accountTransitionName"
                :account-links="props.accountLinks"
                :set-wrap-ref="props.setAccountMenuRef"
                data-testid="app-header-account-menu"
                @toggle="emit('toggle-account')"
                @close="emit('close-account')"
                @mouse-enter="emit('account-mouse-enter')"
                @mouse-leave="emit('account-mouse-leave')"
                @logout="emit('logout')"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.home-header-container {
    max-width: 1280px;
    margin: 0 auto;
    height: 96px;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 200px 1fr 260px;
    align-items: center;

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

        .home-header-link {
            font-size: 16px;
            font-weight: 600;
            line-height: 28px;
            text-decoration: none;
            color: var(--text-primary);
            position: relative;
            padding: 10px 24px;
            border-radius: 14px;
            transition: background-color 220ms ease, color 220ms ease;

            &:hover,
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
    }

    .home-header-tools {
        justify-self: end;
        display: flex;
        align-items: center;
        gap: 6px;

        .home-header-icon {
            --btn-bg: var(--text-primary);
            --btn-soft: rgba(255, 255, 255, 0.3);
            --btn-border: transparent;

            height: 40px;
            min-width: 40px;
            border: 0;
            border-radius: 16px;
            background: transparent;
            display: grid;
            place-items: center;
            cursor: pointer;
            box-shadow: none;
            transition: background-color 0.2s ease;

            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        }

        .home-header-locale {
            overflow: hidden;
        }

        .home-header-cart-wrap {
            position: relative;
            width: 40px;
            height: 40px;

            .home-header-cart-dot {
                @extend .home-header-badge-dot;
            }
        }

        .home-header-bell {
            position: relative;
        }

        .home-header-badge-dot {
            position: absolute;
            top: -6px;
            right: -6px;
            min-width: 20px;
            height: 20px;
            border-radius: 999px;
            padding: 0 7px;
            background: var(--blood-base);
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            line-height: 20px;
            text-align: center;
            pointer-events: none;
        }
    }
}
</style>


