<script setup lang="ts">
definePageMeta({
    layout: 'home',
});
const { t } = useI18n();

const coupons = [
    {
        titleKey: 'laborMonthDiscount',
        code: 'LABORMAY10',
        expiry: '05/30/2025',
        tag: 'Unlimited Use',
    },
    {
        titleKey: 'birthdayMonthDiscount',
        code: 'BIRTHMONTH20',
        expiry: '12/31/2025',
        tag: 'Multiple-Use',
    },
    {
        titleKey: 'paperStickerDiscount',
        code: 'PAPER15',
        expiry: '12/31/2025',
        tag: 'Single Use',
    },
];
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="coupons">
            <div class="account-content">
                <div class="head">
                    <h1>{{ t('account.coupons.title') }}</h1>
                    <div class="add-row">
                        <input
                            type="text"
                            :placeholder="t('account.coupons.codePlaceholder')"
                        />
                        <UiButton variant="filled" tone="neutral" size="md">{{
                            t('account.coupons.addCoupon')
                        }}</UiButton>
                    </div>
                </div>

                <div class="list">
                    <article
                        v-for="item in coupons"
                        :key="item.code"
                        class="coupon"
                    >
                        <div>
                            <h2>
                                {{
                                    t(
                                        `account.coupons.items.${item.titleKey}.title`
                                    )
                                }}
                            </h2>
                            <h3>{{ item.code }}</h3>
                            <p>
                                {{
                                    t(
                                        `account.coupons.items.${item.titleKey}.note`
                                    )
                                }}
                            </p>
                        </div>
                        <div class="right">
                            <p class="expiry">{{ item.expiry }}</p>
                            <span class="tag">{{
                                t(`account.coupons.tags.${item.tag}`)
                            }}</span>
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

    .head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: center;
        margin-bottom: 20px;

        h1 {
            margin: 0;
            font-size: 52px;
            line-height: 1.05;
        }
    }

    .add-row {
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

    .list {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        overflow: hidden;
        background: var(--contrast-light);
    }

    .coupon {
        padding: 16px 18px;
        border-top: 1px solid var(--border-default);
        display: flex;
        justify-content: space-between;
        gap: 14px;

        &:first-child {
            border-top: 0;
        }

        h2 {
            margin: 0;
            font-size: 22px;
        }

        h3 {
            margin: 4px 0 0;
            font-size: 40px;
            line-height: 1.05;
        }

        p {
            margin: 8px 0 0;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .right {
            text-align: right;
            display: grid;
            align-content: space-between;
            gap: 16px;

            .expiry {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                color: var(--text-primary);
            }

            .tag {
                justify-self: end;
                height: 28px;
                border-radius: 999px;
                padding: 0 12px;
                display: inline-flex;
                align-items: center;
                background: #e3f3ff;
                color: #1f75cb;
                font-size: 12px;
                font-weight: 700;
            }
        }
    }
}
</style>
