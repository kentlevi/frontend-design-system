<script setup lang="ts">
const { t } = useI18n();

defineProps<{
    year: number;
}>();
</script>

<template>
    <div class="home-footer-compact" data-testid="app-footer-compact-container">
        <div class="home-footer-compact-left" data-testid="app-footer-compact-left">
            <span class="home-footer-compact-copy">&copy; GLOPHICS Corp. {{ year }}</span>
            <a href="#" class="home-footer-compact-policy-link" data-testid="app-footer-compact-terms-link">{{ t('home.footer.terms') }}</a>
            <a href="#" class="home-footer-compact-policy-link" data-testid="app-footer-compact-privacy-link">{{ t('home.footer.privacy') }}</a>
        </div>
        <div class="home-footer-compact-links" data-testid="app-footer-compact-links">
            <a href="#" class="home-footer-compact-action-link" data-testid="app-footer-compact-inquiry-link">{{ t('home.footer.inquiry') }}</a>
            <a href="#" class="home-footer-compact-action-link" data-testid="app-footer-compact-faq-link">{{ t('home.footer.faq') }}</a>
        </div>
    </div>
</template>

<style scoped lang="scss">
.home-footer-compact {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--footer-bg);
    min-height: 102px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    .home-footer-compact-left {
        display: flex;
        align-items: center;
        gap: 28px;
        color: var(--footer-text-secondary);
        font-size: 12px;
        line-height: 1;

        .home-footer-compact-policy-link {
            color: var(--footer-text-primary);
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
        }
    }

    .home-footer-compact-links {
        display: flex;
        align-items: center;
        gap: 8px;

        .home-footer-compact-action-link {
            border: 1px solid var(--footer-border);
            color: var(--footer-text-secondary);
            font-size: 11px;
            text-decoration: none;
            padding: 6px 12px;
            border-radius: 3px;
            line-height: 1;
        }
    }
}

@media (max-width: 900px) {
    .home-footer-compact {
        min-height: auto;
        padding: 18px 16px;
        flex-direction: column;
        align-items: flex-start;
        .home-footer-compact-left {
            flex-wrap: wrap;
            gap: 12px;
            font-size: 12px;

            .home-footer-compact-policy-link {
                font-size: 12px;
            }
        }

        .home-footer-compact-links {
            .home-footer-compact-action-link {
                font-size: 11px;
            }
        }
    }
}
</style>
