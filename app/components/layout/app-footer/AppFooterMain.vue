<script setup lang="ts">
const { t } = useI18n();

defineProps<{
    year: number;
    isProduct: boolean;
}>();
</script>

<template>
    <div class="home-footer-inner" :class="{ 'is-product': isProduct }" data-testid="app-footer-main-container">
        <div class="home-footer-left" data-testid="app-footer-main-left">
            <h2 class="home-footer-brand">MUSTICKER</h2>
            <p class="home-footer-meta">
                {{ t('layout.footer.meta1') }}
            </p>
            <p class="home-footer-meta">
                {{ t('layout.footer.meta2') }}
            </p>
            <p class="home-footer-copy">
                &copy; GLOPHICS Corp. {{ year }}
                <a href="#" class="home-footer-policy-link" data-testid="app-footer-main-terms-link">{{ t('layout.footer.terms') }}</a>
                <a href="#" class="home-footer-policy-link" data-testid="app-footer-main-privacy-link">{{ t('layout.footer.privacy') }}</a>
            </p>
        </div>

        <div class="home-footer-right" data-testid="app-footer-main-right">
            <p class="home-footer-phone">1588-5218</p>
            <p class="home-footer-hours">{{ t('layout.footer.hours') }}</p>
            <p class="home-footer-note">{{ t('layout.footer.closed') }}</p>
            <div class="home-footer-links">
                <a href="#" class="home-footer-action-link" data-testid="app-footer-main-inquiry-link">{{ t('layout.footer.inquiry') }}</a>
                <a href="#" class="home-footer-action-link" data-testid="app-footer-main-faq-link">{{ t('layout.footer.faq') }}</a>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.home-footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--footer-bg);
    color: var(--footer-text-muted);
    display: flex;
    justify-content: space-between;
    gap: 50px;
    padding: 56px 58px 42px;

    &.is-product {
        max-width: none;
        border-radius: 0;
        padding: 56px max(24px, calc((100vw - 1200px) / 2 + 58px)) 42px;
    }

    .home-footer-left {
        flex: 1;

        .home-footer-brand {
            margin: 0 0 18px;
            font-size: 34px;
            line-height: 1;
            color: var(--footer-text-primary);
            letter-spacing: 0.01em;
        }

        .home-footer-meta {
            margin: 6px 0;
            font-size: 12px;
            line-height: 1.55;
            color: var(--footer-text-subtle);
        }

        .home-footer-copy {
            margin: 18px 0 0;
            font-size: 12px;
            color: var(--footer-text-soft);
            display: flex;
            gap: 14px;

            .home-footer-policy-link {
                color: var(--footer-text-primary);
                text-decoration: none;
            }
        }
    }

    .home-footer-right {
        min-width: 250px;
        text-align: right;

        .home-footer-phone {
            margin: 0;
            font-size: 38px;
            color: var(--footer-text-primary);
            line-height: 1;
        }

        .home-footer-hours {
            margin: 10px 0 0;
            font-size: 13px;
            color: var(--footer-text-primary);
        }

        .home-footer-note {
            margin: 8px 0 18px;
            font-size: 12px;
            color: var(--footer-text-soft);
        }

        .home-footer-links {
            display: flex;
            justify-content: end;
            gap: 8px;

            .home-footer-action-link {
                border: 1px solid var(--footer-border);
                color: var(--footer-text-secondary);
                font-size: 11px;
                text-decoration: none;
                padding: 5px 10px;
                border-radius: 3px;
            }
        }
    }
}
</style>
