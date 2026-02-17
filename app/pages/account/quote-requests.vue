<script setup lang="ts">
definePageMeta({
    layout: 'home',
});
const { t } = useI18n();

const requests = [
    { id: '082410270004', date: '03/20/2025', statusKey: 'inReview' },
    { id: '082410270060', date: '02/28/2025', statusKey: 'pending' },
];
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="quote-requests">
            <div class="account-content">
                <div class="head">
                    <h1>{{ t('account.quoteRequests.title') }}</h1>
                    <div class="tools">
                        <UiButton variant="outline" tone="neutral" size="md">{{
                            t('account.quoteRequests.selectDate')
                        }}</UiButton>
                        <UiButton variant="outline" tone="neutral" size="md">{{
                            t('account.quoteRequests.filters')
                        }}</UiButton>
                    </div>
                </div>

                <div class="layout">
                    <aside class="left">
                        <article
                            v-for="(item, index) in requests"
                            :key="item.id"
                            class="request-item"
                            :class="{ active: index === 0 }"
                        >
                            <h3>
                                {{ t('account.quoteRequests.orderLabel') }} #{{
                                    item.id
                                }}
                            </h3>
                            <p>
                                {{ t('account.quoteRequests.quoteDate') }}:
                                {{ item.date }}
                            </p>
                        </article>
                    </aside>
                    <section class="chat">
                        <header>
                            <h2>
                                {{ t('account.quoteRequests.orderLabel') }}
                                #082410270004
                            </h2>
                            <span>{{
                                t('account.quoteRequests.status.inReview')
                            }}</span>
                        </header>
                        <div class="messages">
                            <div class="bubble">
                                {{ t('account.quoteRequests.sampleMessage') }}
                                <div class="request">
                                    <b
                                        >{{
                                            t(
                                                'account.quoteRequests.requestLabel'
                                            )
                                        }}:</b
                                    >
                                    {{
                                        t(
                                            'account.quoteRequests.sampleRequestPrefix'
                                        )
                                    }}
                                    / 200x200mm / 10pcs
                                </div>
                            </div>
                        </div>
                        <footer>
                            <input
                                type="text"
                                :placeholder="
                                    t(
                                        'account.quoteRequests.messagePlaceholder'
                                    )
                                "
                            />
                            <button type="button">
                                {{ t('account.quoteRequests.send') }}
                            </button>
                        </footer>
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
.head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
}
h1 {
    margin: 0;
    font-size: 52px;
    line-height: 1.05;
}
.tools {
    display: flex;
    gap: 8px;
}
.layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 14px;
}
.left {
    display: grid;
    gap: 8px;
    align-content: start;
}
.request-item {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 12px;
    background: var(--contrast-light);
}
.request-item.active {
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
h3 {
    margin: 0;
    font-size: 24px;
}
.request-item p {
    margin: 8px 0 0;
    font-size: 13px;
    color: var(--text-secondary);
}
.chat {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--contrast-light);
    min-height: 460px;
    display: grid;
    grid-template-rows: auto 1fr auto;
}
.chat > header {
    padding: 16px;
    border-bottom: 1px solid var(--border-default);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}
h2 {
    margin: 0;
    font-size: 34px;
}
.chat > header span {
    height: 26px;
    border-radius: 999px;
    background: #dbf7ef;
    color: #0f8a6a;
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 700;
}
.messages {
    padding: 16px;
}
.bubble {
    max-width: 620px;
    border-radius: 10px;
    background: #f6f2cd;
    padding: 12px;
    color: var(--text-primary);
    line-height: 1.5;
}
.request {
    margin-top: 8px;
    border: 1px solid #e8cd57;
    border-radius: 8px;
    padding: 10px;
    background: #ffffff;
}
footer {
    border-top: 1px solid var(--border-default);
    padding: 12px;
    display: flex;
    gap: 10px;
}
input {
    flex: 1;
    height: 42px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--contrast-light);
    padding: 0 12px;
}
button {
    width: 84px;
    border: 0;
    border-radius: 10px;
    background: var(--text-primary);
    color: #ffffff;
    font-weight: 700;
    cursor: pointer;
}
@media (max-width: 980px) {
    .layout {
        grid-template-columns: 1fr;
    }
}
</style>
