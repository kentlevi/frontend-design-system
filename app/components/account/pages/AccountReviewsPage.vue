<script setup lang="ts">
import { useAccountReviews } from '~/composables/account/useAccountReviews';

const { t } = useI18n();
const { reviews } = useAccountReviews();
</script>

<template>
    <section class="account-page" data-testid="account-reviews-page">
        <AccountShell active-tab="reviews">
            <div class="account-content" data-testid="account-reviews-content">
                <h1 class="account-reviews-title" data-testid="account-reviews-title">{{ t('account.reviews.title') }}</h1>
                <div class="account-reviews-list" data-testid="account-reviews-list">
                    <article
                        v-for="item in reviews"
                        :key="item.titleKey"
                        class="account-reviews-card"
                        :data-testid="`account-reviews-item-${item.titleKey}`"
                    >
                        <header class="account-reviews-card-header">
                            <h2 class="account-reviews-card-title">{{ t(`account.reviews.items.${item.titleKey}.title`) }}</h2>
                            <p class="account-reviews-card-date">{{ t('account.reviews.reviewedOn') }}: {{ item.date }}</p>
                        </header>
                        <p class="account-reviews-card-rating">{{ t('account.reviews.rating') }}: {{ item.rating }}/5</p>
                        <p class="account-reviews-card-body">{{ t(`account.reviews.items.${item.textKey}.text`) }}</p>
                    </article>
                </div>
            </div>
        </AccountShell>
    </section>
</template>

<style scoped lang="scss">
.account-page {
    background: var(--bg-page);
    min-height: calc(100vh - 176px);

    .account-content {
        padding-top: 24px;

        .account-reviews-title {
            margin: 0 0 20px;
            font-size: 52px;
            line-height: 1.05;
        }

        .account-reviews-list {
            display: grid;
            gap: 12px;

            .account-reviews-card {
                border: 1px solid var(--border-default);
                border-radius: 10px;
                padding: 16px;
                background: var(--contrast-light);

                .account-reviews-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;

                    .account-reviews-card-title {
                        margin: 0;
                        font-size: 30px;
                    }

                    .account-reviews-card-date {
                        margin: 0;
                        font-size: 13px;
                        color: var(--text-secondary);
                    }
                }

                .account-reviews-card-rating {
                    margin: 8px 0 0;
                    font-weight: 700;
                    color: var(--brand-primary);
                }

                .account-reviews-card-body {
                    margin: 8px 0 0;
                    font-size: 14px;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
            }
        }
    }
}
</style>
