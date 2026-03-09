<script setup lang="ts">
import { useCountry } from '@/composables/app/useCountry';
import {
	getAccountInitials,
	getProfileFieldValue,
	normalizeAccountName,
} from '~/composables/account/accountProfile.helpers';

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
const userStore = useUserStore();
const mockUser = useCookie<{
	firstName: string;
	lastName: string;
	email: string;
} | null>('mock_user');
const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const localAvatarDataUrl = ref<string | null>(null);

const profileFieldValues = computed(
	() => userStore.profile?.user_field_values ?? []
);
const storeFirstName = computed(
	() => getProfileFieldValue(profileFieldValues.value, 'first_name')
);
const storeLastName = computed(
	() => getProfileFieldValue(profileFieldValues.value, 'last_name')
);
const emailLocalPart = computed(() => {
	const source = (userStore.email || mockUser.value?.email || '').trim();
	if (!source.includes('@')) return '';
	return source.split('@')[0] || '';
});
const normalizedName = computed(() =>
	normalizeAccountName(
		storeFirstName.value || mockUser.value?.firstName || emailLocalPart.value || 'User',
		storeLastName.value || mockUser.value?.lastName || ''
	)
);

const fullName = computed(() => {
	return [normalizedName.value.firstName, normalizedName.value.lastName]
		.filter(Boolean)
		.join(' ')
		.trim();
});

const userEmail = computed(() => userStore.email || mockUser.value?.email || '');
const initials = computed(() => {
	return getAccountInitials(
		normalizedName.value.firstName || 'User',
		normalizedName.value.lastName
	);
});
const avatarDisplayUrl = computed(
	() => localAvatarDataUrl.value
);

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
	{ key: 'profile', label: t('layout.header.accountLinks.profile'), to: '/account/profile', icon: 'light-user' },
	{ key: 'address-book', label: t('layout.header.accountLinks.addressBook'), to: '/account/address-book', icon: 'light-home' },
	{ key: 'orders', label: t('layout.header.accountLinks.orders'), to: '/account/orders', icon: 'light-box-full' },
	{ key: 'gallery', label: t('layout.header.accountLinks.gallery'), to: '/account/gallery', icon: 'light-image' },
	{ key: 'points', label: t('layout.header.accountLinks.points'), to: '/account/points', icon: 'light-star' },
	{ key: 'coupons', label: t('layout.header.accountLinks.coupons'), to: '/account/coupons', icon: 'light-ticket' },
	{ key: 'reviews', label: t('layout.header.accountLinks.reviews'), to: '/account/reviews', icon: 'light-comments' },
	{ key: 'quote-requests', label: t('layout.header.accountLinks.quoteRequests'), to: '/account/quote-requests', icon: 'light-file-details' },
] as const;
</script>

<template>
	<section class="account-shell" data-testid="account-shell">
		<div class="account-shell-top" data-testid="account-shell-top">
			<div class="account-shell-user" data-testid="account-shell-user">
				<div class="account-shell-avatar">
					<img
						v-if="avatarDisplayUrl"
						:src="avatarDisplayUrl"
						:alt="fullName"
						class="account-shell-avatar-image"
					>
					<template v-else>{{ initials }}</template>
				</div>
				<div>
					<p class="account-shell-name">{{ fullName }}</p>
					<p class="account-shell-level">{{ t('account.shell.level') }}</p>
					<p class="account-shell-email">{{ userEmail }}</p>
				</div>
			</div>

			<div class="account-shell-stats" data-testid="account-shell-stats">
				<div class="account-shell-stat">
					<span class="account-shell-stat-label">{{ t('account.shell.stats.order') }}</span>
					<strong class="account-shell-stat-value">0</strong>
				</div>
				<div class="account-shell-stat">
					<span class="account-shell-stat-label">{{ t('account.shell.stats.points') }}</span>
					<strong class="account-shell-stat-value">0.00</strong>
				</div>
				<div class="account-shell-stat">
					<span class="account-shell-stat-label">{{ t('account.shell.stats.coupons') }}</span>
					<strong class="account-shell-stat-value">0</strong>
				</div>
				<div class="account-shell-stat">
					<span class="account-shell-stat-label">{{ t('account.shell.stats.totalSpent') }}</span>
					<strong class="account-shell-stat-value">{{ t('account.shell.defaultBalance') }}</strong>
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
				<UiIcon :name="tab.icon" :size="14" />
				<span class="account-shell-tab-label">{{ tab.label }}</span>
			</NuxtLink>
		</nav>

		<slot />
	</section>
</template>

<style scoped lang="scss">
.account-shell {
    max-width: 1120px;
    margin: 0 auto;
    padding: 22px 24px 72px;

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
    }

    .account-shell-avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--gray-40);
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
    }

    .account-shell-name {
        margin: 0;
        font-size: var(--type-size-300);
        line-height: var(--type-line-300);
        font-weight: var(--font-weight-bold);

        color: var(--text-primary);
    }

    .account-shell-level {
        margin: 4px 0 0;
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

    .account-shell-stats {
        display: flex;
        align-items: center;
        gap: 28px;
    }

    .account-shell-stat {
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
    }

    .account-shell-tabs {
        margin-top: 20px;
        //border-top: 1px solid var(--border-default);
        border-bottom: 1px solid var(--border-default);
        padding: 14px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .account-shell-tab {
        height: 38px;
        border-radius: 8px;
        padding: 0 14px;
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
            background: color-mix(in srgb, var(--brand-primary) 22%, var(--contrast-light));
            border-color: color-mix(in srgb, var(--brand-primary) 52%, var(--border-default));
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