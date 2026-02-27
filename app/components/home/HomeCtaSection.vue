<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFileBaseUrl } from '~/composables/core/useFileBaseUrl';

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const ctaBackgroundImage = resolveFileUrl('/home/cta/home-cta-bg.png');
</script>

<template>
    <section class="home-cta" data-testid="home-cta-section">
        <div class="home-cta-panel" :style="{ backgroundImage: `url(${ctaBackgroundImage})` }">
            <div class="home-cta-inner">
                <h2 class="home-cta-title">
                    {{ t('home.cta.titleLine1') }}<br >
                    {{ t('home.cta.titleLine2') }}
                </h2>

                <div class="home-cta-actions">
                    <UiButton
                        variant="filled"
                        tone="default"
                        size="lg"
                        class="home-cta-btn"
                        data-testid="home-cta-primary-button"
                    >
                        {{ t('home.cta.primary') }}
                    </UiButton>
                    <UiButton
                        variant="outline"
                        tone="default"
                        size="lg"
                        class="home-cta-btn-alt"
                        data-testid="home-cta-secondary-button"
                    >
                        {{ t('home.cta.secondary') }}
                    </UiButton>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-cta {
    margin-bottom: 0;

    .home-cta-panel {
        max-width: 1200px;
        margin: 0 auto;
        min-height: 520px;
        border-radius: 0;
        overflow: hidden;
        background-color: var(--brand-primary);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        display: grid;
        place-items: center;

        .home-cta-inner {
            text-align: center;
            padding: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 64px;

            .home-cta-title {
                margin: 0;
                font-family: var(--font-base);
                color: var(--contrast-light);
                font-size: 48px;
                line-height: 68px;
                font-weight: 700;
            }

            .home-cta-actions {
                display: flex;
                justify-content: center;
                gap: 14px;

                .home-cta-btn {
                    width: 232px;
                    border-radius: 10px;
                    border: 0;
                    background: var(--contrast-light);
                    color: #4747FF;
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 32px;
                    box-shadow: none;
                }

                .home-cta-btn-alt {
                    width: 232px;
                    border-radius: 10px;
                    --btn-bg: var(--contrast-light);
                    --btn-border: color-mix(in srgb, var(--contrast-light) 80%, transparent);
                    --btn-soft: color-mix(in srgb, var(--contrast-light) 22%, transparent);
                    border-color: color-mix(in srgb, var(--contrast-light) 80%, transparent);
                    color: var(--contrast-light);
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 32px;
                    background: #4747FF;
                }
            }
        }
    }
}
</style>
