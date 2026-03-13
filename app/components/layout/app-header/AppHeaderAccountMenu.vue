<script setup lang="ts">
import { toRef } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import { useAppHeaderAccountMenu } from '~/composables/layout/appHeader/useAppHeaderAccountMenu';
import type { icons } from '~/data/ui/icons';

const { t } = useI18n();
const { withCountry } = useCountry();
type IconName = keyof typeof icons;

type AccountLink = {
	to: string;
	icon: IconName;
	label: string;
};

const props = defineProps<{
	accountOpen: boolean;
	isMockLoggedIn: boolean;
	isGuestLoggedIn: boolean;
	userInitial: string;
	userAvatarUrl?: string | null;
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
const {
	bindWrapRef,
	handleAccountLinkClick,
	primaryAccountLinks,
	gettingStartedLink,
	guestOrderLink,
	guestOrderTarget,
	setAccountToggleRef,
	setAccountDropdownRef,
	guestLoginTarget,
} = useAppHeaderAccountMenu({
	accountOpen: toRef(props, 'accountOpen'),
	isMockLoggedIn: toRef(props, 'isMockLoggedIn'),
	isGuestLoggedIn: toRef(props, 'isGuestLoggedIn'),
	accountLinks: toRef(props, 'accountLinks'),
	setWrapRef: props.setWrapRef,
	closeMenu: () => emit('close'),
});
</script>

<template>
	<div
		:ref="bindWrapRef"
		class="home-header-account-wrap"
		data-testid="app-header-account-wrap"
		@mouseenter="emit('mouse-enter')"
		@mouseleave="emit('mouse-leave')"
	>
		<UiButton
			:ref="setAccountToggleRef"
			type="button"
			variant="ghost"
			tone="neutral"
			size="sm"
			class="home-header-icon home-header-account"
			:class="{
				'is-open': accountOpen && isMockLoggedIn,
				'is-open-guest': accountOpen && !isMockLoggedIn,
			}"
			:aria-label="t('layout.header.account')"
			aria-haspopup="menu"
			:aria-expanded="accountOpen"
			data-testid="app-header-account-toggle-button"
			@click.stop="emit('toggle')"
		>
			<span v-if="isMockLoggedIn && !isGuestLoggedIn" class="home-header-avatar">
				<img
					v-if="props.userAvatarUrl"
					:src="props.userAvatarUrl"
					:alt="displayName"
					class="home-header-avatar-image"
				>
				<template v-else>{{ userInitial }}</template>
			</span>
			<span v-else-if="isGuestLoggedIn" class="home-header-avatar home-header-avatar--guest">
				<UiIcon name="strong-user" :size="16" color="var(--text-primary)" />
			</span>
			<UiIcon
				v-else
				name="strong-user"
				:size="22"
				color="var(--text-primary)"
			/>
			<UiIcon
				v-if="isMockLoggedIn || isGuestLoggedIn"
				name="strong-caret-down"
				:size="16"
				color="var(--text-primary)"
			/>
		</UiButton>

		<Transition :name="accountTransitionName">
			<div
				v-if="accountOpen && isMockLoggedIn && !isGuestLoggedIn"
				:ref="setAccountDropdownRef"
				class="home-account-dropdown home-account-dropdown--member"
				role="menu"
				tabindex="-1"
				:aria-label="t('layout.header.accountMenu')"
				data-testid="app-header-account-dropdown-member"
			>
				<div class="home-account-summary" data-testid="app-header-account-summary">
					<span class="home-account-summary-avatar">
						<img
							v-if="props.userAvatarUrl"
							:src="props.userAvatarUrl"
							:alt="displayName"
							class="home-account-summary-avatar-image"
						>
						<template v-else>{{ userInitial }}</template>
					</span>
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
							class="home-account-link-icon"
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
							class="home-account-link-icon"
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
							class="home-account-link-icon"
						/>
						<span class="home-account-link-label">{{ t('layout.header.accountLinks.signOut') }}</span>
					</UiButton>
				</div>
			</div>
			<div
				v-else-if="accountOpen && isGuestLoggedIn"
				:ref="setAccountDropdownRef"
				class="home-account-dropdown home-account-dropdown--member"
				role="menu"
				tabindex="-1"
				:aria-label="t('layout.header.accountMenu')"
				data-testid="app-header-account-dropdown-member"
			>
				<div class="home-account-summary" data-testid="app-header-account-summary">
					<span class="home-account-summary-avatar">
						<UiIcon name="strong-user" :size="18" color="var(--text-primary)" />
					</span>
					<div>
						<p class="home-account-summary-email">{{ displayEmail }}</p>
					</div>
				</div>

				<div class="home-account-link-group home-account-link-group--primary">
					<NuxtLink
						v-if="guestOrderLink"
						:to="guestOrderTarget"
						class="home-account-link"
						role="menuitem"
						data-testid="app-header-account-link-account-orders"
						@click="emit('close')"
					>
						<UiIcon
							:name="guestOrderLink.icon"
							:size="22"
							color="var(--text-primary)"
							class="home-account-link-icon"
						/>
						<span class="home-account-link-label">{{ guestOrderLink.label }}</span>
					</NuxtLink>
				</div>

				<div class="home-account-link-group home-account-link-group--secondary">
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
							:size="22"
							color="var(--text-primary)"
							class="home-account-link-icon"
						/>
						<span class="home-account-link-label">{{ t('layout.header.accountLinks.signOut') }}</span>
					</UiButton>
				</div>
			</div>
			<div
				v-else-if="accountOpen"
				:ref="setAccountDropdownRef"
				class="home-account-dropdown home-account-dropdown--guest"
				role="menu"
				tabindex="-1"
				:aria-label="t('layout.header.accountMenu')"
				data-testid="app-header-account-dropdown-guest"
			>
				<NuxtLink
					:to="guestLoginTarget"
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
        --btn-bg: transparent;
        --btn-soft: rgba(255, 255, 255, 0.3);
        --btn-border: transparent;

        height: 40px;
        min-width: 40px;
		padding: 0;
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
        --btn-soft: rgba(255, 255, 255, 0.3);
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
            --btn-soft: var(--gold-10);
            background: var(--gold-10);
        }

        &.is-open::after {
            opacity: 1;
        }

        &.is-open-guest {
            --btn-soft: var(--contrast-light);
            background: var(--contrast-light);
        }

        &.is-open-guest::after {
            opacity: 1;
        }

        .home-header-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--gray-40);
            color: var(--black-base);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            font-weight: var(--font-weight-bold);
            display: grid;
            place-items: center;

            .home-header-avatar-image {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }
        }

        .home-header-avatar--guest {
            background: var(--gray-30);
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
        outline: none;

        &.home-account-dropdown--member {
            width: 320px;
            right: auto;
            left: 50%;
            transform: translateX(-50%);
        }

        &.home-account-dropdown--guest {
            width: 112px;
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
                font-weight: var(--font-weight-bold);

                .home-account-summary-avatar-image {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }

            .home-account-summary-name {

                font-size: var(--type-size-200);
                font-weight: var(--font-weight-bold);
                line-height: var(--type-line-200);
                color: var(--text-primary);
            }

            .home-account-summary-email {
                margin: 2px 0 0;
                font-size: var(--type-size-100);
                color: var(--text-secondary);
                line-height: var(--type-line-100);
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
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            font-weight: var(--font-weight-medium);
            color: var(--text-primary);
            padding: 0 20px;

            .home-account-link-icon {
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