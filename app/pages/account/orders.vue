<script setup lang="ts">
definePageMeta({
    layout: 'home',
});
const { t } = useI18n();

const orders = [
    {
        id: '# 62411120012',
        itemCount: 2,
        date: '10/11/2024',
        statusKey: 'beforeProduction',
    },
    {
        id: '# 62411120004',
        itemCount: 1,
        date: '11/13/2024',
        statusKey: 'processing',
    },
    {
        id: '# 62411120002',
        itemCount: 1,
        date: '10/23/2024',
        statusKey: 'actionRequired',
    },
];
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="orders">
            <div class="account-content">
                <div class="page-head">
                    <h1>{{ t('account.orders.title') }}</h1>
                    <div class="actions">
                        <UiButton variant="outline" tone="neutral" size="md">{{
                            t('account.orders.selectDate')
                        }}</UiButton>
                        <UiButton variant="outline" tone="neutral" size="md">{{
                            t('account.orders.filters')
                        }}</UiButton>
                    </div>
                </div>

                <div class="orders-layout">
                    <aside class="order-list">
                        <article
                            v-for="(order, index) in orders"
                            :key="order.id"
                            class="order-card"
                            :class="{ active: index === 0 }"
                        >
                            <h3>
                                {{ t('account.orders.orderLabel') }}
                                {{ order.id }}
                            </h3>
                            <p>
                                {{
                                    t('account.orders.meta', {
                                        count: order.itemCount,
                                        date: order.date,
                                    })
                                }}
                            </p>
                        </article>
                    </aside>

                    <section class="order-detail">
                        <header>
                            <h2>
                                {{ t('account.orders.orderLabel') }} #
                                62411120012
                            </h2>
                            <span class="status">{{
                                t('account.orders.status.beforeProduction')
                            }}</span>
                        </header>
                        <div class="detail-block">
                            <h3>{{ t('account.orders.orderSummary') }}</h3>
                            <p>
                                {{ t('account.orders.summaryText') }}
                            </p>
                        </div>
                        <div class="detail-block">
                            <h3>{{ t('account.orders.actions') }}</h3>
                            <div class="row">
                                <UiButton
                                    variant="filled"
                                    tone="neutral"
                                    size="md"
                                    >{{
                                        t('account.orders.uploadArtwork')
                                    }}</UiButton
                                >
                                <UiButton
                                    variant="outline"
                                    tone="neutral"
                                    size="md"
                                    >{{
                                        t('account.orders.cancelOrder')
                                    }}</UiButton
                                >
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
}

.account-content {
    padding-top: 24px;
}

.page-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 16px;
}

h1 {
    margin: 0;
    font-size: 52px;
    line-height: 1.05;
}

.actions {
    display: flex;
    gap: 10px;
}

.orders-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 16px;
}

.order-list {
    display: grid;
    gap: 10px;
}

.order-card {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 14px;
    background: var(--contrast-light);
}

.order-card.active {
    border-color: color-mix(
        in srgb,
        var(--brand-primary) 60%,
        var(--border-default)
    );
    background: color-mix(
        in srgb,
        var(--brand-primary) 12%,
        var(--contrast-light)
    );
}

.order-card h3 {
    margin: 0;
    font-size: 24px;
}

.order-card p {
    margin: 8px 0 0;
    font-size: 13px;
    color: var(--text-secondary);
}

.order-detail {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--contrast-light);
    min-height: 500px;
}

.order-detail > header {
    padding: 18px;
    border-bottom: 1px solid var(--border-default);
    display: flex;
    align-items: center;
    gap: 12px;
}

h2 {
    margin: 0;
    font-size: 34px;
}

.status {
    height: 28px;
    border-radius: 999px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    background: #f0b429;
}

.detail-block {
    padding: 18px;
    border-bottom: 1px solid var(--border-default);
}

.detail-block h3 {
    margin: 0 0 8px;
    font-size: 24px;
}

.detail-block p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
}

.row {
    display: flex;
    gap: 10px;
}

@media (max-width: 980px) {
    .orders-layout {
        grid-template-columns: 1fr;
    }
}
</style>
