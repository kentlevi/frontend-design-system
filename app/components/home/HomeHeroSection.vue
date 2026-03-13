<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCountry } from '~/composables/app/country/useCountry';

const { t } = useI18n();
const { withCountry } = useCountry();

async function onOrderNowClick() {
	await navigateTo(withCountry('/stickers/die-cut'));
}
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
				<div class="home-hero-copy">
					<h1 class="home-hero-title">
						{{ t('home.hero.title') }}
					</h1>
					<p class="home-hero-subtitle">{{ t('home.hero.subtitle') }}</p>
				</div>
				<UiButton
					variant="filled"
					tone="neutral"
					size="lg"
					class="home-hero-cta"
					data-testid="home-hero-cta-button"
					@click="onOrderNowClick"
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
    margin-bottom: 56px;

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
            gap: 32px;

            .home-hero-copy {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .home-hero-title {

                font-family: var(--font-base);
                font-size: var(--type-size-600);
                font-weight: var(--font-weight-bold);
                line-height: var(--type-line-600);
                color: var(--abyss-base);
            }

            .home-hero-subtitle {

                font-size: var(--type-size-300);
                line-height: var(--type-line-300);
                color: var(--abyss-base);
            }

            .home-hero-cta {
                width: 160px;
                border-radius: 16px;
                --btn-border: transparent;
                border: 0;
                box-shadow: none;
                font-size: var(--type-size-200);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-200);
            }
        }
    }
}
</style>