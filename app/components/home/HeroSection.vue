<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <section class="home-hero">
        <div class="home-hero-container">
            <div class="home-hero-art">
                <div class="home-hero-art-sheet">
                    <UiLogo
                        name="musticker"
                        variant="mark"
                        color="colored"
                        :size="72"
                    />
                </div>
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

    .home-hero-container {
        max-width: 1280px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 340px 1fr;
        align-items: center;
        justify-content: center;
        gap: 24px;
    }

    .home-hero-art {
        width: 300px;
        height: 210px;
        border-radius: 24px;
        background: linear-gradient(155deg, #f3f3f3 0%, #e8e8e8 100%);
        border: 2px solid #303548;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-self: end;
        position: relative;

        &::before,
        &::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: #252b3f;
        }

        &::before {
            width: 70px;
            height: 70px;
            top: -18px;
            left: 36px;
        }

        &::after {
            width: 22px;
            height: 22px;
            right: 26px;
            bottom: 20px;
            background: #f2dc5c;
            border: 2px solid #252b3f;
        }
    }

    .home-hero-art-sheet {
        width: 130px;
        height: 130px;
        border-radius: 18px;
        background: #ffffff;
        border: 2px solid #2c3247;
        display: grid;
        place-items: center;
        transform: rotate(-18deg);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .home-hero-content {
        max-width: 560px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .home-hero-title {
        margin: 0;
        font-family: var(--font-base);
        font-size: 48px;
        line-height: 68px;
        letter-spacing: -0.5px;
        color: #202638;
        font-weight: 700;
    }

    .home-hero-subtitle {
        margin: 0;
        font-size: 18px;
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
</style>
