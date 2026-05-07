<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const feature_highlight_video = resolveFileUrl('/home/feature/musticker-krdub-video-subs.mp4');
const feature_highlight_poster = resolveFileUrl('/home/feature/musticker-krdub-video-subs-thumbnail.png');

const feature_video = ref<HTMLVideoElement | null>(null);
const is_feature_video_hovered = ref(false);

async function playFeatureVideoWithSound() {
	const video = feature_video.value;
	if (!video) return;

	is_feature_video_hovered.value = true;
	video.muted = false;

	try {
		await video.play();
	} catch {
		playFeatureVideoMuted();
	}

	window.setTimeout(() => {
		if (!is_feature_video_hovered.value || !video.paused) return;

		playFeatureVideoMuted();
	}, 100);
}

function muteFeatureVideo() {
	is_feature_video_hovered.value = false;
	playFeatureVideoMuted();
}

function playFeatureVideoMuted() {
	const video = feature_video.value;
	if (!video) return;

	video.muted = true;
	void video.play().catch(() => {});
}
</script>

<template>
	<section class="home-feature" data-testid="home-feature-highlight-section">
		<div class="home-feature-card">
			<div class="home-feature-media" aria-hidden="true">
				<video
					ref="feature_video"
					:poster="feature_highlight_poster"
					class="home-feature-media-image"
					autoplay
					muted
					loop
					playsinline
					preload="metadata"
					@pointerenter="playFeatureVideoWithSound"
					@pointerleave="muteFeatureVideo"
					@pause="playFeatureVideoMuted"
				>
					<source :src="feature_highlight_video" type="video/mp4">
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
        border-radius: 16px;
        background: var(--gray-20);
        padding: 112px 78px;
        display: flex;
        gap: 56px;

        .home-feature-media {
			min-width: 512px;
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
            justify-content: center;
            gap: 20px;

            .home-feature-title {
                font-size: var(--type-size-550);
                line-height: var(--type-line-550);
                color: var(--black-base);
                font-weight: var(--font-weight-bold);
            }

            .home-feature-text {
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--gray-90);
                max-width: 560px;
                white-space: pre-line;
            }
        }
    }
}
</style>