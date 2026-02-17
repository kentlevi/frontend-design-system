<script setup lang="ts">
definePageMeta({
    layout: 'home',
});
const { t } = useI18n();

const items = [
    { name: 'circle-wave.png', size: '200x200', tag: 'Branding' },
    { name: 'wave.png', size: '300x272', tag: 'Branding' },
    { name: 'into-the-80s.png', size: '320x160', tag: 'Branding' },
    { name: 'findwater.png', size: '220x240', tag: 'Outdoor' },
    { name: 'kickflip2025.png', size: '700x500', tag: 'Skating' },
];
</script>

<template>
    <section class="account-page">
        <AccountShell active-tab="gallery">
            <div class="account-content">
                <div class="page-head">
                    <h1>{{ t('account.gallery.title') }}</h1>
                    <div class="actions">
                        <UiButton variant="outline" tone="neutral" size="md">{{
                            t('account.gallery.filters')
                        }}</UiButton>
                        <input
                            class="search"
                            type="text"
                            :placeholder="
                                t('account.gallery.searchPlaceholder')
                            "
                        />
                    </div>
                </div>

                <div class="grid">
                    <article
                        v-for="item in items"
                        :key="item.name"
                        class="card"
                    >
                        <div class="preview" />
                        <h3>{{ item.name }}</h3>
                        <p>
                            {{ t('account.gallery.sizeLabel') }} {{ item.size }}
                            {{ t('account.gallery.sizeUnit') }}
                        </p>
                        <span class="tag">{{
                            t(`account.gallery.tags.${item.tag}`)
                        }}</span>
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

    .page-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;

        h1 {
            margin: 0;
            font-size: 52px;
            line-height: 1.05;
        }
    }

    .actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .search {
        width: 180px;
        height: 42px;
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 0 12px;
        font-size: 14px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
    }

    .card {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 14px;

        .preview {
            aspect-ratio: 16 / 9;
            border-radius: 8px;
            background: linear-gradient(135deg, #f4f4f4, #ececec);
            margin-bottom: 12px;
        }

        h3 {
            margin: 0;
            font-size: 20px;
        }

        p {
            margin: 6px 0 0;
            font-size: 13px;
            color: var(--text-secondary);
        }

        .tag {
            margin-top: 10px;
            height: 24px;
            border-radius: 999px;
            padding: 0 10px;
            display: inline-flex;
            align-items: center;
            background: #ddf7ef;
            color: #0f8a6a;
            font-size: 12px;
            font-weight: 700;
        }
    }

    @media (max-width: 980px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
