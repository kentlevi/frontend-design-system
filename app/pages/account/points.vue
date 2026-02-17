<script setup lang="ts">
definePageMeta({
    layout: 'home',
});
const { t } = useI18n();

const logs = [
    {
        titleKey: 'earned',
        date: '11/05/2024',
        value: '+0.36 P',
        positive: true,
    },
    {
        titleKey: 'used',
        date: '11/05/2024',
        value: '-25.00 P',
        positive: false,
    },
    {
        titleKey: 'quest',
        date: '10/22/2024',
        value: '+5.00 P',
        positive: true,
    },
];
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="points">
            <div class="account-content">
                <h1>{{ t('account.points.title') }}</h1>
                <div class="hero">
                    <div>
                        <h2>{{ t('account.points.tierName') }}</h2>
                        <p>
                            {{ t('account.points.lastTierUpgrade') }}:
                            01/11/2025
                        </p>
                    </div>
                    <p class="points">
                        13.90 {{ t('account.points.pointsUnit') }}
                    </p>
                </div>
                <div class="logs">
                    <article
                        v-for="log in logs"
                        :key="log.titleKey"
                        class="row"
                    >
                        <div>
                            <h3>
                                {{ t(`account.points.logs.${log.titleKey}`) }}
                            </h3>
                            <p>{{ log.date }}</p>
                        </div>
                        <strong
                            :class="{
                                plus: log.positive,
                                minus: !log.positive,
                            }"
                            >{{ log.value }}</strong
                        >
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
}
.account-content {
    padding-top: 24px;
}
h1 {
    margin: 0 0 18px;
    font-size: 52px;
    line-height: 1.05;
}
.hero {
    border-radius: 12px;
    border: 1px solid #f3b8e2;
    background: #f9d7f2;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}
h2 {
    margin: 0;
    font-size: 34px;
}
p {
    margin: 6px 0 0;
    color: var(--text-secondary);
}
.points {
    margin: 0;
    font-size: 40px;
    color: var(--text-primary);
    font-weight: 700;
}
.logs {
    margin-top: 16px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    overflow: hidden;
    background: var(--contrast-light);
}
.row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-top: 1px solid var(--border-default);
}
.row:first-child {
    border-top: 0;
}
h3 {
    margin: 0;
    font-size: 18px;
}
strong {
    align-self: center;
    font-size: 20px;
}
.plus {
    color: #1fa34a;
}
.minus {
    color: #df2f4d;
}
</style>
