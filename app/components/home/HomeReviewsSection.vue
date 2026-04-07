<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useHomeReviewsCarousel } from '@/composables/home/reviewsCarousel/useHomeReviewsCarousel';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';

const { t, te } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();

type ReviewItem = {
	id: string;
	title: string;
	text: string;
	author: string;
	badge?: string;
	badgeTone?: 'default' | 'success';
	image: string;
};

const review_ids = [
	'service',
	'football',
	'products',
	'market',
] as const;

const reviews = computed<ReviewItem[]>(() =>
	review_ids.map((id, index) => ({
		id,
		title: t(`home.reviews.items.${id}.title`),
		text: t(`home.reviews.items.${id}.text`),
		author: t(`home.reviews.items.${id}.author`),
		badge: te(`home.reviews.items.${id}.badge`)
			? t(`home.reviews.items.${id}.badge`)
			: undefined,
		badgeTone: te(`home.reviews.items.${id}.badgeTone`)
			? (t(`home.reviews.items.${id}.badgeTone`) as ReviewItem['badgeTone'])
			: undefined,
		image: resolveFileUrl(`/home/reviews/review-0${index + 1}.png`),
	}))
);

const {
	section_ref,
	viewport_ref,
	track_style,
	can_go_prev,
	can_go_next,
	nextSlide,
	prevSlide,
	startAuto,
	stopAuto,
	setCardRef,
} = useHomeReviewsCarousel(computed(() => reviews.value.length), {
	gap: 24,
	intervalMs: 3200,
});
const carousel_label = computed(() => t('home.reviews.carouselLabel'));
</script>

<template>
	<section
		ref="section_ref"
		class="home-reviews"
		data-testid="home-reviews-section"
		:aria-label="t('home.reviews.carouselLabel')"
	>
		<div class="home-reviews-card">
			<div class="home-reviews-head">
				<h2 class="home-reviews-title">
					{{ t('home.reviews.titleLine1') }}<br >
					{{ t('home.reviews.titleLine2') }}
				</h2>

				<div class="home-reviews-controls">
					<UiButton
						variant="outline"
						tone="neutral"
						size="md"
						:icon-only="true"
						icon="strong-long-arrow-left"
						icon-size="md"
						:sr-label="t('home.reviews.controls.previous')"
						:aria-label="t('home.reviews.controls.previous')"
						class="home-reviews-arrow"
						data-testid="home-reviews-prev-button"
						:disabled="!can_go_prev"
						@click="prevSlide"
					/>
					<UiButton
						variant="outline"
						tone="neutral"
						size="md"
						:icon-only="true"
						icon="strong-long-arrow-right"
						icon-size="md"
						:sr-label="t('home.reviews.controls.next')"
						:aria-label="t('home.reviews.controls.next')"
						class="home-reviews-arrow"
						data-testid="home-reviews-next-button"
						:disabled="!can_go_next"
						@click="nextSlide"
					/>
				</div>
			</div>

			<div
				ref="viewport_ref"
				class="home-reviews-viewport"
				data-testid="home-reviews-viewport"
				role="region"
				aria-roledescription="carousel"
				:aria-label="carousel_label"
				@mouseenter="stopAuto"
				@mouseleave="startAuto"
			>
				<div class="home-reviews-row" :style="track_style">
					<article
						v-for="(review, idx) in reviews"
						:key="`${review.title}-${review.author}-${idx}`"
						:ref="
							(el) => {
								if (idx === 0)
									setCardRef(el);
							}
						"
						class="home-reviews-item"
						:data-testid="`home-review-card-${idx + 1}`"
						role="group"
						:aria-label="`Review ${idx + 1} of ${reviews.length}`"
					>
						<img
							class="home-reviews-media"
							:src="review.image"
							:alt="review.author"
							loading="lazy"
						>

						<div class="home-reviews-content">
							<div class="home-reviews-item-copy">
								<div class="home-reviews-item-head">
									<h3 class="home-reviews-item-title">
										{{ review.title }}
									</h3>
									<UiBadge
										v-if="review.badge"
										variant="outline"
										:tone="review.badgeTone ?? 'success'"
										size="sm"
										badge-class="home-reviews-badge"
									>
										{{ review.badge }}
									</UiBadge>
								</div>

								<p class="home-reviews-item-text">
									{{ review.text }}
								</p>
							</div>

							<p class="home-reviews-stars">
								<UiIcon
									v-for="star in 5"
									:key="`${review.title}-star-${star}`"
									name="strong-star"
									color="var(--amber-base)"
									size="var(--size-icon-md)"
								/>
								<span class="home-reviews-author">{{ review.author }}</span>
							</p>
						</div>
					</article>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.home-reviews {
    .home-reviews-card {
        border-radius: 16px;
        background: linear-gradient(
            180deg,
            var(--contrast-light) 6%,
            #efefef 100%
        );
        padding: 112px 78px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 48px;

        .home-reviews-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .home-reviews-title {

                font-size: var(--type-size-550);
                font-weight: var(--font-weight-bold);
                line-height: var(--type-line-550);
                color: var(--text-primary);
            }

            .home-reviews-controls {
                display: flex;
                gap: 10px;
                padding-top: 8px;

                .home-reviews-arrow {
                    width: 48px;
                    height: 48px;
                    border-radius: 999px;
                    border: 1px solid var(--border-default);
                    background: var(--contrast-light);
                    display: grid;
                    place-items: center;
                    cursor: pointer;

                    &:disabled {
                        opacity: 0.42;
                        cursor: default;
                    }
                }
            }
        }

        .home-reviews-viewport {
            overflow: hidden;

            .home-reviews-row {
                display: flex;
                gap: 24px;
                transition: transform 360ms ease;
                will-change: transform;

                .home-reviews-item {
                    flex: 0 0 calc((100% - 24px) / 2.18);
                    border-radius: 16px;
                    background: var(--contrast-light);
                    padding: 20px;
                    display: grid;
                    grid-template-columns: 144px 1fr;
                    gap: 18px;

                    .home-reviews-media {
                        width: 100%;
                        height: 100%;
                        max-height: 144px;
                        align-self: stretch;
                        border-radius: 18px;
                        object-fit: cover;
                    }

                    .home-reviews-content {
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;

                        .home-reviews-item-copy {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;

                            .home-reviews-item-head {
                                display: flex;
                                align-items: center;
                                gap: 10px;

                                .home-reviews-item-title {
                                    font-weight: var(--font-weight-bold);
                                    font-size: var(--type-size-100);
	                                line-height: var(--type-line-100);
                                    color: var(--text-primary);
                                    overflow-wrap: anywhere;
                                }
                            }

                            .home-reviews-item-text {
                                font-size: var(--type-size-100);
                            	line-height: var(--type-line-100);
                                color: var(--text-secondary);
                                overflow-wrap: anywhere;
                            }
                        }

                        .home-reviews-stars {
                            display: inline-flex;
                            align-items: center;
                            gap: 4px;

                            .home-reviews-author {
                                margin-left: 8px;
                                font-size: var(--type-size-100);
                            	line-height: var(--type-line-100);
                                color: var(--text-secondary);
                            }
                        }
                    }
                }
            }
        }

        .home-reviews-badge {
            height: 24px;
            font-size: var(--body-small);
            line-height: var(--type-line-100);
            border-radius: 999px;
            padding-inline: 10px;
        }
    }

    @media (max-width: 1280px) {
        .home-reviews-card {
            .home-reviews-viewport {
                .home-reviews-row {
                    .home-reviews-item {
                        grid-template-columns: 150px 1fr;
                    }
                }
            }
        }
    }

    @media (max-width: 1024px) {
        .home-reviews-card {
            padding: 32px 20px 28px;

            .home-reviews-head {
                .home-reviews-title {
                    font-size: var(--heading-3);
                    line-height: var(--type-line-100);
                }

                .home-reviews-controls {
                    .home-reviews-arrow {
                        width: 36px;
                        height: 36px;
                    }
                }
            }

            .home-reviews-viewport {
                .home-reviews-row {
                    .home-reviews-item {
                        flex-basis: calc((100% - 24px) / 1.25);
                        grid-template-columns: 120px 1fr;
                        gap: 12px;
                        padding: 14px;

                        .home-reviews-media {
                            min-height: 110px;
                            border-radius: 12px;
                        }

                        .home-reviews-content {
                            .home-reviews-item-head {
                                .home-reviews-item-title {
                                    font-size: var(--type-size-100);
                                	line-height: var(--type-line-100);
                                }
                            }

                            .home-reviews-item-text {
                                font-size: var(--body-base);
                                line-height: var(--type-line-100);
                            }

                            .home-reviews-stars {
                                .home-reviews-author {
                                    font-size: var(--body-base);
                                    line-height: var(--type-line-100);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>