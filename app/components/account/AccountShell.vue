<script setup lang="ts">
import { useCountry } from '@/composables/app/useCountry';
import type { UserFieldValue } from '@/stores/user';

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

const profileFieldValues = computed(
    () => userStore.profile?.user_field_values ?? []
);
function getFieldValueByKey(key: 'first_name' | 'last_name') {
    const legacyId = key === 'first_name' ? 1 : 2;
    const directMatch =
        profileFieldValues.value.find(
            (field) =>
                field.country_field?.field_key === key ||
                (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === legacyId
        )?.value?.trim() || '';
    if (directMatch) return directMatch;

    const fallbackRows = [...profileFieldValues.value]
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
const storeFirstName = computed(
    () => getFieldValueByKey('first_name')
);
const storeLastName = computed(
    () => getFieldValueByKey('last_name')
);
const emailLocalPart = computed(() => {
    const source = (userStore.email || mockUser.value?.email || '').trim();
    if (!source.includes('@')) return '';
    return source.split('@')[0] || '';
});

const fullName = computed(() => {
    const first = storeFirstName.value || mockUser.value?.firstName || emailLocalPart.value || 'User';
    const last = storeLastName.value || mockUser.value?.lastName || '';
    return [first, last].filter(Boolean).join(' ').trim();
});

const userEmail = computed(() => userStore.email || mockUser.value?.email || '');
const initials = computed(() => {
    const first = (
        storeFirstName.value ||
        mockUser.value?.firstName ||
        emailLocalPart.value ||
        'U'
    )
        .charAt(0)
        .toUpperCase();
    const last = (storeLastName.value || mockUser.value?.lastName || '')
        .charAt(0)
        .toUpperCase();
    return `${first || 'U'}${last || ''}`;
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
                <div class="account-shell-avatar">{{ initials }}</div>
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
        font-weight: 700;
        font-size: 22px;
    }

    .account-shell-name {
        margin: 0;
        font-size: 20px;
        line-height: 28px;
        font-weight: 700;
        
        color: var(--text-primary);
    }

    .account-shell-level {
        margin: 4px 0 0;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        
        color: var(--text-secondary);
    }

    .account-shell-email {
        margin: 2px 0 0;
        font-size: 12px;
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
        font-size: 13px;
        color: var(--text-secondary);
    }

    .account-shell-stat-value {
        font-size: 20px;
        line-height: 1.2;
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
        font-size: 14px;
        font-weight: 600;
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
            font-size: 30px;
        }
    }
}
</style>

