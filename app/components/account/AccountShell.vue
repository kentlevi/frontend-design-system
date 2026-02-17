<script setup lang="ts">
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
const localePath = useLocalePath();
const mockUser = useCookie<{
    firstName: string;
    lastName: string;
    email: string;
} | null>('mock_user');

const fullName = computed(() => {
    const first = mockUser.value?.firstName || 'Joy';
    const last = mockUser.value?.lastName || 'Love';
    return `${first} ${last}`.trim();
});

const userEmail = computed(
    () => mockUser.value?.email || 'joylove1990@gmail.com'
);
const initials = computed(() =>
    (mockUser.value?.firstName?.charAt(0) || 'J').toUpperCase()
);

const tabs = [
    {
        key: 'profile',
        label: t('home.header.accountLinks.profile'),
        to: '/account/profile',
        icon: 'light-user',
    },
    {
        key: 'address-book',
        label: t('home.header.accountLinks.addressBook'),
        to: '/account/address-book',
        icon: 'light-home',
    },
    {
        key: 'orders',
        label: t('home.header.accountLinks.orders'),
        to: '/account/orders',
        icon: 'light-box-full',
    },
    {
        key: 'gallery',
        label: t('home.header.accountLinks.gallery'),
        to: '/account/gallery',
        icon: 'light-image',
    },
    {
        key: 'points',
        label: t('home.header.accountLinks.points'),
        to: '/account/points',
        icon: 'light-star',
    },
    {
        key: 'coupons',
        label: t('home.header.accountLinks.coupons'),
        to: '/account/coupons',
        icon: 'light-ticket',
    },
    {
        key: 'reviews',
        label: t('home.header.accountLinks.reviews'),
        to: '/account/reviews',
        icon: 'light-comments',
    },
    {
        key: 'quote-requests',
        label: t('home.header.accountLinks.quoteRequests'),
        to: '/account/quote-requests',
        icon: 'light-file-details',
    },
] as const;
</script>

<template>
    <section class="account-shell">
        <div class="account-top">
            <div class="account-user">
                <div class="account-avatar">{{ initials }}</div>
                <div>
                    <p class="account-name">{{ fullName }}</p>
                    <p class="account-level">
                        {{ t('account.shell.level') }}
                    </p>
                    <p class="account-email">{{ userEmail }}</p>
                </div>
            </div>

            <div class="account-stats">
                <div class="account-stat">
                    <span class="account-stat-label">{{
                        t('account.shell.stats.order')
                    }}</span>
                    <strong>6</strong>
                </div>
                <div class="account-stat">
                    <span class="account-stat-label">{{
                        t('account.shell.stats.points')
                    }}</span>
                    <strong>13.90</strong>
                </div>
                <div class="account-stat">
                    <span class="account-stat-label">{{
                        t('account.shell.stats.coupons')
                    }}</span>
                    <strong>3</strong>
                </div>
                <div class="account-stat">
                    <span class="account-stat-label">{{
                        t('account.shell.stats.totalSpent')
                    }}</span>
                    <strong>KRW 35,494,187.80</strong>
                </div>
            </div>
        </div>

        <nav class="account-tabs">
            <NuxtLink
                v-for="tab in tabs"
                :key="tab.key"
                :to="localePath(tab.to)"
                class="account-tab"
                :class="{ 'is-active': props.activeTab === tab.key }"
            >
                <UiIcon :name="tab.icon" :size="14" />
                <span>{{ tab.label }}</span>
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

    .account-top {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: center;
    }

    .account-user {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .account-avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #9bb3c0;
        color: #ffffff;
        display: grid;
        place-items: center;
        font-weight: 700;
        font-size: 22px;
    }

    .account-name {
        margin: 0;
        font-size: 38px;
        line-height: 1.05;
        font-weight: 700;
        color: var(--text-primary);
    }

    .account-level {
        margin: 4px 0 0;
        font-size: 14px;
        color: var(--text-secondary);
    }

    .account-email {
        margin: 2px 0 0;
        font-size: 12px;
        color: var(--text-muted);
    }

    .account-stats {
        display: flex;
        align-items: center;
        gap: 28px;
    }

    .account-stat {
        display: grid;
        gap: 2px;

        .account-stat-label {
            font-size: 13px;
            color: var(--text-secondary);
        }

        strong {
            font-size: 20px;
            line-height: 1.2;
        }
    }

    .account-tabs {
        margin-top: 20px;
        border-top: 1px solid var(--border-default);
        border-bottom: 1px solid var(--border-default);
        padding: 14px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .account-tab {
        height: 38px;
        border-radius: 8px;
        padding: 0 14px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 600;
        border: 1px solid transparent;

        &.is-active {
            background: color-mix(
                in srgb,
                var(--brand-primary) 22%,
                var(--contrast-light)
            );
            border-color: color-mix(
                in srgb,
                var(--brand-primary) 52%,
                var(--border-default)
            );
        }
    }

    @media (max-width: 900px) {
        .account-top {
            flex-direction: column;
            align-items: flex-start;
        }

        .account-stats {
            flex-wrap: wrap;
            gap: 14px 22px;
        }

        .account-name {
            font-size: 30px;
        }
    }
}
</style>
