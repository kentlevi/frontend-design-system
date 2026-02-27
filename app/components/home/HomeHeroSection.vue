<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <section class="home-hero" data-testid="home-hero-section">
        <div class="home-hero-container">
            <div class="home-hero-art">
                <img
                    class="home-hero-art-image"
                    src="/illustrations/products/sticker-kids/kid-decorating-sheet.svg"
                    :alt="t('home.hero.title')"
                    loading="eager"
                    fetchpriority="high"
                    decoding="sync"
                    width="280"
                    height="274"
                >
            </div>

            <div class="home-hero-content">
                <h1 class="home-hero-title">
                    {{ t('home.hero.title') }}
                </h1>
                <p class="home-hero-subtitle">{{ t('home.hero.subtitle') }}</p>
                <UiButton
                    variant="filled"
                    tone="neutral"
                    size="md"
                    class="home-hero-cta"
                    data-testid="home-hero-cta-button"
                >
                    {{ t('home.hero.cta') }}
                </UiButton>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-hero {
    background: var(--brand-primary);
    padding: 36px 24px 44px;
    max-height: 380px;

    .home-hero-container {
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 340px 1fr;
        align-items: center;
        justify-content: center;
        gap: 24px;

        .home-hero-art {
            width: 280px;
            height: 320px;
            display: grid;
            place-items: center;
            justify-self: end;

            .home-hero-art-image {
                height: 274px;
                object-fit: contain;
                display: block;
                position: relative;
                z-index: 1;
            }
        }

        .home-hero-content {
            max-width: 560px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;

            .home-hero-title {
                margin: 0;
                font-family: var(--font-base);
                font-size: 48px;
                line-height: 68px;
                
                color: #202638;
                font-weight: 700;
            }

            .home-hero-subtitle {
                margin: 0;
                font-size: 16px;
                line-height: 28px;
                color: #273046;
            }

            .home-hero-cta {
                width: 130px;
                border-radius: 16px;
                --btn-border: transparent;
                border: 0;
                box-shadow: none;
            }
        }
    }
}
</style>
