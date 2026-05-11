<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCountry } from '~/composables/app/country/useCountry';

const { t } = useI18n();
const { withCountry } = useCountry();

async function onOrderNowClick() {
	await navigateTo(withCountry('/stickers/die-cut-sticker'));
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
    height: 336px;

    .home-hero-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        max-width: 1200px;
        height: 100%;
        margin: 0 auto;

        .home-hero-art {
            position: absolute;
            left: 144px;
            z-index: 1;
            pointer-events: none;
            max-height: 248px;
            max-width: 204px;

            .home-hero-art-image {
                object-fit: contain;
                display: block;
                position: relative;
                height: 100%;
            }
        }

        .home-hero-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 32px;
            position: relative;
            z-index: 2;

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
                white-space: pre-line;
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

    @media (max-width: 1024px) {
        .home-hero-art {
            opacity: 0.3; /* Fade it out or hide on smaller screens to avoid overlap */
            left: -50px;
        }
    }

    @media (max-width: 768px) {
        .home-hero-art {
            display: none;
        }
    }
}
</style>