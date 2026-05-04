<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';
import VinylLetteringDesigner from '~/components/products/product-category/VinylLetteringDesigner.vue';
import { useQuoteView } from '~/composables/quote/useQuoteView';


const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const PRODUCT_HERO_BASE_URL = 'https://static.musticker.com/dev/store-front/products';



const {
	sizes: size_feature_cards,
	size: selected_size,
	url_slug : product_url_slug,
	has_lettering_editor,
	is_loading_features,
	lettering_size,
	lettering_text,
	selected_font,
	selected_color,
	navigation_flight,
	vinyl_designer_ref,
	product_navigation_in_flight,
	updateLetteringPreviewFlag,
	updateSizeByCard,
	setVinylDesignerRef,
} = useQuoteView()



const product_hero_media_map: Record<string, { folder: string, file: string }> = {
	'die-cut-sticker': { folder: 'die-cut-sticker', file: 'die-cut-sticker' },
	'circle-sticker': { folder: 'round-stickers', file: 'round-sticker' },
	'rectangle-sticker': { folder: 'rectangular-stickers', file: 'rectangular-stickers' },
	'square-sticker': { folder: 'square-stickers', file: 'square-sticker' },
	'oval-sticker': { folder: 'oval-stickers', file: 'oval-sticker' },
	'rounded-sticker': { folder: 'rounded-square-stickers', file: 'rounded-square-sticker' },
	'clear-sticker': { folder: 'clear-sticker', file: 'clear-sticker' },
	'circle-sheet': { folder: 'circle-sheet', file: 'circle-sheet' },
	'hologram-sticker': { folder: 'hologram-sticker', file: 'hologram-sticker' },
	'kiss-cut-sticker': { folder: 'kiss-cut-sticker', file: 'kiss-cut-sticker' },
	'oval-roll': { folder: 'oval-roll', file: 'oval-roll' },
	'paper-roll': { folder: 'paper-roll', file: 'paper-roll' },
	'rectangle-roll': { folder: 'rectangle-roll', file: 'rectangle-roll' },
	'sticker-sheet': { folder: 'sticker-sheet', file: 'sticker-sheet' },
	'square-roll': { folder: 'square-roll', file: 'square-roll' },
	'transfer-sticker': { folder: 'transfer-sticker', file: 'transfer-sticker' },
	'vinyl-lettering': { folder: 'vinyl-lettering', file: 'vinyl-lettering' },
	'circle-roll': { folder: 'round-roll-sticker', file: 'round-roll-sticker' },
	'rounded-roll': { folder: 'rounded-roll-sticker', file: 'rounded-roll-sticker' },
};

const displayed_product_title = computed(() => {

	if(!product_url_slug.value)
		return ''

	// If it's the specialized lettering editor, show the specific title
	if (has_lettering_editor.value) return t('product.hero.vinylLetteringTitle'); // ⚠️ REQUIRES REVISION!!!

	// Otherwise, use the formal product name from catalog/translation
	return t(`product.items.${product_url_slug.value}.name`);
});


const displayed_product_blurb = computed(() =>
	has_lettering_editor.value ? '' : t(`product.items.${product_url_slug.value}.blurb`)
);

const fallback_hero_video_url = resolveFileUrl('products/die-cut-sticker/hero/01-donut-sticker-in-hand-video.mp4'); // ⚠️ REVISION!!!
const fallback_hero_poster_url = resolveFileUrl('products/die-cut-sticker/hero/01-donut-sticker-in-hand-poster.png'); // ⚠️ REVISION!!!


const hero_media_asset = computed(() => {
	return product_url_slug.value ? product_hero_media_map[product_url_slug.value] ?? null : null;
});
const demo_hero_video_url = computed(() =>
	hero_media_asset.value
		? `${PRODUCT_HERO_BASE_URL}/${hero_media_asset.value.folder}/hero/${hero_media_asset.value.file}.mp4`
		: fallback_hero_video_url
);
const demo_hero_poster_url = computed(() =>
	hero_media_asset.value
		? `${PRODUCT_HERO_BASE_URL}/${hero_media_asset.value.folder}/hero/${hero_media_asset.value.file}-thumbnail.png`
		: fallback_hero_poster_url
);

const should_play_preview_video = computed(() =>
	Boolean(product_url_slug.value) && !has_lettering_editor.value && !product_navigation_in_flight.value
);


watch(
	vinyl_designer_ref,
	(instance) => {
		setVinylDesignerRef(instance);
	},
	{ immediate: true }
);

onBeforeUnmount(() => {
	setVinylDesignerRef(null);
});


const hide_lettering_editor = computed(() => (
	is_loading_features.value
	|| product_navigation_in_flight.value
	|| navigation_flight.value
	|| (has_lettering_editor.value
		&& !selected_font.value)
))

</script>

<template>
	<div class="product-preview" data-testid="product-category-preview">
		<div v-if="displayed_product_title" class="product-preview-header">
			<h1 class="product-preview-title" data-testid="product-category-preview-title">
				{{ displayed_product_title }}
			</h1>
			<p class="product-preview-blurb" data-testid="product-category-preview-blurb">
				{{ displayed_product_blurb }}
			</p>
		</div>

		<div
			v-if="!has_lettering_editor"
			class="product-preview-media"
			:class="{ 'is-loading': product_navigation_in_flight }"
			data-testid="product-category-preview-media"
		>
			<img
				v-if="!should_play_preview_video"
				:src="demo_hero_poster_url"
				:alt="`${displayed_product_title || 'Product'} preview poster`"
				class="product-preview-media-image"
			>
			<video
				v-else
				:key="product_url_slug ?? 'preview-video'"
				:poster="demo_hero_poster_url"
				class="product-preview-media-image"
				autoplay
				muted
				loop
				playsinline
				preload="metadata"
			>
				<source :src="demo_hero_video_url" type="video/mp4">
			</video>
		</div>

		<div
			v-else-if="has_lettering_editor"
			class="vinyl-preview-board"
			data-testid="product-category-vinyl-preview"
		>
			<UiSkeleton
				v-if="hide_lettering_editor"
				height="100%"
				width="100%"
				border-radius="20px"
				data-testid="vinyl-preview-skeleton"
			/>
			<VinylLetteringDesigner
				v-else
				ref="vinyl_designer_ref"
				v-model:text="lettering_text"
				v-model:width="lettering_size.width"
				v-model:height="lettering_size.height"
				:font="selected_font?.value ?? ''"
				:color-key="selected_color?.keyword || selected_color?.hex_code || 'black'"
				:redirecting="product_navigation_in_flight"
				:is-loading-features="is_loading_features"
				:selection-navigation-in-flight="product_navigation_in_flight"
				:lettering-navigation-flight="navigation_flight"
				:has-lettering-editor="has_lettering_editor"
				data-testid="product-category-vinyl-designer"
				@preview-ready-change="updateLetteringPreviewFlag"
			/>
		</div>

		<div class="product-preview-features" data-testid="product-category-preview-features">
			<button
				v-for="(featured_size_cards, fsc_key) in size_feature_cards"
				:key="'sizes-cards-'+fsc_key+'-'+featured_size_cards.code"
				type="button"
				class="mini-feature"
				:class="{
					'is-active': !has_lettering_editor && selected_size?.width == featured_size_cards.width && selected_size?.height == featured_size_cards.height,
					'is-disabled': has_lettering_editor
				}"
				:disabled="has_lettering_editor"
				@click="updateSizeByCard(featured_size_cards)"
			>
				<img
					v-if="featured_size_cards.image"
					:src="featured_size_cards.image"
					:alt="t(`product.sizes.${featured_size_cards.code}.label`)"
					loading="lazy"
					class="mini-feature-image"
				>
				<h4 class="mini-feature-title">{{ t(`product.sizes.${featured_size_cards.code}.label`) }}</h4>
				<p class="mini-feature-description">
					{{ t(`product.featureCards.${featured_size_cards.desc_key}.description`) }}
				</p>
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
.product-preview {
	background: transparent;
	border: 0;
	border-radius: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 0;

	.product-preview-title {
		color: var(--text-primary);
		font-size: var(--type-size-600);
		line-height: var(--type-line-600);
	}

	.product-preview-blurb {
		color: var(--text-secondary);
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
	}

	.product-preview-media {
		border-radius: 24px;
		height: 362px;
		margin-top: 0;
		overflow: hidden;
		position: relative;

		.product-preview-media-image {
			display: block;
			height: 100%;
			object-fit: cover;
			width: 100%;
		}
	}

	.product-preview-features {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		margin-top: 0;
		max-height: 200px;

		.mini-feature {
			align-items: center;
			background: transparent;
			border: 0;
			border-radius: 0;
			cursor: pointer;
			display: flex;
			flex-direction: column;
			gap: 8px;
			padding: 20px 11.5px;
			position: relative;
			text-align: center;
			width: 100%;

			.mini-feature-image {
				display: block;
				flex: 0 0 auto;
				height: 72px;
				max-width: 72px;
				object-fit: contain;
				width: 72px;
			}

			.mini-feature-title {
				color: var(--text-primary);
				display: -webkit-box;
				flex: 0 0 24px;
				font-size: var(--type-size-100);
				font-weight: var(--font-weight-semibold);
				height: 24px;
				line-clamp: 2;
				-webkit-line-clamp: 2;
				line-height: var(--type-line-100);
				max-width: 100%;
				width: 152px;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.mini-feature-description {
				color: var(--text-secondary);
				flex: 1 0 auto;
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				max-width: 232px;
			}

			&.is-active {
				box-shadow: none;

				&:after {
					background: var(--gold-base);
					bottom: 0;
					content: "";
					height: 2px;
					left: 8px;
					position: absolute;
					right: 8px;
				}
			}

			&:disabled {
				cursor: default;
			}
		}
	}
}

.vinyl-preview-board {
	height: 362px;
	border-radius: 20px;
	position: relative;
	overflow: hidden;
	background: var(--gray-20);

	.vinyl-preview-disclaimer {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 12px;
		bottom: 20px;
		color: var(--text-secondary);
		font-size: 11px;
		left: 20px;
		line-height: 18px;
		padding: 12px 16px;
		pointer-events: none;
		position: absolute;
		right: 20px;
		z-index: 10;
	}
}

@media (max-width: 980px) {
	.product-preview .product-preview-title {
		font-size: var(--type-size-550);
		line-height: var(--type-line-550);
	}
	.product-preview-features {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
</style>
