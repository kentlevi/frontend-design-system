<script setup lang="ts">
import UiSkeleton from '~/components/ui/Skeleton.vue';
</script>

<template>
	<section class="cart-empty-state-skeleton" aria-hidden="true">
		<div class="cart-empty-state-content">
			<div class="cart-empty-state-top">
				<!-- Hero Skeleton -->
				<div class="cart-empty-state-hero">
					<div class="skeleton-title-wrap">
						<UiSkeleton width="236px" height="42px" border-radius="8px" />
					</div>
					<div class="skeleton-desc-wrap">
						<UiSkeleton width="100%" height="20px" border-radius="4px" />
						<UiSkeleton width="100%" height="20px" border-radius="4px" />
						<UiSkeleton width="85%" height="20px" border-radius="4px" />
					</div>
				</div>

				<!-- Featured Items Skeleton -->
				<section class="cart-empty-state-featured">
					<div v-for="i in 5" :key="i" class="cart-empty-state-product-skeleton">
						<div class="cart-empty-state-featured-image-wrap">
							<UiSkeleton width="125px" height="96px" border-radius="12px" />
						</div>
						<div class="label-skeleton-wrap">
							<UiSkeleton width="112px" height="24px" border-radius="4px" />
						</div>
					</div>
				</section>
			</div>
		</div>

		<!-- Discover Section Skeleton -->
		<section class="cart-empty-state-discover">
			<div class="cart-empty-state-content">
				<div class="cart-empty-state-discover-head">
					<UiSkeleton width="380px" height="34px" border-radius="4px" />
					<div class="skeleton-controls">
						<UiSkeleton width="40px" height="40px" circle />
						<UiSkeleton width="40px" height="40px" circle />
					</div>
				</div>
			</div>

			<div class="cart-empty-state-discover-strip-skeleton">
				<div class="cart-empty-state-discover-inner">
					<div class="cart-empty-state-discover-grid">
						<div v-for="j in 6" :key="j" class="cart-empty-state-product-skeleton">
							<div class="cart-empty-state-discover-image-wrap">
								<UiSkeleton width="73px" height="56px" border-radius="8px" />
							</div>
							<div class="label-skeleton-wrap">
								<UiSkeleton width="104px" height="24px" border-radius="4px" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</section>
</template>

<style scoped lang="scss">
// Common styles from CartEmptyState.vue to ensure layout matching
.cart-empty-state-skeleton {
	width: 100%;
	margin: 0 auto;
	padding: 112px 0 110px;
	display: grid;
	gap: 80px;

	.cart-empty-state-content {
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.cart-empty-state-top {
		display: grid;
		gap: 40px;
	}

	.cart-empty-state-hero {
		max-width: 588px;
		margin: 0 auto;
		text-align: center;
		display: grid;
		gap: 16px; // Matched original
		justify-items: center;

		.skeleton-desc-wrap {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8px; // Matched original flow
		}
	}

	.cart-empty-state-featured,
	.cart-empty-state-discover-grid {
		display: flex;
		gap: 24px;
		justify-content: center;
	}

	.cart-empty-state-discover {
		display: grid;
		gap: 32px;
		width: 100%;
	}

	.cart-empty-state-discover-strip-skeleton {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-right: calc(50% - 50vw);
		background: #f5f5f5; // Matched original
		border-top: 1px solid var(--gray-20);
		border-bottom: 1px solid var(--gray-20);
		padding: 24px 0;
	}

	.cart-empty-state-discover-inner {
		max-width: 1200px;
		margin: 0 auto;
	}

	.cart-empty-state-discover-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;

		.skeleton-controls {
			display: flex;
			gap: 10px;
		}
	}

	.cart-empty-state-product-skeleton {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px; // Restored gap to account for natural text flow and wrap centering
	}

	// Centering for skeletons within wraps
	.cart-empty-state-featured-image-wrap,
	.cart-empty-state-discover-image-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.label-skeleton-wrap {
		padding-bottom: 12px;
		display: flex;
		justify-content: center;
	}
}

@media (max-width: 1080px) {
	.cart-empty-state-skeleton {
		padding: 40px 0 56px;
		gap: 56px;
	}
}

@media (max-width: 720px) {
	.cart-empty-state-skeleton {
		.cart-empty-state-discover-head {
			flex-direction: column;
			align-items: flex-start;
		}
		.cart-empty-state-featured,
		.cart-empty-state-discover-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 18px;
		}
	}
}
</style>