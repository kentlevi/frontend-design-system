<script setup lang="ts">
import { useAccountOrders } from '~/composables/account/useAccountOrders';

const { t } = useI18n();
const { orders, activeOrder } = useAccountOrders();
</script>

<template>
    <section class="account-page" data-testid="account-orders-page">
        <AccountShell active-tab="orders">
            <div class="account-content" data-testid="account-orders-content">
                <header class="account-orders-header" data-testid="account-orders-header">
                    <h1 class="account-orders-title" data-testid="account-orders-title">{{ t('account.orders.title') }}</h1>
                    <div class="account-orders-actions" data-testid="account-orders-actions">
                        <UiButton variant="outline" tone="neutral" size="md" data-testid="account-orders-select-date-button">
                            {{ t('account.orders.selectDate') }}
                        </UiButton>
                        <UiButton variant="outline" tone="neutral" size="md" data-testid="account-orders-filters-button">
                            {{ t('account.orders.filters') }}
                        </UiButton>
                    </div>
                </header>

                <div class="account-orders-layout" data-testid="account-orders-layout">
                    <aside class="account-orders-list" data-testid="account-orders-list">
                        <article
                            v-for="(order, index) in orders"
                            :key="order.id"
                            class="account-orders-card"
                            :class="{ active: index === 0 }"
                            :data-testid="`account-orders-item-${index}`"
                        >
                            <h3 class="account-orders-card-title">{{ t('account.orders.orderLabel') }} {{ order.id }}</h3>
                            <p class="account-orders-card-meta">
                                {{ t('account.orders.meta', { count: order.itemCount, date: order.date }) }}
                            </p>
                        </article>
                    </aside>

                    <section class="account-orders-detail" data-testid="account-orders-detail">
                        <header class="account-orders-detail-header" data-testid="account-orders-detail-header">
                            <h2 class="account-orders-detail-title">
                                {{ t('account.orders.orderLabel') }} {{ activeOrder?.id }}
                            </h2>
                            <span class="account-orders-status">
                                {{ t(`account.orders.status.${activeOrder?.statusKey || 'beforeProduction'}`) }}
                            </span>
                        </header>
                        <div class="account-orders-block" data-testid="account-orders-summary-block">
                            <h3 class="account-orders-block-title">{{ t('account.orders.orderSummary') }}</h3>
                            <p class="account-orders-block-copy">{{ t('account.orders.summaryText') }}</p>
                        </div>
                        <div class="account-orders-block" data-testid="account-orders-actions-block">
                            <h3 class="account-orders-block-title">{{ t('account.orders.actions') }}</h3>
                            <div class="account-orders-button-row" data-testid="account-orders-action-buttons">
                                <UiButton variant="filled" tone="neutral" size="md" data-testid="account-orders-upload-artwork-button">
                                    {{ t('account.orders.uploadArtwork') }}
                                </UiButton>
                                <UiButton variant="outline" tone="neutral" size="md" data-testid="account-orders-cancel-button">
                                    {{ t('account.orders.cancelOrder') }}
                                </UiButton>
                            </div>
                        </div>
                    </section>
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

        .account-orders-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            gap: 16px;

            .account-orders-title {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                line-height: 40px;
                
            }
        }

        .account-orders-actions {
            display: flex;
            gap: 10px;
        }

        .account-orders-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 16px;

            .account-orders-list {
                display: grid;
                gap: 10px;

                .account-orders-card {
                    border: 1px solid var(--border-default);
                    border-radius: 10px;
                    padding: 14px;
                    background: var(--contrast-light);

                    &.active {
                        border-color: color-mix(in srgb, var(--brand-primary) 60%, var(--border-default));
                        background: color-mix(in srgb, var(--brand-primary) 12%, var(--contrast-light));
                    }

                    .account-orders-card-title {
                        margin: 0;
                        font-size: 24px;
                    }

                    .account-orders-card-meta {
                        margin: 8px 0 0;
                        font-size: 13px;
                        color: var(--text-secondary);
                    }
                }
            }

            .account-orders-detail {
                border: 1px solid var(--border-default);
                border-radius: 10px;
                background: var(--contrast-light);
                min-height: 500px;

                .account-orders-detail-header {
                    padding: 18px;
                    border-bottom: 1px solid var(--border-default);
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    .account-orders-detail-title {
                        margin: 0;
                        font-size: 34px;
                    }

                    .account-orders-status {
                        height: 28px;
                        border-radius: 999px;
                        padding: 0 12px;
                        display: inline-flex;
                        align-items: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--text-primary);
                        background: var(--brand-primary);
                    }
                }

                .account-orders-block {
                    padding: 18px;
                    border-bottom: 1px solid var(--border-default);

                    .account-orders-block-title {
                        margin: 0 0 8px;
                        font-size: 24px;
                    }

                    .account-orders-block-copy {
                        margin: 0;
                        font-size: 14px;
                        color: var(--text-secondary);
                    }

                    .account-orders-button-row {
                        display: flex;
                        gap: 10px;
                    }
                }
            }
        }
    }

    @media (max-width: 980px) {
        .account-content {
            .account-orders-layout {
                grid-template-columns: 1fr;
            }
        }
    }
}
</style>

