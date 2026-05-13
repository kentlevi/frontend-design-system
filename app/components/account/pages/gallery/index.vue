<script setup lang="ts">
import { useAccountGallery } from '~/composables/account/gallery/useAccountGallery';
import GalleryCard from './GalleryCard.vue';

const { t } = useI18n();
const { items } = useAccountGallery();
</script>

<template>
	<section class="account-page" data-testid="account-gallery-page">
		<div class="account-content" data-testid="account-gallery-content">
			<header class="account-gallery-header" data-testid="account-gallery-header">
				<h1 class="account-gallery-title" data-testid="account-gallery-title">{{ t('account.gallery.title') }}</h1>
				<div class="account-gallery-actions" data-testid="account-gallery-actions">
					<UiButton variant="outline" tone="neutral" size="md" data-testid="account-gallery-filters-button">
						{{ t('account.gallery.filters') }}
					</UiButton>
					<UiInput
						model-value=""
						class="account-gallery-search"
						type="text"
						:placeholder="t('account.gallery.searchPlaceholder')"
						data-testid="account-gallery-search"
					/>
				</div>
			</header>

			<div class="account-gallery-grid" data-testid="account-gallery-grid">
				<GalleryCard
					v-for="item in items"
					:key="item.name"
					:item="item"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);

	.account-content {
		padding-top: 40px;
	}

	.account-gallery-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-bottom: 20px;

		.account-gallery-title {
			font-size: var(--type-size-450);
			line-height: var(--type-line-450);
			font-weight: var(--font-weight-bold);
		}

		.account-gallery-actions {
			display: flex;
			gap: 10px;
			align-items: center;

			.account-gallery-search {
				width: 180px;
			}
		}
	}

	.account-gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	@media (max-width: 980px) {
		.account-gallery-grid {
			grid-template-columns: 1fr;
		}
	}
}
</style>