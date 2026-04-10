<script setup lang="ts">
import UiSkeleton from '~/components/ui/Skeleton.vue';
</script>

<template>
	<div class="cart-skeleton" aria-hidden="true">
		<!-- Cart Header -->
		<header class="cart-page-head">
			<div class="cart-page-title">
				<UiSkeleton width="220px" height="48px" border-radius="8px" />
			</div>
			<div class="cart-page-continue">
				<UiSkeleton width="180px" height="28px" border-radius="4px" />
			</div>
		</header>

		<!-- Cart Layout -->
		<div class="cart-page-layout">
			<!-- Cart List Section -->
			<section class="cart-list">
				<div class="cart-list-controls">
					<div class="cart-check-row">
						<UiSkeleton width="20px" height="20px" circle />
						<UiSkeleton width="130px" height="24px" border-radius="4px" />
					</div>
					<div class="cart-remove-btn">
						<UiSkeleton width="118px" height="40px" border-radius="16px" />
					</div>
				</div>

				<div class="cart-list-head">
					<div class="cart-list-head-label">
						<UiSkeleton width="60px" height="24px" border-radius="4px" />
					</div>
					<div class="cart-list-head-label">
						<UiSkeleton width="60px" height="24px" border-radius="4px" />
					</div>
					<div class="cart-list-head-label">
						<UiSkeleton width="60px" height="24px" border-radius="4px" />
					</div>
					<div class="cart-list-head-spacer" />
				</div>

				<!-- Skeleton Rows -->
				<article v-for="i in 3" :key="i" class="cart-row">
					<div class="cart-check-row cart-check-row--item">
						<UiSkeleton width="20px" height="20px" border-radius="4px" />
					</div>

					<div class="cart-row-main">
						<div class="cart-item">
							<div class="cart-item-main">
								<div class="cart-item-thumb">
									<UiSkeleton width="96px" height="96px" border-radius="10px" />
								</div>
								<div class="cart-item-copy">
									<div class="cart-item-title">
										<UiSkeleton width="150px" height="24px" border-radius="4px" />
									</div>
									<div class="cart-item-size">
										<UiSkeleton width="120px" height="24px" border-radius="4px" />
									</div>
									<div class="cart-link-btn">
										<UiSkeleton width="100px" height="24px" border-radius="4px" />
									</div>
								</div>
							</div>
							<div class="cart-item-links">
								<div class="cart-link-btn">
									<UiSkeleton width="80px" height="24px" border-radius="4px" />
								</div>
							</div>
						</div>

						<div class="cart-qty-wrap">
							<div class="cart-qty-select-control">
								<UiSkeleton width="176px" height="40px" border-radius="8px" />
							</div>
						</div>

						<div class="cart-row-price">
							<UiSkeleton width="100px" height="32px" border-radius="4px" />
						</div>
					</div>

					<div class="cart-delete-btn">
						<UiSkeleton width="30px" height="30px" border-radius="8px" />
					</div>
				</article>
			</section>

			<!-- Summary Sidebar Section -->
			<aside class="cart-summary-column">
				<section class="cart-summary-card">
					<header class="cart-summary-header">
						<div class="cart-summary-title">
							<UiSkeleton width="140px" height="28px" border-radius="4px" />
						</div>
					</header>
					<div class="cart-summary-body">
						<div class="cart-summary-line">
							<div class="cart-summary-total-label">
								<UiSkeleton width="60px" height="24px" border-radius="4px" />
							</div>
							<div class="cart-summary-total-value">
								<UiSkeleton width="100px" height="36px" border-radius="4px" />
							</div>
						</div>
						<div class="cart-summary-actions">
							<div class="cart-checkout-btn">
								<UiSkeleton width="100%" height="48px" border-radius="16px" />
							</div>
							<div class="cart-summary-note">
								<UiSkeleton width="160px" height="24px" border-radius="4px" />
							</div>
						</div>
					</div>
				</section>

				<section class="cart-payment-section">
					<div class="cart-payment-label">
						<UiSkeleton width="140px" height="24px" border-radius="4px" />
					</div>
					<div class="cart-payment-grid">
						<div v-for="j in 15" :key="j" class="cart-payment-chip">
							<UiSkeleton width="24px" height="24px" border-radius="4px" />
						</div>
					</div>
				</section>
			</aside>
		</div>
	</div>
</template>

<style scoped lang="scss">
// Inherited layout structure from CartPage.vue, CartPageList.vue, CartPageSummary.vue, CartPageHeader.vue
.cart-skeleton {
	max-width: 1200px;
	margin: 0 auto;
	padding-bottom: 120px;
}

// Header Styles
.cart-page-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 56px 0 20px;
	border-bottom: 1px solid var(--gray-30);
}

// Layout Styles
.cart-page-layout {
	margin-top: 26px;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 282px;
	gap: 34px;
}

// List Styles
.cart-list {
	.cart-list-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18px;

		.cart-check-row {
			display: inline-flex;
			align-items: center;
			gap: 10px;
		}
	}

	.cart-list-head {
		display: grid;
		grid-template-columns: 1fr 176px 118px 40px;
		gap: 14px;
		border-bottom: 1px solid var(--gray-30);
		padding-bottom: 10px;
	}

	.cart-row {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr) 40px;
		gap: 14px;
		align-items: center;
		padding: 20px 0;
		border-bottom: 1px solid var(--gray-30);

		.cart-row-main {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 176px 118px;
			align-items: center;
			column-gap: 32px;
		}

		.cart-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;

			.cart-item-main {
				display: flex;
				align-items: center;
				gap: 16px;
			}

			.cart-item-thumb {
				width: 96px;
				height: 96px;
				display: grid;
				place-items: center;
			}

			.cart-item-copy {
				display: grid;
				gap: 4px;
			}
		}

		.cart-row-price {
			display: flex;
			justify-content: flex-end;
		}
	}
}

// Summary Styles
.cart-summary-column {
	display: flex;
	flex-direction: column;
	gap: 24px;
	align-self: start;

	.cart-summary-card {
		border: 1px solid var(--gray-30);
		border-radius: 16px;
		background: var(--bg-page);
		overflow: hidden;

		.cart-summary-header {
			padding: 16px 24px;
			border-bottom: 1px solid var(--gray-30);
		}

		.cart-summary-body {
			padding: 16px 24px;
			display: flex;
			flex-direction: column;
			gap: 16px;

			.cart-summary-line {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.cart-summary-actions {
				display: flex;
				flex-direction: column;
				gap: 10px;
				align-items: center;
			}
		}
	}

	.cart-payment-section {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.cart-payment-grid {
			display: flex;
			gap: 12px;
			flex-wrap: wrap;
		}
	}
}

@media (max-width: 980px) {
	.cart-skeleton {
		padding: 0 16px;
	}
	.cart-page-layout {
		grid-template-columns: 1fr;
	}
	.cart-list .cart-row {
		grid-template-columns: 24px 1fr;
		.cart-row-main {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}
	.cart-list .cart-list-head {
		display: none;
	}
	.cart-page-head {
		padding: 56px 0 20px;
	}
}
</style>