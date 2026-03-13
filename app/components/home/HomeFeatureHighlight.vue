<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const featureHighlightVideo = resolveFileUrl('/home/feature/home-feature-highlight-video-initial.mp4');
const featureHighlightPoster = resolveFileUrl('/home/feature/home-feature-highlight-poster-initial.png');
</script>

<template>
	<section class="home-feature" data-testid="home-feature-highlight-section">
		<div class="home-feature-card">
			<div class="home-feature-media" aria-hidden="true">
				<video
					:poster="featureHighlightPoster"
					class="home-feature-media-image"
					autoplay
					muted
					loop
					playsinline
					preload="metadata"
				>
					<source :src="featureHighlightVideo" type="video/mp4">
				</video>
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

                font-family: var(--font-base);
                font-size: var(--type-size-550);
                line-height: var(--type-line-550);

                color: #252b3a;
                font-weight: var(--font-weight-bold);
            }

            .home-feature-text {

                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: #4c5261;
                max-width: 560px;
            }
        }
    }
}
</style>