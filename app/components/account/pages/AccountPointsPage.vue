<script setup lang="ts">
import { useAccountPoints } from '~/composables/account/useAccountPoints';

const { t } = useI18n();
const { logs, balance, lastTierUpgradeDate } = useAccountPoints();
</script>

<template>
    <section class="account-page" data-testid="account-points-page">
        <AccountShell active-tab="points">
            <div class="account-content" data-testid="account-points-content">
                <h1 class="account-points-title" data-testid="account-points-title">{{ t('account.points.title') }}</h1>
                <div class="account-points-hero" data-testid="account-points-hero">
                    <div>
                        <h2 class="account-points-tier">{{ t('account.points.tierName') }}</h2>
                        <p class="account-points-meta">{{ t('account.points.lastTierUpgrade') }}: {{ lastTierUpgradeDate }}</p>
                    </div>
                    <p class="account-points-balance" data-testid="account-points-balance">{{ balance }} {{ t('account.points.pointsUnit') }}</p>
                </div>
                <div class="account-points-logs" data-testid="account-points-logs">
                    <article
                        v-for="log in logs"
                        :key="log.titleKey"
                        class="account-points-log-row"
                        :data-testid="`account-points-log-${log.titleKey}`"
                    >
                        <div>
                            <h3 class="account-points-log-title">{{ t(`account.points.logs.${log.titleKey}`) }}</h3>
                            <p class="account-points-log-date">{{ log.date }}</p>
                        </div>
                        <strong :class="{ plus: log.positive, minus: !log.positive }">{{ log.value }}</strong>
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

        .account-points-title {
            margin: 0 0 18px;
            font-size: 52px;
            line-height: 1.05;
        }

        .account-points-hero {
            border-radius: 12px;
            border: 1px solid color-mix(in srgb, var(--brand-primary) 45%, var(--border-default));
            background: color-mix(in srgb, var(--brand-primary) 18%, var(--contrast-light));
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;

            .account-points-tier {
                margin: 0;
                font-size: 34px;
            }

            .account-points-meta {
                margin: 6px 0 0;
                color: var(--text-secondary);
            }

            .account-points-balance {
                margin: 0;
                font-size: 40px;
                color: var(--text-primary);
                font-weight: 700;
            }
        }

        .account-points-logs {
            margin-top: 16px;
            border: 1px solid var(--border-default);
            border-radius: 10px;
            overflow: hidden;
            background: var(--contrast-light);

            .account-points-log-row {
                display: flex;
                justify-content: space-between;
                gap: 12px;
                padding: 14px 16px;
                border-top: 1px solid var(--border-default);

                &:first-child {
                    border-top: 0;
                }

                .account-points-log-title {
                    margin: 0;
                    font-size: 18px;
                }

                .account-points-log-date {
                    margin: 6px 0 0;
                    color: var(--text-secondary);
                }

                strong {
                    align-self: center;
                    font-size: 20px;

                    &.plus {
                        color: var(--text-primary);
                    }

                    &.minus {
                        color: var(--error);
                    }
                }
            }
        }
    }
}
</style>

