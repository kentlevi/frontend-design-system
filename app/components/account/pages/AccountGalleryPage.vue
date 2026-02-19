<script setup lang="ts">
import { useAccountGallery } from '~/composables/account/useAccountGallery';

const { t } = useI18n();
const { items } = useAccountGallery();
</script>

<template>
    <section class="account-page" data-testid="account-gallery-page">
        <AccountShell active-tab="gallery">
            <div class="account-content" data-testid="account-gallery-content">
                <header class="account-gallery-header" data-testid="account-gallery-header">
                    <h1 class="account-gallery-title" data-testid="account-gallery-title">{{ t('account.gallery.title') }}</h1>
                    <div class="account-gallery-actions" data-testid="account-gallery-actions">
                        <UiButton variant="outline" tone="neutral" size="md" data-testid="account-gallery-filters">
                            {{ t('account.gallery.filters') }}
                        </UiButton>
                        <input
                            class="account-gallery-search"
                            type="text"
                            :placeholder="t('account.gallery.searchPlaceholder')"
                            data-testid="account-gallery-search"
                        />
                    </div>
                </header>

                <div class="account-gallery-grid" data-testid="account-gallery-grid">
                    <article
                        v-for="item in items"
                        :key="item.name"
                        class="account-gallery-card"
                        :data-testid="`account-gallery-item-${item.name}`"
                    >
                        <div class="account-gallery-preview" />
                        <h3 class="account-gallery-name">{{ item.name }}</h3>
                        <p class="account-gallery-size">
                            {{ t('account.gallery.sizeLabel') }} {{ item.size }} {{ t('account.gallery.sizeUnit') }}
                        </p>
                        <span class="account-gallery-tag">{{ t(`account.gallery.tags.${item.tag}`) }}</span>
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

    .account-gallery-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;

        .account-gallery-title {
            margin: 0;
            font-size: 52px;
            line-height: 1.05;
        }

        .account-gallery-actions {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .account-gallery-search {
            width: 180px;
            height: 42px;
            border: 1px solid var(--border-default);
            border-radius: 10px;
            background: var(--contrast-light);
            padding: 0 12px;
            font-size: 14px;
        }
    }

    .account-gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;

        .account-gallery-card {
            border: 1px solid var(--border-default);
            border-radius: 10px;
            background: var(--contrast-light);
            padding: 14px;

            .account-gallery-preview {
                aspect-ratio: 16 / 9;
                border-radius: 8px;
                background: linear-gradient(135deg, var(--surface-subtle), var(--border-default));
                margin-bottom: 12px;
            }

            .account-gallery-name {
                margin: 0;
                font-size: 20px;
            }

            .account-gallery-size {
                margin: 6px 0 0;
                font-size: 13px;
                color: var(--text-secondary);
            }

            .account-gallery-tag {
                margin-top: 10px;
                height: 24px;
                border-radius: 999px;
                padding: 0 10px;
                display: inline-flex;
                align-items: center;
                background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
                color: var(--text-primary);
                font-size: 12px;
                font-weight: 700;
            }
        }
    }

    @media (max-width: 980px) {
        .account-gallery-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
