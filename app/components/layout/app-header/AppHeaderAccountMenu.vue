<script setup lang="ts">
import { useCountry } from '@/composables/app/useCountry';
import {
    HOME_WELCOME_POPOVER_PENDING_KEY,
    HOME_WELCOME_POPOVER_TRIGGER_EVENT,
} from '~/data/home/onboarding';

const { t } = useI18n();
const { withCountry } = useCountry();
const route = useRoute();
type IconName = keyof typeof import('~/data/ui/icons').icons;

type AccountLink = {
    to: string;
    icon: IconName;
    label: string;
};

const props = defineProps<{
    accountOpen: boolean;
    isMockLoggedIn: boolean;
    userInitial: string;
    displayName: string;
    displayEmail: string;
    accountTransitionName: string;
    accountLinks: AccountLink[];
    setWrapRef: (el: HTMLElement | null) => void;
}>();

const emit = defineEmits<{
    (e: 'toggle'): void;
    (e: 'close'): void;
    (e: 'mouse-enter'): void;
    (e: 'mouse-leave'): void;
    (e: 'logout'): void;
}>();

function handleAccountLinkClick(event: MouseEvent, to: string) {
    if (to === '/auth/profile') {
        event.preventDefault();
        if (import.meta.client) {
            window.localStorage.setItem(HOME_WELCOME_POPOVER_PENDING_KEY, '1');
            window.dispatchEvent(new CustomEvent(HOME_WELCOME_POPOVER_TRIGGER_EVENT));
        }
        emit('close');
        void navigateTo(withCountry('/'));
        return;
    }

    emit('close');
}

const primaryAccountLinks = computed(() =>
    props.accountLinks.filter((link) => link.to !== '/auth/profile')
);

const gettingStartedLink = computed(
    () => props.accountLinks.find((link) => link.to === '/auth/profile') ?? null
);
</script>

<template>
    <div
        :ref="setWrapRef"
        class="home-header-account-wrap"
        data-testid="app-header-account-wrap"
        @mouseenter="emit('mouse-enter')"
        @mouseleave="emit('mouse-leave')"
    >
        <button
            type="button"
            class="home-header-icon home-header-account"
            :class="{
                'is-open': accountOpen,
                'is-open-guest': accountOpen && !isMockLoggedIn,
            }"
            :aria-label="t('layout.header.account')"
            aria-haspopup="menu"
            :aria-expanded="accountOpen"
            data-testid="app-header-account-toggle-button"
            @click.stop="emit('toggle')"
        >
            <span v-if="isMockLoggedIn" class="home-header-avatar">
                {{ userInitial }}
            </span>
            <UiIcon
                v-else
                name="strong-user"
                :size="22"
                color="var(--text-primary)"
            />
            <UiIcon
                v-if="isMockLoggedIn"
                name="strong-caret-down"
                :size="16"
                color="var(--text-primary)"
            />
        </button>

        <Transition :name="accountTransitionName">
            <div
                v-if="accountOpen && isMockLoggedIn"
                class="home-account-dropdown home-account-dropdown--member"
                role="menu"
                :aria-label="t('layout.header.accountMenu')"
                data-testid="app-header-account-dropdown-member"
            >
                <div class="home-account-summary" data-testid="app-header-account-summary">
                    <span class="home-account-summary-avatar">{{ userInitial }}</span>
                    <div>
                        <p class="home-account-summary-name">
                            {{ displayName }}
                        </p>
                        <p class="home-account-summary-email">
                            {{ displayEmail }}
                        </p>
                    </div>
                </div>

                <div class="home-account-link-group home-account-link-group--primary">
                    <NuxtLink
                        v-for="link in primaryAccountLinks"
                        :key="link.to"
                        :to="withCountry(link.to)"
                        class="home-account-link"
                        role="menuitem"
                        :data-testid="`app-header-account-link-${link.to.replace('/', '').replace('/', '-') || 'root'}`"
                        @click="handleAccountLinkClick($event, link.to)"
                    >
                        <UiIcon
                            :name="link.icon"
                            :size="24"
                            color="var(--text-primary)"
                        />
                        <span class="home-account-link-label">{{ link.label }}</span>
                    </NuxtLink>
                </div>

                <div class="home-account-link-group home-account-link-group--secondary">
                    <NuxtLink
                        v-if="gettingStartedLink"
                        :to="withCountry(gettingStartedLink.to)"
                        class="home-account-link home-account-link--section-start"
                        role="menuitem"
                        :data-testid="`app-header-account-link-${gettingStartedLink.to.replace('/', '').replace('/', '-') || 'root'}`"
                        @click="handleAccountLinkClick($event, gettingStartedLink.to)"
                    >
                        <UiIcon
                            :name="gettingStartedLink.icon"
                            :size="24"
                            color="var(--text-primary)"
                        />
                        <span class="home-account-link-label">{{ gettingStartedLink.label }}</span>
                    </NuxtLink>

                    <UiButton
                        variant="ghost"
                        tone="default"
                        size="sm"
                        class="home-account-link home-account-link-button"
                        role="menuitem"
                        data-testid="app-header-account-logout-button"
                        @click="emit('logout')"
                    >
                        <UiIcon
                            name="strong-sign-out"
                            :size="24"
                            color="var(--text-primary)"
                        />
                        <span class="home-account-link-label">{{ t('layout.header.accountLinks.signOut') }}</span>
                    </UiButton>
                </div>
            </div>
            <div
                v-else-if="accountOpen"
                class="home-account-dropdown home-account-dropdown--guest"
                role="menu"
                :aria-label="t('layout.header.accountMenu')"
                data-testid="app-header-account-dropdown-guest"
            >
                <NuxtLink
                    :to="{
                        path: withCountry('/auth/login'),
                        query: {
                            redirect: route.fullPath,
                        },
                    }"
                    class="home-account-link home-account-link--guest"
                    role="menuitem"
                    data-testid="app-header-account-login"
                    @click="emit('close')"
                >
                    {{ t('layout.header.login') }}
                </NuxtLink>
                <NuxtLink
                    :to="withCountry('/auth/register')"
                    class="home-account-link home-account-link--guest"
                    role="menuitem"
                    data-testid="app-header-account-register"
                    @click="emit('close')"
                >
                    {{ t('layout.header.register') }}
                </NuxtLink>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
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
        }

        &.is-open::after {
            opacity: 1;
        }

        &.is-open-guest {
            background: var(--contrast-light);
        }

        .home-header-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--gray-40);
            color: var(--black-base);
            font-size: 13px;
            font-weight: 700;
            display: grid;
            place-items: center;
        }
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

        &.home-account-dropdown--member {
            width: 320px;
            right: auto;
            left: 50%;
            transform: translateX(-50%);
        }

        &.home-account-dropdown--guest {
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

            .home-account-summary-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: var(--gray-40);
                color: var(--black-base);
                display: grid;
                place-items: center;
                font-weight: 700;
            }

            .home-account-summary-name {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
                line-height: 28px;
                color: var(--text-primary);
            }

            .home-account-summary-email {
                margin: 2px 0 0;
                font-size: 12px;
                color: var(--text-secondary);
                line-height: 1.2;
            }
        }
        .home-account-link-group {
            padding: 8px 0;

            &.home-account-link-group--secondary {
                border-top: 1px solid var(--border-default);
            }
        }

        .home-account-link {
            display: flex;
            align-items: center;
            gap: 10px;
            height: 40px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.2;
            color: var(--text-primary);
            padding: 0 20px;

            :deep(.ui-icon) {
                flex-shrink: 0;
            }

            &:hover {
                background: var(--gold-20);
            }

            &.home-account-link--guest {
                justify-content: center;
            }

            &.home-account-link-button {
                --btn-bg: var(--text-primary);
                --btn-soft: var(--gold-20);
                --btn-border: transparent;

                width: 100%;
                border-radius: 0;
                box-shadow: none;
                justify-content: flex-start;
            }
        }

    }
}

.account-dropdown-enter-active,
.account-dropdown-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
    transform-origin: top center;
}

.account-dropdown-enter-from,
.account-dropdown-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-6px) scale(0.96);
}

.account-dropdown-enter-to,
.account-dropdown-leave-from {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
}

.account-dropdown-guest-enter-active,
.account-dropdown-guest-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
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
</style>
