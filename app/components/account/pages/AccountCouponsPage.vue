<script setup lang="ts">
import { useAccountCoupons } from '~/composables/account/useAccountCoupons';

const { t } = useI18n();
const { coupons } = useAccountCoupons();
</script>

<template>
    <section class="account-page" data-testid="account-coupons-page">
        <AccountShell active-tab="coupons">
            <div class="account-content" data-testid="account-coupons-content">
                <header class="account-coupons-header" data-testid="account-coupons-header">
                    <h1 class="account-coupons-title" data-testid="account-coupons-title">{{ t('account.coupons.title') }}</h1>
                    <div class="account-coupons-add-row" data-testid="account-coupons-add-row">
                        <input
                            type="text"
                            :placeholder="t('account.coupons.codePlaceholder')"
                            data-testid="account-coupons-code-input"
                        />
                        <UiButton variant="filled" tone="neutral" size="md" data-testid="account-coupons-add-button">
                            {{ t('account.coupons.addCoupon') }}
                        </UiButton>
                    </div>
                </header>

                <div class="account-coupons-list" data-testid="account-coupons-list">
                    <article
                        v-for="item in coupons"
                        :key="item.code"
                        class="account-coupons-card"
                        :data-testid="`account-coupons-item-${item.code}`"
                    >
                        <div>
                            <h2 class="account-coupons-card-title">{{ t(`account.coupons.items.${item.titleKey}.title`) }}</h2>
                            <h3 class="account-coupons-code">{{ item.code }}</h3>
                            <p class="account-coupons-note">{{ t(`account.coupons.items.${item.titleKey}.note`) }}</p>
                        </div>
                        <div class="account-coupons-right">
                            <p class="account-coupons-expiry">{{ item.expiry }}</p>
                            <span class="account-coupons-tag">{{ t(`account.coupons.tags.${item.tag}`) }}</span>
                        </div>
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
    }

    .account-coupons-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: center;
        margin-bottom: 20px;

        .account-coupons-title {
            margin: 0;
            font-size: 52px;
            line-height: 1.05;
        }
    }

    .account-coupons-add-row {
        display: flex;
        gap: 8px;
        align-items: center;

        input {
            width: 420px;
            height: 42px;
            border: 1px solid var(--border-default);
            border-radius: 10px;
            background: var(--contrast-light);
            padding: 0 12px;
            font-size: 14px;
        }
    }

    .account-coupons-list {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        overflow: hidden;
        background: var(--contrast-light);

        .account-coupons-card {
            padding: 16px 18px;
            border-top: 1px solid var(--border-default);
            display: flex;
            justify-content: space-between;
            gap: 14px;

            &:first-child {
                border-top: 0;
            }

            .account-coupons-card-title {
                margin: 0;
                font-size: 22px;
            }

            .account-coupons-code {
                margin: 4px 0 0;
                font-size: 40px;
                line-height: 1.05;
            }

            .account-coupons-note {
                margin: 8px 0 0;
                color: var(--text-secondary);
                font-size: 14px;
            }

            .account-coupons-right {
                text-align: right;
                display: grid;
                align-content: space-between;
                gap: 16px;

                .account-coupons-expiry {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .account-coupons-tag {
                    justify-self: end;
                    height: 28px;
                    border-radius: 999px;
                    padding: 0 12px;
                    display: inline-flex;
                    align-items: center;
                    background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
                    color: var(--text-primary);
                    font-size: 12px;
                    font-weight: 700;
                }
            }
        }
    }
}
</style>
