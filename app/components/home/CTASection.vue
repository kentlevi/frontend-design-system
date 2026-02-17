<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <section class="home-cta">
        <div class="home-cta-panel">
            <div class="home-cta-inner">
                <h2 class="home-cta-title">
                    {{ t('home.cta.titleLine1') }}<br />
                    {{ t('home.cta.titleLine2') }}
                </h2>

                <div class="home-cta-actions">
                    <UiButton
                        variant="filled"
                        tone="default"
                        size="md"
                        class="home-cta-btn"
                    >
                        {{ t('home.cta.primary') }}
                    </UiButton>
                    <UiButton
                        variant="outline"
                        tone="default"
                        size="md"
                        class="home-cta-btn-alt"
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
    padding: 0 24px;
    margin-bottom: 0;

    .home-cta-panel {
        max-width: 1200px;
        margin: 0 auto;
        min-height: 380px;
        border-radius: 0;
        overflow: hidden;
        background:
            linear-gradient(
                66deg,
                rgba(255, 255, 255, 0.08) 14%,
                rgba(255, 255, 255, 0) 14% 40%,
                rgba(255, 255, 255, 0.08) 40% 60%,
                rgba(255, 255, 255, 0) 60%
            ),
            radial-gradient(
                circle at 98% 100%,
                rgba(255, 255, 255, 0.06) 0 14%,
                rgba(255, 255, 255, 0) 14%
            ),
            linear-gradient(120deg, #3d40e8 0%, #4f56f2 48%, #3d44ee 100%);
        display: grid;
        place-items: center;
    }

    .home-cta-inner {
        text-align: center;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 42px;
    }

    .home-cta-title {
        margin: 0;
        font-family: var(--font-base);
        color: #ffffff;
        font-size: 48px;
        line-height: 68px;
        letter-spacing: -0.5px;
        font-weight: 700;
    }

    .home-cta-actions {
        display: flex;
        justify-content: center;
        gap: 14px;
    }

    .home-cta-btn {
        width: 176px;
        border-radius: 10px;
        border: 0;
        background: #f5f7ff;
        color: #3643e8;
        box-shadow: none;
    }

    .home-cta-btn-alt {
        width: 176px;
        border-radius: 10px;
        --btn-bg: #ffffff;
        --btn-border: rgba(255, 255, 255, 0.8);
        --btn-soft: rgba(255, 255, 255, 0.22);
        border-color: rgba(255, 255, 255, 0.8);
        color: #ffffff;
        background: transparent;
    }
}
</style>
