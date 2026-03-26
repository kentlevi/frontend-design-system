<script setup lang="ts">
import { useCountry } from '~/composables/app/country/useCountry';
import type { icons } from '~/data/ui/icons';
import { useProfilePhotoDisplay } from '~/utils/profile_photo/profile_photo';

type IconName = keyof typeof icons;
type AccountStat = {
	key: string;
	label: string;
	value: string;
	iconName: IconName | null;
	iconSrc: string;
	iconAlt: string;
};

const props = defineProps<{
	activeTab:
        | 'profile'
        | 'address-book'
        | 'orders'
        | 'gallery'
        | 'points'
        | 'coupons'
        | 'reviews'
        | 'quote-requests';
}>();

const { t } = useI18n();
const { withCountry } = useCountry();
const { display_avatar, display_name, user_initial } = useProfilePhotoDisplay();
const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const account_level_badge_src = '/icons/custom/account/points/badges/badge-bumper-boss.svg';
const localAvatarDataUrl = ref<string | null>(null);

const accountStats = computed<AccountStat[]>(() => [
	{
		key: 'orders',
		label: t('account.shell.stats.order'),
		value: '0',
		iconName: null,
		iconSrc: '/icons/custom/checkout/icon-box.svg',
		iconAlt: 'Orders',
	},
	{
		key: 'points',
		label: t('account.shell.stats.points'),
		value: '0.00',
		iconName: null,
		iconSrc: '/icons/custom/account/points-icon.svg',
		iconAlt: 'Points',
	},
	{
		key: 'coupons',
		label: t('account.shell.stats.coupons'),
		value: '0',
		iconName: null,
		iconSrc: '/icons/custom/account/coupon-icon.svg',
		iconAlt: 'Coupons',
	},
	{
		key: 'total-spent',
		label: t('account.shell.stats.totalSpent'),
		value: t('account.shell.defaultBalance'),
		iconName: null,
		iconSrc: '/icons/custom/account/total-spent-icon.svg',
		iconAlt: 'Total spent',
	},
]);

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

onMounted(() => {
	syncLocalAvatarFromStorage();
	window.addEventListener('storage', syncLocalAvatarFromStorage);
	window.addEventListener(ACCOUNT_AVATAR_UPDATED_EVENT, onAvatarUpdated as EventListener);
});

onBeforeUnmount(() => {
	window.removeEventListener('storage', syncLocalAvatarFromStorage);
	window.removeEventListener(ACCOUNT_AVATAR_UPDATED_EVENT, onAvatarUpdated as EventListener);
});

const tabs = [
	{ key: 'profile', label: t('layout.header.accountLinks.profile'), to: '/account/profile', icon: 'regular-user' },
	{ key: 'address-book', label: t('layout.header.accountLinks.addressBook'), to: '/account/address-book', icon: 'regular-home' },
	{ key: 'orders', label: t('layout.header.accountLinks.orders'), to: '/account/orders', icon: 'regular-boxes' },
	{ key: 'gallery', label: t('layout.header.accountLinks.gallery'), to: '/account/gallery', icon: 'regular-image' },
	{ key: 'points', label: t('layout.header.accountLinks.points'), to: '/account/points', icon: 'regular-star' },
	{ key: 'coupons', label: t('layout.header.accountLinks.coupons'), to: '/account/coupons', icon: 'regular-ticket' },
	{ key: 'reviews', label: t('layout.header.accountLinks.reviews'), to: '/account/reviews', icon: 'regular-comments' },
	{ key: 'quote-requests', label: t('layout.header.accountLinks.quoteRequests'), to: '/account/quote-requests', icon: 'regular-file-details' },
] as const;
</script>

<template>
	<section class="account-shell" data-testid="account-shell">
		<div class="account-shell-top" data-testid="account-shell-top">
			<div class="account-shell-user" data-testid="account-shell-user">
				<div class="account-shell-avatar">
					<img
						v-if="display_avatar"
						:src="display_avatar"
						:alt="display_name"
						class="account-shell-avatar-image"
					>
					<template v-else>{{ user_initial }}</template>
					<img
						:src="account_level_badge_src"
						:alt="t('account.shell.level')"
						class="account-shell-avatar-badge"
					>
				</div>
				<div class="account-shell-user-copy">
					<p class="account-shell-name">{{ display_name }}</p>
					<p class="account-shell-level">{{ t('account.shell.level') }}</p>
				</div>
			</div>

			<div class="account-shell-stats" data-testid="account-shell-stats">
				<div
					v-for="stat in accountStats"
					:key="stat.key"
					class="account-shell-stat"
					:data-testid="`account-shell-stat-${stat.key}`"
				>
					<div class="account-shell-stat-icon-wrap">
						<img
							v-if="stat.iconSrc"
							:src="stat.iconSrc"
							:alt="stat.iconAlt"
							class="account-shell-stat-icon-image"
						>
						<UiIcon
							v-else-if="stat.iconName"
							:name="stat.iconName"
							:size="48"
							class="account-shell-stat-icon"
						/>
					</div>
					<div class="account-shell-stat-copy">
						<span class="account-shell-stat-label">{{ stat.label }}</span>
						<strong class="account-shell-stat-value">{{ stat.value }}</strong>
					</div>
				</div>
			</div>
		</div>

		<nav class="account-shell-tabs" data-testid="account-shell-tabs">
			<NuxtLink
				v-for="tab in tabs"
				:key="tab.key"
				:to="withCountry(tab.to)"
				class="account-shell-tab"
				:class="{ 'is-active': props.activeTab === tab.key }"
				:data-testid="`account-shell-tab-${tab.key}`"
			>
				<UiIcon :name="tab.icon" :size="24" />
				<span class="account-shell-tab-label">{{ tab.label }}</span>
			</NuxtLink>
		</nav>

		<slot />
	</section>
</template>

<style scoped lang="scss">
.account-shell {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0 104px;

    .account-shell-top {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: center;
    }

	.account-shell-user {
		display: flex;
		align-items: center;
		gap: 12px;

		.account-shell-user-copy {
			display: flex;
			flex-direction: column;
		}
	}

    .account-shell-avatar {
        position: relative;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: var(--gray-40);
        box-shadow: inset 0 0 0 4px var(--gray-40);
        color: var(--black-base);
        display: grid;
        place-items: center;
        font-weight: var(--font-weight-bold);
        font-size: var(--type-size-400);
        line-height: var(--type-line-400);

        .account-shell-avatar-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .account-shell-avatar-badge {
            position: absolute;
			bottom: 0;
            right: -14px;
            width: 42px;
            height: 36px;
            display: block;
        }
    }

	.account-shell-user-copy {
		display: grid;
		gap: 4px;
		.account-shell-name {
			font-size: var(--type-size-400);
			line-height: var(--type-line-400);
			font-weight: var(--font-weight-bold);
			color: var(--text-primary);
		}

		.account-shell-level {
			font-size: var(--type-size-100);
			font-weight: var(--font-weight-regular);
			line-height: var(--type-line-100);
			color: var(--text-secondary);
		}

		.account-shell-email {
			margin: 2px 0 0;
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			color: var(--text-muted);
		}
	}

    .account-shell-stats {
        display: flex;
        align-items: center;
        gap: 28px;
    }

    .account-shell-stat {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .account-shell-stat-icon-wrap {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
    }

    .account-shell-stat-icon-image {
        display: block;
        width: 48px;
        height: 48px;
    }

    .account-shell-stat-copy {
        display: grid;
        gap: 2px;
    }

    .account-shell-stat-label {
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-secondary);
    }

    .account-shell-stat-value {
        font-size: var(--type-size-300);
        line-height: var(--type-line-300);
        color: var(--text-primary);
    }

    .account-shell-tabs {
        border-bottom: 1px solid var(--gray-50);
        padding: 24px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .account-shell-tab {
        height: 38px;
        border-radius: 8px;
        padding: 8px 16px 8px 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
        color: var(--text-primary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        font-weight: var(--font-weight-semibold);
        border: 1px solid transparent;

        &.is-active {
            background: var(--gold-10);
            border-color: var(--gold-40);
        }

		&:hover {
            background: var(--gold-10);
		}

		&.account-shell-tab-label {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
		}
    }

    @media (max-width: 900px) {
        .account-shell-top {
            flex-direction: column;
            align-items: flex-start;
        }

        .account-shell-stats {
            flex-wrap: wrap;
            gap: 14px 22px;
        }

        .account-shell-name {
            font-size: var(--type-size-500);
            line-height: var(--type-line-500);
        }
    }
}
</style>