<script setup lang="ts">
import type { ProductCategoryKey } from '~/types/products/catalog';

import { useProductExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';

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
		poster: 'products/die-cut-sticker/features/01-skater-sticker-on-car-placeholder.webp',
	},
	{
		type: 'video',
		src: 'products/die-cut-sticker/features/02-product-story-video.mp4',
		poster: 'products/die-cut-sticker/features/02-product-story-placeholder.webp',
	},
	{
		type: 'video',
		src: 'products/die-cut-sticker/features/03-product-story-video.mp4',
		poster: 'products/die-cut-sticker/features/03-product-story-placeholder.webp'
	},
];

const route = useRoute();
const { t: translate } = useI18n();
const PRODUCT_MEDIA_BASE_URL = 'https://static.musticker.com/dev/store-front/products';

const {
	selected_id,
} = useProductExperience();

const category = computed(() => route.params.category as ProductCategoryKey);

function resolveStoryMedia(media: StoryMedia): StoryMedia {
	return {
		...media,
		src: resolveProductMediaUrl(media.src),
		poster: media.poster ? resolveProductMediaUrl(media.poster) : undefined,
	};
}

function resolveProductMediaUrl(path: string) {
	if (/^https?:\/\//.test(path)) return path;

	return `${PRODUCT_MEDIA_BASE_URL}/${path.replace(/^\/?products\//, '').replace(/^\/+/, '')}`;
}

const navigation_story_rows_by_category: Record<ProductCategoryKey, StoryRow[]> = {
	stickers: [
		{
			title: translate('product.story.navigation.stickers.row1.title'),
			text: translate('product.story.navigation.stickers.row1.text'),
			media: {
				type: 'image',
				src: 'products/stickers/features/01-premium-quality.png',
			},
		},
		{
			title: translate('product.story.navigation.stickers.row2.title'),
			text: translate('product.story.navigation.stickers.row2.text'),
			reverse: true,
			media: {
				type: 'image',
				src: 'products/stickers/features/02-long-lasting-color.png',
			},
		},
		{
			title: translate('product.story.navigation.stickers.row3.title'),
			text: translate('product.story.navigation.stickers.row3.text'),
			media: {
				type: 'image',
				src: 'products/stickers/features/03-built-to-last.png',
			},
		},
	],
	'roll-stickers': [
		{
			title: translate('product.story.navigation.rollStickers.row1.title'),
			text: translate('product.story.navigation.rollStickers.row1.text'),
			media: {
				type: 'image',
				src: 'products/roll-stickers/features/01-efficient-ready-apply.png',
			},
		},
		{
			title: translate('product.story.navigation.rollStickers.row2.title'),
			text: translate('product.story.navigation.rollStickers.row2.text'),
			reverse: true,
			media: {
				type: 'image',
				src: 'products/roll-stickers/features/02-smooth-seamless.png',
			},
		},
		{
			title: translate('product.story.navigation.rollStickers.row3.title'),
			text: translate('product.story.navigation.rollStickers.row3.text'),
			media: {
				type: 'image',
				src: 'products/roll-stickers/features/03-fast-clean-reliable.png',
			},
		},
	],
	'sheet-stickers': [
		{
			title: translate('product.story.navigation.sheetStickers.row1.title'),
			text: translate('product.story.navigation.sheetStickers.row1.text'),
			media: {
				type: 'image',
				src: 'products/sheet-stickers/features/01-more-stickers-creativity.png',
			},
		},
		{
			title: translate('product.story.navigation.sheetStickers.row2.title'),
			text: translate('product.story.navigation.sheetStickers.row2.text'),
			reverse: true,
			media: {
				type: 'image',
				src: 'products/sheet-stickers/features/02-all-in-one-sheet.png',
			},
		},
		{
			title: translate('product.story.navigation.sheetStickers.row3.title'),
			text: translate('product.story.navigation.sheetStickers.row3.text'),
			media: {
				type: 'image',
				src: 'products/sheet-stickers/features/03-organized-ready-peel.png',
			},
		},
	],
	'vinyl-lettering': [
		{
			title: translate('product.story.navigation.vinylLettering.row1.title'),
			text: translate('product.story.navigation.vinylLettering.row1.text'),
			media: {
				type: 'image',
				src: 'products/stickers/features/01-premium-quality.png',
			},
		},
		{
			title: translate('product.story.navigation.vinylLettering.row2.title'),
			text: translate('product.story.navigation.vinylLettering.row2.text'),
			reverse: true,
			media: {
				type: 'image',
				src: 'products/stickers/features/02-long-lasting-color.png',
			},
		},
		{
			title: translate('product.story.navigation.vinylLettering.row3.title'),
			text: translate('product.story.navigation.vinylLettering.row3.text'),
			media: {
				type: 'image',
				src: 'products/stickers/features/03-built-to-last.png',
			},
		},
	],
};

function getDefaultProductStoryMedia(index: 0 | 1 | 2): StoryMedia {
	return resolveStoryMedia(DEFAULT_PRODUCT_STORY_MEDIA[index]);
}

function getSelectedProductName() {
	if (!selected_id.value) return '';
	const page_key = `product.pageNames.${selected_id.value}`;
	const page_value = translate(page_key);
	return page_value === page_key ? translate(`product.items.${selected_id.value}.name`) : page_value;
}

function getSelectedProductBlurb() {
	if (!selected_id.value) return '';
	return translate(`product.items.${selected_id.value}.blurb`);
}

function getProductStoryValue(row: 'row1' | 'row2' | 'row3', field: 'title' | 'text', fallback: string) {
	if (!selected_id.value) return fallback;

	const product_id = String(selected_id.value);
	const override_key = `product.story.productModeByProduct.${product_id}.${row}.${field}`;
	const override_value = translate(override_key);
	if (override_value !== override_key) return override_value;

	if (product_id === 'custom-lettering') {
		const vinyl_override_key = `product.story.productModeByProduct.vinyl-lettering.${row}.${field}`;
		const vinyl_override_value = translate(vinyl_override_key);
		if (vinyl_override_value !== vinyl_override_key) return vinyl_override_value;
	}

	return fallback;
}

const story_rows = computed<StoryRow[]>(() => {
	const navigation_rows = (navigation_story_rows_by_category[category.value] || []).map((row) => ({
		...row,
		media: resolveStoryMedia(row.media),
	}));
	if (!selected_id.value) return navigation_rows;

	const name = getSelectedProductName();
	const blurb = getSelectedProductBlurb();
	return [
		{
			title: getProductStoryValue('row1', 'title', translate('product.story.productMode.row1.title', { name })),
			text: getProductStoryValue('row1', 'text', translate('product.story.productMode.row1.text', { blurb })),
			media: getDefaultProductStoryMedia(0),
		},
		{
			title: getProductStoryValue('row2', 'title', translate('product.story.productMode.row2.title', { name })),
			text: getProductStoryValue('row2', 'text', translate('product.story.productMode.row2.text', { blurb })),
			reverse: true,
			media: getDefaultProductStoryMedia(1),
		},
		{
			title: getProductStoryValue('row3', 'title', translate('product.story.productMode.row3.title', { name })),
			text: getProductStoryValue('row3', 'text', translate('product.story.productMode.row3.text', { blurb })),
			media: getDefaultProductStoryMedia(2),
		},
	];
});

const guarantees_key_prefix = computed(() =>
	selected_id.value ? 'product.guarantees' : 'product.guarantees.navigation'
);
</script>

<template>
	<section class="product-guarantees-band" data-testid="product-category-guarantees-band">
		<div class="product-guarantees" data-testid="product-category-guarantees">
			<article class="guarantee-card" data-testid="product-category-guarantee-made-today">
				<img
					src="/icons/custom/guarantees/delivery-truck.svg"
					:alt="translate(`${guarantees_key_prefix}.madeToday.title`)"
					loading="lazy" class="product-details-image" >
				<h4 class="product-guarantee-title">{{ translate(`${guarantees_key_prefix}.madeToday.title`) }}</h4>
				<p class="product-details-text">{{ translate(`${guarantees_key_prefix}.madeToday.text`) }}</p>
			</article>
			<article class="guarantee-card" data-testid="product-category-guarantee-proof-review">
				<img
					src="/icons/custom/guarantees/proof-review.svg"
					:alt="translate(`${guarantees_key_prefix}.proofReview.title`)"
					loading="lazy" class="product-details-image" >
				<h4 class="product-guarantee-title">{{ translate(`${guarantees_key_prefix}.proofReview.title`) }}</h4>
				<p class="product-details-text">{{ translate(`${guarantees_key_prefix}.proofReview.text`) }}</p>
			</article>
			<article class="guarantee-card" data-testid="product-category-guarantee-durability">
				<img
					src="/icons/custom/guarantees/weather-durability.svg"
					:alt="translate(`${guarantees_key_prefix}.durability.title`)"
					loading="lazy" class="product-details-image" >
				<h4 class="product-guarantee-title">{{ translate(`${guarantees_key_prefix}.durability.title`) }}</h4>
				<p class="product-details-text">{{ translate(`${guarantees_key_prefix}.durability.text`) }}</p>
			</article>
		</div>
	</section>

	<div class="product-experience-container" data-testid="product-category-story-container">
		<section class="product-story" data-testid="product-category-story">
			<article
				v-for="(row, index) in story_rows"
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