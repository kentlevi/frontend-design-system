<script setup lang="ts">
import AppHeaderAccountMenu from '~/components/layout/app-header/AppHeaderAccountMenu.vue';
import { useCountry } from '~/composables/app/country/useCountry';
import { useSystemOperations } from '~/composables/core/system/useSystemOperations';
import { useAppHeaderContext } from '~/composables/layout/appHeader/useAppHeader';
import { normalizeAppPath } from '~/utils/auth/redirect';

const { t } = useI18n();
const { withCountry } = useCountry();
const route = useRoute();
const cart_badge_ready = ref(false)

useSystemOperations()

const {
	simple,
	nav_links,
	isNavLinkActive,
	header_loading,
	header_account_skeleton_count,
	is_mock_logged_in,
	is_guest_logged_in,
	account_open,
	display_email,
	account_transition_name,
	account_links,
	cart_badge_count,
	setAccountMenuRef,
	openSearchModal,
	openCartPreview,
	prefetchHeaderOverlayModules,
	toggleAccountMenu,
	closeAccountMenu,
	onAccountMouseEnter,
	onAccountMouseLeave,
	logoutMock,
} = useAppHeaderContext();

function isExactNavHeading(path: string) {
	return normalizeAppPath(route.path) === normalizeAppPath(path);
}

onMounted(() => {
	cart_badge_ready.value = true
})
</script>

<template>
	<div class="home-header-container" data-testid="app-header-main-bar">
		<NuxtLink :to="withCountry('/')" class="home-header-logo" aria-label="Musticker" data-testid="app-header-logo-link">
			<UiLogo
				name="musticker"
				variant="full"
				color="colored"
				:size="56"
				:width="175"
				loading="eager"
				fetchpriority="high"
			/>
		</NuxtLink>

		<nav
			v-if="!simple"
			class="home-header-nav"
			:aria-label="t('layout.header.primaryNav')"
			data-testid="app-header-nav"
		>
			<template
				v-for="link in nav_links"
				:key="link.key"
			>
				<h1
					v-if="isExactNavHeading(link.to)"
					class="home-header-link home-header-link--heading is-active"
					:data-testid="`app-header-nav-link-${link.key}`"
				>
					{{ link.label }}
				</h1>
				<NuxtLink
					v-else
					:to="link.to"
					class="home-header-link"
					:class="{ 'is-active': isNavLinkActive(link.to) }"
					:data-testid="`app-header-nav-link-${link.key}`"
				>
					{{ link.label }}
				</NuxtLink>
			</template>
		</nav>
		<div v-else />

		<div class="home-header-tools" data-testid="app-header-tools">
			<template v-if="!simple && header_loading">
				<div class="home-header-loading-row" data-testid="app-header-loading-tools">
					<UiSkeleton
						v-for="index in 2"
						:key="`header-tool-skeleton-${index}`"
						width="40px"
						height="40px"
						border-radius="16px"
						class="home-header-tool-skeleton"
					/>
					<UiSkeleton
						v-if="header_account_skeleton_count === 2"
						key="header-bell-skeleton"
						width="40px"
						height="40px"
						border-radius="16px"
						class="home-header-tool-skeleton"
					/>
					<UiSkeleton
						key="header-account-skeleton"
						:width="header_account_skeleton_count === 2 ? '64px' : '40px'"
						height="40px"
						border-radius="16px"
						class="home-header-tool-skeleton"
					/>
				</div>
			</template>

			<template v-else-if="!simple">
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
					@click="openSearchModal"
					@mouseenter="prefetchHeaderOverlayModules"
					@focus="prefetchHeaderOverlayModules"
				/>
				<div class="home-header-cart-wrap">
					<UiButton
						variant="ghost"
						tone="default"
						size="md"
						:icon-only="true"
						icon="strong-shop-cart"
						icon-size="md"
						class="home-header-icon home-header-cart"
						:aria-label="t('layout.header.cart')"
						data-testid="app-header-cart-button"
						@click="openCartPreview"
						@mouseenter="prefetchHeaderOverlayModules"
						@focus="prefetchHeaderOverlayModules"
					/>
					<span
						v-if="cart_badge_ready && cart_badge_count > 0"
						class="home-header-cart-dot"
						data-testid="app-header-cart-count"
					>
						{{ cart_badge_count > 99 ? '99+' : cart_badge_count }}
					</span>
				</div>
				<UiButton
					v-if="is_mock_logged_in"
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					class="home-header-icon home-header-bell"
					data-testid="app-header-notification-button"
				>
					<UiIcon name="strong-bell" :size="20" color="var(--text-primary)" />
				</UiButton>
			</template>

			<UiButton
				v-if="simple"
				type="button"
				variant="ghost"
				tone="neutral"
				size="md"
				class="home-header-icon"
				:aria-label="t('layout.header.accountLinks.signOut')"
				data-testid="app-header-direct-logout-button"
				@click="logoutMock"
			>
				<UiIcon name="strong-sign-out" :size="22" color="var(--text-primary)" />
			</UiButton>

			<AppHeaderAccountMenu
				v-else-if="!header_loading"
				:simple="simple"
				:account-open="account_open"
				:is-mock-logged-in="is_mock_logged_in"
				:is-guest-logged-in="is_guest_logged_in"
				:display-email="display_email"
				:account-transition-name="account_transition_name"
				:account-links="account_links"
				:set-wrap-ref="setAccountMenuRef"
				data-testid="app-header-account-menu"
				@toggle="toggleAccountMenu"
				@close="closeAccountMenu"
				@mouse-enter="onAccountMouseEnter"
				@mouse-leave="onAccountMouseLeave"
				@logout="logoutMock"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.home-header-container {
    --home-header-badge-font-size: 12px;
    --home-header-badge-line-height: 20px;

    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
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
		padding: 4px 0;

        .home-header-link {

            font-size: var(--type-size-200);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-200);
            text-decoration: none;
            color: var(--text-primary);
            position: relative;
            padding: 10px 24px;
            border-radius: 14px;
            transition: background-color 220ms ease, color 220ms ease;

            &.home-header-link--heading {
                cursor: default;
                user-select: none;
            }

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

		.home-header-loading-row {
			display: flex;
			align-items: center;
			gap: 6px;
		}

		.home-header-tool-skeleton {
			background: linear-gradient(
				90deg,
				rgba(255, 255, 255, 0.34) 25%,
				rgba(255, 255, 255, 0.58) 37%,
				rgba(255, 255, 255, 0.34) 63%
			);
			background-size: 400% 100%;
		}

        .home-header-icon {
            --btn-bg: var(--text-primary);
            --btn-soft: rgba(255, 255, 255, 0.3);
            --btn-border: transparent;

            height: 40px;
            min-width: 40px;
			padding: 0;
            border-radius: 16px;
            display: grid;
            place-items: center;
            box-shadow: none;
            transition: background-color 0.2s ease;

            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
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
            font-size: var(--home-header-badge-font-size);
            font-weight: var(--font-weight-bold);
            line-height: var(--home-header-badge-line-height);
            text-align: center;
            pointer-events: none;
        }
    }
}
</style>