<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <section class="home-feature" data-testid="home-feature-highlight-section">
        <div class="home-feature-card">
            <div class="home-feature-media" aria-hidden="true">
                <div class="home-feature-sticker home-feature-sticker-a"/>
                <div class="home-feature-sticker home-feature-sticker-b"/>
                <div class="home-feature-sticker home-feature-sticker-c"/>
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
    padding: 24px 24px 70px;

    .home-feature-card {
        max-width: 1200px;
        margin: 0 auto;
        border-radius: 16px;
        background: var(--gray-20);
        padding: 64px 58px;
        display: grid;
        grid-template-columns: 420px 1fr;
        align-items: center;
        gap: 46px;

        .home-feature-media {
            height: 230px;
            border-radius: 14px;
            background: linear-gradient(
                130deg,
                #2f7b97 0%,
                #3b5a72 50%,
                #8b8f95 100%
            );
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                width: 320px;
                height: 320px;
                border-radius: 50%;
                right: -120px;
                top: -40px;
                background: rgba(255, 255, 255, 0.22);
            }

            .home-feature-sticker {
                position: absolute;
                width: 80px;
                height: 58px;
                border-radius: 12px;
                background: #ffffff;
                border: 2px solid #253043;
            }

            .home-feature-sticker-a {
                left: 46px;
                top: 98px;
                transform: rotate(-8deg);
            }

            .home-feature-sticker-b {
                left: 136px;
                top: 72px;
                transform: rotate(7deg);
            }

            .home-feature-sticker-c {
                left: 234px;
                top: 116px;
                transform: rotate(-12deg);
            }
        }

        .home-feature-copy {
            display: flex;
            flex-direction: column;
            gap: 18px;

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
