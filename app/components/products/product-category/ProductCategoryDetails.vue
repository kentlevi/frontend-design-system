<script setup lang="ts">
import type { ProductCategoryKey } from '~/types/products/catalog';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';

type StoryMedia = {
	type: 'image' | 'video';
	src: string;
	poster?: string;
};

type StoryRow = {
	title: string;
	text: string;
	reverse?: boolean;
	media: StoryMedia;
};

const DEFAULT_PRODUCT_STORY_MEDIA: [StoryMedia, StoryMedia, StoryMedia] = [
	{
		type: 'video',
		src: 'products/die-cut-sticker/features/01-skater-sticker-on-car-video.mp4',
		poster: 'products/die-cut-sticker/features/01-skater-sticker-on-car-placeholder.png',
	},
	{
		type: 'video',
		src: 'products/die-cut-sticker/features/02-watermelon-design-on-tablet-video.mp4',
		poster: 'products/die-cut-sticker/features/02-watermelon-design-on-tablet-placeholder.png',
	},
	{
		type: 'image',
		src: 'products/die-cut-sticker/features/03-multiple-diecut-stickers-in-hand-placeholder.png',
	},
];

const props = defineProps<{
	category: ProductCategoryKey;
	selectedProductId?: string | null;
}>();

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();

function resolveStoryMedia(media: StoryMedia): StoryMedia {
	return {
		...media,
		src: resolveFileUrl(media.src),
		poster: media.poster ? resolveFileUrl(media.poster) : undefined,
	};
}

const navigationStoryRowsByCategory: Record<ProductCategoryKey, StoryRow[]> = {
	stickers: [
		{
			title: t('product.story.navigation.stickers.row1.title'),
			text: t('product.story.navigation.stickers.row1.text'),
			media: {
				type: 'image',
				src: 'products/stickers/features/01-premium-quality.png',
			},
		},
		{
			title: t('product.story.navigation.stickers.row2.title'),
			text: t('product.story.navigation.stickers.row2.text'),
			reverse: true,
			media: {
				type: 'image',
				src: 'products/stickers/features/02-long-lasting-color.png',
			},
		},
		{
			title: t('product.story.navigation.stickers.row3.title'),
			text: t('product.story.navigation.stickers.row3.text'),
			media: {
				type: 'image',
				src: 'products/stickers/features/03-built-to-last.png',
			},
		},
	],
	'roll-stickers': [
		{
			title: t('product.story.navigation.rollStickers.row1.title'),
			text: t('product.story.navigation.rollStickers.row1.text'),
			media: {
				type: 'image',
				src: 'products/roll-stickers/features/01-efficient-ready-apply.png',
			},
		},
		{
			title: t('product.story.navigation.rollStickers.row2.title'),
			text: t('product.story.navigation.rollStickers.row2.text'),
			reverse: true,
			media: {
				type: 'image',
				src: 'products/roll-stickers/features/02-smooth-seamless.png',
			},
		},
		{
			title: t('product.story.navigation.rollStickers.row3.title'),
			text: t('product.story.navigation.rollStickers.row3.text'),
			media: {
				type: 'image',
				src: 'products/roll-stickers/features/03-fast-clean-reliable.png',
			},
		},
	],
	'sheet-stickers': [
		{
			title: t('product.story.navigation.sheetStickers.row1.title'),
			text: t('product.story.navigation.sheetStickers.row1.text'),
			media: {
				type: 'image',
				src: 'products/sheet-stickers/features/01-more-stickers-creativity.png',
			},
		},
		{
			title: t('product.story.navigation.sheetStickers.row2.title'),
			text: t('product.story.navigation.sheetStickers.row2.text'),
			reverse: true,
			media: {
				type: 'image',
				src: 'products/sheet-stickers/features/02-all-in-one-sheet.png',
			},
		},
		{
			title: t('product.story.navigation.sheetStickers.row3.title'),
			text: t('product.story.navigation.sheetStickers.row3.text'),
			media: {
				type: 'image',
				src: 'products/sheet-stickers/features/03-organized-ready-peel.png',
			},
		},
	],
};

function getDefaultProductStoryMedia(index: 0 | 1 | 2): StoryMedia {
	return resolveStoryMedia(DEFAULT_PRODUCT_STORY_MEDIA[index]);
}

function selectedProductName() {
	if (!props.selectedProductId) return '';
	return t(`product.items.${props.selectedProductId}.name`);
}

function selectedProductBlurb() {
	if (!props.selectedProductId) return '';
	return t(`product.items.${props.selectedProductId}.blurb`);
}

const storyRows = computed<StoryRow[]>(() => {
	const navigationRows = (navigationStoryRowsByCategory[props.category] || []).map((row) => ({
		...row,
		media: resolveStoryMedia(row.media),
	}));
	if (!props.selectedProductId) return navigationRows;

	const name = selectedProductName();
	const blurb = selectedProductBlurb();
	return [
		{
			title: t('product.story.productMode.row1.title', { name }),
			text: t('product.story.productMode.row1.text', { blurb }),
			media: getDefaultProductStoryMedia(0),
		},
		{
			title: t('product.story.productMode.row2.title', { name }),
			text: t('product.story.productMode.row2.text', { blurb }),
			reverse: true,
			media: getDefaultProductStoryMedia(1),
		},
		{
			title: t('product.story.productMode.row3.title', { name }),
			text: t('product.story.productMode.row3.text', { blurb }),
			media: getDefaultProductStoryMedia(2),
		},
	];
});
</script>

<template>
	<section class="product-guarantees-band" data-testid="product-category-guarantees-band">
		<div class="product-guarantees" data-testid="product-category-guarantees">
			<article class="guarantee-card" data-testid="product-category-guarantee-made-today">
				<img
					src="/icons/custom/guarantees/delivery-truck.svg"
					:alt="t('product.guarantees.madeToday.title')"
					loading="lazy" class="product-details-image" >
				<h4 class="product-guarantee-title">{{ t('product.guarantees.madeToday.title') }}</h4>
				<p class="product-details-text">{{ t('product.guarantees.madeToday.text') }}</p>
			</article>
			<article class="guarantee-card" data-testid="product-category-guarantee-proof-review">
				<img
					src="/icons/custom/guarantees/proof-review.svg"
					:alt="t('product.guarantees.proofReview.title')"
					loading="lazy" class="product-details-image" >
				<h4 class="product-guarantee-title">{{ t('product.guarantees.proofReview.title') }}</h4>
				<p class="product-details-text">{{ t('product.guarantees.proofReview.text') }}</p>
			</article>
			<article class="guarantee-card" data-testid="product-category-guarantee-durability">
				<img
					src="/icons/custom/guarantees/weather-durability.svg"
					:alt="t('product.guarantees.durability.title')"
					loading="lazy" class="product-details-image" >
				<h4 class="product-guarantee-title">{{ t('product.guarantees.durability.title') }}</h4>
				<p class="product-details-text">{{ t('product.guarantees.durability.text') }}</p>
			</article>
		</div>
	</section>

	<div class="product-experience-container" data-testid="product-category-story-container">
		<section class="product-story" data-testid="product-category-story">
			<article
				v-for="(row, index) in storyRows"
				:key="`product-story-row-${index}`"
				class="story-row"
				:class="{ reverse: row.reverse }"
				:data-testid="`product-category-story-row-${index + 1}`"
			>
				<div class="story-image">
					<video
						v-if="row.media.type === 'video'"
						:poster="row.media.poster"
						class="product-details-image"
						autoplay
						muted
						loop
						playsinline
						preload="metadata"
					>
						<source :src="row.media.src" type="video/mp4">
					</video>
					<img
						v-else
						:src="row.media.src"
						:alt="row.title"
						loading="lazy"
						class="product-details-image"
					>
				</div>
				<div class="story-copy">
					<h3 class="product-story-title">{{ row.title }}</h3>
					<p class="product-details-text">{{ row.text }}</p>
				</div>
			</article>
		</section>
	</div>
</template>

<style scoped lang="scss">
.product-guarantees-band {
    background: var(--gray-10);
    padding: 48px 0;

    .product-guarantees {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;

        .guarantee-card {
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 16px;

            .product-details-image {
                width: 120px;
                height: 96px;
                object-fit: contain;
                display: block;
                margin: 0 auto;
            }

            .product-guarantee-title {
                font-size: var(--type-size-300);
				font-weight: var(--font-weight-medium);
                line-height: var(--type-line-300);
                color: var(--text-primary);
            }

            .product-details-text {
                padding: 0 40px;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-secondary);
            }
        }
    }
}

.product-experience-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;

    .product-story {
        padding: 144px 0;
        display: flex;
        flex-direction: column;
        gap: 144px;

        .story-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 24px;

            &.reverse {
                .story-image {
                    order: 2;
                }

                .story-copy {
                    order: 1;
                }
            }
        }

        .story-image {
            height: 352px;
            border-radius: 18px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            .product-details-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
        }

        .story-copy {
            padding: 0 80px;
            display: flex;
            flex-direction: column;
            gap: 24px;

            .product-story-title {
                font-size: var(--type-size-550);
                line-height: var(--type-line-550);
                color: var(--text-primary);
            }

            .product-details-text {

                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
                color: var(--text-secondary);
            }
        }
    }
}

@media (max-width: 980px) {
    .product-guarantees-band {
        .product-guarantees {
            grid-template-columns: 1fr;
        }
    }

    .product-experience-container {
        .product-story {
            .story-copy {
                .product-story-title {
                    font-size: var(--type-size-500);
                    line-height: var(--type-line-500);
                }
            }
        }
    }
}

@media (max-width: 760px) {
    .product-experience-container {
        .product-story {
            .story-row {
                grid-template-columns: 1fr;
                gap: 18px;
            }

            .story-row.reverse {
                .story-image,
                .story-copy {
                    order: initial;
                }
            }
        }
    }
}
</style>