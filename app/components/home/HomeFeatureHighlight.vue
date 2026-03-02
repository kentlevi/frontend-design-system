<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFileBaseUrl } from '~/composables/core/useFileBaseUrl';

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const featureHighlightImage = resolveFileUrl('/home/feature/home-feature-highlight.png');
</script>

<template>
    <section class="home-feature" data-testid="home-feature-highlight-section">
        <div class="home-feature-card">
            <div class="home-feature-media" aria-hidden="true">
                <img
                    :src="featureHighlightImage"
                    :alt="t('home.feature.titleLine1')"
                    class="home-feature-media-image"
                    loading="lazy"
                >
            </div>

            <div class="home-feature-copy">
                <h2 class="home-feature-title">
                    {{ t('home.feature.titleLine1') }}<br >
                    {{ t('home.feature.titleLine2') }}
                </h2>

                <p class="home-feature-text">
                    {{ t('home.feature.text') }}
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-feature {
    margin-bottom: 72px;

    .home-feature-card {
        max-width: 1200px;
        height: 512px;
        margin: 0 auto;
        border-radius: 16px;
        background: var(--gray-20);
        padding: 64px 58px;
        display: grid;
        grid-template-columns: 492px 1fr;
        align-items: center;
        gap: 56px;

        .home-feature-media {
            height: 288px;
            border-radius: 14px;
            position: relative;
            overflow: hidden;
            background: var(--gray-20);

            .home-feature-media-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
        }

        .home-feature-copy {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .home-feature-title {
                margin: 0;
                font-family: var(--font-base);
                font-size: 36px;
                line-height: 52px;
                
                color: #252b3a;
                font-weight: 700;
            }

            .home-feature-text {
                margin: 0;
                font-size: 14px;
                line-height: 1.7;
                color: #4c5261;
                max-width: 560px;
            }
        }
    }
}
</style>
