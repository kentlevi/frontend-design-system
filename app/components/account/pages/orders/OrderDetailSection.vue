<script setup lang="ts">
const props = defineProps<{
	order: any;
	isDetailOpen: boolean;
}>();

const emit = defineEmits(['toggle-detail']);
const { t } = useI18n();

const action_icon_map = {
	invoice: 'regular-file-dollar',
	paymentProof: 'regular-dollar-sign',
	message: 'regular-message',
} as const;

const summary_totals = computed(() => {
	if (!props.order) return null;

	return [
		{ key: 'subtotal', value: props.order.totals.subtotalLabel },
		{
			key: 'shippingFee',
			value: props.order.totals.shippingFeeLabel,
			params: { method: t('account.orders.shippingMethod') },
		},
		{ key: 'discounts', value: props.order.totals.discountsLabel, className: 'is-discount' },
		{ key: 'total', value: props.order.totals.totalLabel, className: 'is-total' },
	];
});
</script>

<template>
	<section class="account-orders-detail" data-testid="account-orders-detail">
		<header class="account-orders-detail-head">
			<div class="account-orders-detail-title-row">
				<h2 class="account-orders-detail-title">
					{{ t('account.orders.orderLabel', { orderNumber: order.id }) }}
				</h2>
				<UiBadge
					variant="tonal"
					tone="default"
					size="md"
					bg-color="var(--amber-50)"
					text-color="var(--white-base)"
					class="account-orders-detail-status"
				>
					{{ t(`account.orders.status.${order.statusKey}`) }}
				</UiBadge>
			</div>

			<button
				type="button"
				class="account-orders-detail-toggle"
				data-testid="account-orders-detail-toggle"
				@click="emit('toggle-detail')"
			>
				<UiIcon
					:name="isDetailOpen ? 'regular-chevron-up' : 'regular-chevron-down'"
					:size="20"
				/>
				<span>{{ t('account.orders.moreDetails') }}</span>
			</button>
		</header>

		<div v-if="isDetailOpen" class="account-orders-detail-body">
			<section class="account-orders-actions-list">
				<article
					v-for="action in order.actions"
					:key="action.key"
					class="account-orders-action-row"
				>
					<div class="account-orders-action-main">
						<div class="account-orders-action-icon">
							<UiIcon :name="action_icon_map[action.key as keyof typeof action_icon_map]" :size="24" color="var(--gold-70)" />
						</div>

						<div class="account-orders-action-copy">
							<h3 class="account-orders-action-title">{{ t(`account.orders.${action.titleKey}`) }}</h3>
							<p class="account-orders-action-text">{{ t(`account.orders.${action.textKey}`) }}</p>
						</div>
					</div>

					<div v-if="action.key === 'paymentProof'" class="account-orders-payment-meta">
						<UiBadge
							v-if="order.paymentStatusKey"
							variant="outline"
							tone="danger"
							size="md"
							class="account-orders-payment-badge"
						>
							{{ t(`account.orders.${order.paymentStatusKey}`) }}
						</UiBadge>
						<span class="account-orders-payment-method">
							{{ t('account.orders.paymentMethod', { method: order.paymentMethodLabel }) }}
						</span>
					</div>
				</article>
			</section>

			<section class="account-orders-summary">
				<h3 class="account-orders-summary-title">{{ t('account.orders.orderSummary') }}</h3>

				<div class="account-orders-summary-items">
					<article
						v-for="item in order.items"
						:key="item.number"
						class="account-orders-summary-item"
						:data-testid="`account-orders-summary-item-${item.number}`"
					>
						<div class="account-orders-summary-thumb">
							<img :src="item.imageSrc" :alt="t('account.orders.itemNumber', { number: item.number })" class="account-orders-summary-image">
						</div>

						<div class="account-orders-summary-copy">
							<div class="account-orders-summary-head">
								<div class="account-orders-summary-title-group">
									<span class="account-orders-summary-item-no">
										{{ t('account.orders.itemNumber', { number: item.number }) }}
									</span>
									<UiIcon name="regular-info-circle" :size="18" color="var(--text-secondary)" />
								</div>

								<UiBadge
									variant="outline"
									:tone="item.artworkStatusKey === 'lackingArtwork' ? 'danger' : 'default'"
									size="md"
									:bg-color="item.artworkStatusKey === 'lackingArtwork' ? 'transparent' : 'var(--azure-10)'"
									:text-color="item.artworkStatusKey === 'lackingArtwork' ? 'var(--error)' : 'var(--azure-60)'"
									:border-color="item.artworkStatusKey === 'lackingArtwork' ? 'var(--error-30)' : 'var(--azure-30)'"
								>
									{{ t(`account.orders.${item.artworkStatusKey}`) }}
								</UiBadge>
							</div>

							<div class="account-orders-summary-meta">
								<p class="account-orders-summary-meta-line">{{ t('account.orders.size', { size: item.size }) }}</p>
								<p class="account-orders-summary-meta-line">{{ t('account.orders.quantity', { quantity: item.quantity }) }}</p>
							</div>
						</div>

						<div class="account-orders-summary-side">
							<UiButton
								variant="filled"
								tone="neutral"
								size="md"
								height="40px"
								:disabled="item.actionDisabled"
								class="account-orders-summary-action"
							>
								{{ t(`account.orders.${item.actionLabelKey}`) }}
							</UiButton>
							<strong class="account-orders-summary-price">{{ item.priceLabel }}</strong>
						</div>
					</article>
				</div>

				<div v-if="summary_totals" class="account-orders-totals">
					<div
						v-for="line in summary_totals"
						:key="line.key"
						class="account-orders-total-row"
						:class="line.className"
					>
						<span class="account-orders-total-label">
							{{ t(`account.orders.summary.${line.key}`, line.params || {}) }}
						</span>
						<strong class="account-orders-total-value">{{ line.value }}</strong>
					</div>
				</div>
			</section>
		</div>

		<footer class="account-orders-detail-footer">
			<UiButton variant="outline" tone="neutral" size="md" height="44px">
				{{ t('account.orders.onHoldOrder') }}
			</UiButton>
			<UiButton variant="outline" tone="neutral" size="md" height="44px">
				{{ t('account.orders.cancelOrder') }}
			</UiButton>
		</footer>
	</section>
</template>

<style scoped lang="scss">
.account-orders-detail {
	border: 1px solid var(--gray-40);
	border-radius: 12px;
	background: var(--contrast-light);
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 32px 40px;

	.account-orders-detail-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;

		.account-orders-detail-title-row {
			display: flex;
			align-items: center;
			gap: 16px;
			flex-wrap: wrap;

			.account-orders-detail-title {
				font-size: var(--type-size-400);
				line-height: var(--type-line-400);
				font-weight: var(--font-weight-bold);
				color: var(--text-primary);
			}
		}

		.account-orders-detail-toggle {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			flex: 0 0 auto;
			border: 0;
			background: transparent;
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
			cursor: pointer;
			padding: 0;

			:deep(.ui-icon) {
				width: 20px;
				height: 20px;
				flex: 0 0 20px;
				display: block;
			}
		}
	}

	.account-orders-detail-body {
		display: flex;
		flex-direction: column;
		gap: 32px;

		.account-orders-actions-list {
			display: flex;
			flex-direction: column;

			.account-orders-action-row {
				display: grid;
				grid-template-columns: minmax(0, 1fr) 188px;
				align-items: center;
				gap: 24px;
				padding: 16px 0;
				border-bottom: 1px solid var(--border-default);

				.account-orders-action-main {
					display: flex;
					align-items: center;
					gap: 16px;
					min-height: 40px;

					.account-orders-action-icon {
						width: 40px;
						height: 40px;
						border-radius: 999px;
						background: #f6efcf;
						display: grid;
						place-items: center;
						flex: 0 0 auto;

						:deep(.ui-icon) {
							width: 24px;
							height: 24px;
							display: block;
						}
					}

					.account-orders-action-copy {
						.account-orders-action-title {
							font-size: var(--type-size-200);
							line-height: var(--type-line-200);
							font-weight: var(--font-weight-semibold);
							color: var(--text-primary);
						}

						.account-orders-action-text {
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
							color: var(--text-secondary);
						}
					}
				}

				.account-orders-payment-meta {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					gap: 4px;
					justify-self: end;
					min-width: 188px;

					.account-orders-payment-method {
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						color: var(--text-secondary);
					}
				}
			}
		}

		.account-orders-summary {
			display: flex;
			flex-direction: column;
			gap: 16px;

			.account-orders-summary-title {
				font-size: var(--type-size-200);
				line-height: var(--type-line-200);
				font-weight: var(--font-weight-semibold);
			}

			.account-orders-summary-items {
				display: flex;
				flex-direction: column;
				gap: 16px;
				padding-bottom: 18px;
				border-bottom: 1px solid var(--border-default);

				.account-orders-summary-item {
					display: grid;
					grid-template-columns: 84px minmax(0, 1fr) 190px;
					gap: 18px;
					align-items: start;
					padding: 2px 0;

					.account-orders-summary-thumb {
						width: 88px;
						height: 88px;
						border-radius: 10px;
						background: var(--gray-20);
						display: grid;
						place-items: center;
						overflow: hidden;

						.account-orders-summary-image {
							width: 56px;
							height: 56px;
							object-fit: contain;
						}
					}

					.account-orders-summary-copy {
						display: flex;
						flex-direction: column;
						gap: 8px;

						.account-orders-summary-head {
							display: flex;
							align-items: center;
							gap: 16px;
							flex-wrap: wrap;

							.account-orders-summary-title-group {
								display: inline-flex;
								align-items: center;
								gap: 4px;

								.account-orders-summary-item-no {
									font-size: var(--type-size-200);
									line-height: var(--type-line-200);
									font-weight: var(--font-weight-bold);
								}

								:deep(.ui-icon) {
									width: 18px;
									height: 18px;
									flex: 0 0 18px;
									display: block;
								}
							}
						}

						.account-orders-summary-meta {
							.account-orders-summary-meta-line {
								font-size: var(--type-size-100);
								line-height: var(--type-line-100);
								color: var(--text-secondary);
							}
						}
					}

					.account-orders-summary-side {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						justify-content: space-between;
						gap: 20px;
						min-height: 84px;
						padding-top: 0;
						min-width: 128px;

						.account-orders-summary-price {
							font-size: var(--type-size-200);
							line-height: var(--type-line-200);
							font-weight: var(--font-weight-bold);
							color: var(--text-primary);
						}
					}
				}
			}

			.account-orders-totals {
				display: flex;
				flex-direction: column;
				gap: 4px;

				.account-orders-total-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 20px;

					.account-orders-total-label {
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						color: var(--text-secondary);
					}

					.account-orders-total-value {
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						font-weight: var(--font-weight-semibold);
						color: var(--text-secondary);
					}

					&.is-discount {
						.account-orders-total-value {
							color: var(--error);
						}
					}

					&.is-total {
						.account-orders-total-label,
						.account-orders-total-value {
							font-weight: var(--font-weight-bold);
							color: var(--text-primary);
						}
						.account-orders-total-value {
							font-size: var(--type-size-400);
							line-height: var(--type-line-400);
						}
					}
				}
			}
		}
	}

	.account-orders-detail-footer {
		display: flex;
		gap: 12px;
		margin-top: 8px;
	}
}

@media (max-width: 980px) {
	.account-orders-detail {
		padding: 24px 16px;

		.account-orders-detail-body {
			.account-orders-summary-items {
				.account-orders-summary-item {
					grid-template-columns: 84px 1fr;
					
					.account-orders-summary-side {
						grid-column: 1 / -1;
						align-items: flex-start;
						min-height: auto;
					}
				}
			}
		}

		.account-orders-action-row {
			grid-template-columns: 1fr;
			
			.account-orders-payment-meta {
				align-items: flex-start;
			}
		}
	}
}
</style>
