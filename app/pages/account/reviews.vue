<script setup lang="ts">
definePageMeta({
    layout: 'home',
});
const { t } = useI18n();

const reviews = [
    {
        titleKey: 'firstImpression',
        rating: 5,
        date: '05/20/2024',
        textKey: 'firstImpression',
    },
    {
        titleKey: 'greatQuality',
        rating: 4,
        date: '04/22/2024',
        textKey: 'greatQuality',
    },
];
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="reviews">
            <div class="account-content">
                <h1>{{ t('account.reviews.title') }}</h1>
                <div class="review-list">
                    <article
                        v-for="item in reviews"
                        :key="item.titleKey"
                        class="review-card"
                    >
                        <header>
                            <h2>
                                {{
                                    t(
                                        `account.reviews.items.${item.titleKey}.title`
                                    )
                                }}
                            </h2>
                            <p>
                                {{ t('account.reviews.reviewedOn') }}:
                                {{ item.date }}
                            </p>
                        </header>
                        <p class="rating">
                            {{ t('account.reviews.rating') }}:
                            {{ item.rating }}/5
                        </p>
                        <p class="body">
                            {{
                                t(`account.reviews.items.${item.textKey}.text`)
                            }}
                        </p>
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
    margin: 0 0 20px;
    font-size: 52px;
    line-height: 1.05;
}
.review-list {
    display: grid;
    gap: 12px;
}
.review-card {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 16px;
    background: var(--contrast-light);
}
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}
h2 {
    margin: 0;
    font-size: 30px;
}
header p {
    margin: 0;
    font-size: 13px;
    color: var(--text-secondary);
}
.rating {
    margin: 8px 0 0;
    font-weight: 700;
    color: #e5ad08;
}
.body {
    margin: 8px 0 0;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
}
</style>
