<script setup lang="ts">
import { computed } from 'vue';
import { useAccountOrders } from '~/composables/account/orders/useAccountOrders';

const { t } = useI18n();
const {
	lifecycle,
	search_query,
	is_detail_open,
	order_groups,
	active_order,
	set_lifecycle,
	set_active_order,
	toggle_detail_open,
} = useAccountOrders();

const action_icon_map = {
	invoice: 'regular-invoice-check',
	paymentProof: 'regular-dollar-sign',
	message: 'regular-message',
} as const;

const accent_class_map = {
	warning: 'is-warning',
	success: 'is-success',
	neutral: 'is-neutral',
} as const;

const summary_totals = computed(() => {
	if (!active_order.value) return null;

	return [
		{ key: 'subtotal', value: active_order.value.totals.subtotalLabel },
		{
			key: 'shippingFee',
			value: active_order.value.totals.shippingFeeLabel,
			params: { method: t('account.orders.shippingMethod') },
		},
		{ key: 'discounts', value: active_order.value.totals.discountsLabel, className: 'is-discount' },
		{ key: 'total', value: active_order.value.totals.totalLabel, className: 'is-total' },
	];
});
</script>

<template>
	<section class="account-page" data-testid="account-orders-page">
		<AccountShell active-tab="orders">
			<div class="account-content" data-testid="account-orders-content">
				<div class="account-orders-topbar" data-testid="account-orders-topbar">
					<h1 class="account-orders-title" data-testid="account-orders-title">{{ t('account.orders.title') }}</h1>

					<div class="account-orders-tools" data-testid="account-orders-tools">
						<div class="account-orders-lifecycle" data-testid="account-orders-lifecycle">
							<button
								type="button"
								class="account-orders-lifecycle-button"
								:class="{ 'is-active': lifecycle === 'active' }"
								data-testid="account-orders-lifecycle-active-button"
								@click="set_lifecycle('active')"
							>
								{{ t('account.orders.active') }}
							</button>
							<button
								type="button"
								class="account-orders-lifecycle-button"
								:class="{ 'is-active': lifecycle === 'inactive' }"
								data-testid="account-orders-lifecycle-inactive-button"
								@click="set_lifecycle('inactive')"
							>
								{{ t('account.orders.inactive') }}
							</button>
						</div>

						<div class="account-orders-tool-buttons" data-testid="account-orders-tool-buttons">
							<UiButton
								variant="outline"
								tone="neutral"
								size="md"
								height="40px"
								icon="regular-calendar"
								icon-position="right"
								icon-size="24"
								class="account-orders-tool-button account-orders-select-date-button"
								data-testid="account-orders-select-date-button"
							>
								{{ t('account.orders.selectDate') }}
							</UiButton>

							<UiButton
								variant="outline"
								tone="neutral"
								size="md"
								height="40px"
								icon="regular-slider-horizontal"
								icon-position="left"
								icon-size="24"
								class="account-orders-tool-button"
								data-testid="account-orders-filters-button"
							>
								{{ t('account.orders.filters') }}
							</UiButton>

							<UiInput
								v-model="search_query"
								type="search"
								size="md"
								class="account-orders-search"
								:placeholder="t('account.orders.searchPlaceholder')"
								data-testid="account-orders-search-input"
							>
								<template #icon-left>
									<UiIcon
										name="regular-search"
										:size="24"
										color="var(--text-primary)"
										class="account-orders-search-icon"
									/>
								</template>
							</UiInput>
						</div>
					</div>
				</div>

				<div class="account-orders-layout" data-testid="account-orders-layout">
					<aside class="account-orders-sidebar" data-testid="account-orders-sidebar">
						<section
							v-for="group in order_groups"
							:key="group.section"
							class="account-orders-group"
							:data-testid="`account-orders-group-${group.section}`"
						>
							<header class="account-orders-group-head">
								<h2 class="account-orders-group-title">{{ t(`account.orders.sections.${group.section}`) }}</h2>
								<span class="account-orders-group-count">{{ group.items.length }}</span>
							</header>

							<div class="account-orders-group-items">
								<article
									v-for="order in group.items"
									:key="order.id"
									class="account-orders-list-card"
									:class="{ 'is-active': active_order?.id === order.id }"
									:data-testid="`account-orders-item-${order.id}`"
									@click="set_active_order(order.id)"
								>
									<div class="account-orders-list-card-head">
										<span class="account-orders-list-card-dot" :class="accent_class_map[order.accentTone]" />
										<h3 class="account-orders-list-card-title">
											{{ t('account.orders.orderLabel', { orderNumber: order.id }) }}
										</h3>
									</div>
									<p class="account-orders-list-card-meta">
										{{ t('account.orders.meta', { count: order.itemCount, date: order.date }) }}
									</p>
								</article>
							</div>
						</section>
					</aside>

					<section v-if="active_order" class="account-orders-detail" data-testid="account-orders-detail">
						<header class="account-orders-detail-head">
							<div class="account-orders-detail-title-row">
								<h2 class="account-orders-detail-title">
									{{ t('account.orders.orderLabel', { orderNumber: active_order.id }) }}
								</h2>
								<UiBadge
									variant="tonal"
									tone="default"
									size="md"
									bg-color="var(--amber-20)"
									text-color="var(--amber-70)"
									class="account-orders-detail-status"
								>
									{{ t(`account.orders.status.${active_order.statusKey}`) }}
								</UiBadge>
							</div>

							<button
								type="button"
								class="account-orders-detail-toggle"
								data-testid="account-orders-detail-toggle"
								@click="toggle_detail_open"
							>
								<UiIcon
									:name="is_detail_open ? 'regular-chevron-up' : 'regular-chevron-down'"
									:size="20"
								/>
								<span>{{ t('account.orders.moreDetails') }}</span>
							</button>
						</header>

						<div v-if="is_detail_open" class="account-orders-detail-body">
							<section class="account-orders-actions-list">
								<article
									v-for="action in active_order.actions"
									:key="action.key"
									class="account-orders-action-row"
								>
									<div class="account-orders-action-main">
										<div class="account-orders-action-icon">
											<UiIcon :name="action_icon_map[action.key]" :size="24" color="var(--gold-70)" />
										</div>

										<div class="account-orders-action-copy">
											<h3 class="account-orders-action-title">{{ t(`account.orders.${action.titleKey}`) }}</h3>
											<p class="account-orders-action-text">{{ t(`account.orders.${action.textKey}`) }}</p>
										</div>
									</div>

									<div v-if="action.key === 'paymentProof'" class="account-orders-payment-meta">
										<UiBadge
											v-if="active_order.paymentStatusKey"
											variant="outline"
											tone="danger"
											size="md"
											class="account-orders-payment-badge"
										>
											{{ t(`account.orders.${active_order.paymentStatusKey}`) }}
										</UiBadge>
										<span class="account-orders-payment-method">
											{{ t('account.orders.paymentMethod', { method: active_order.paymentMethodLabel }) }}
										</span>
									</div>
								</article>
							</section>

							<section class="account-orders-summary">
								<h3 class="account-orders-summary-title">{{ t('account.orders.orderSummary') }}</h3>

								<div class="account-orders-summary-items">
									<article
										v-for="item in active_order.items"
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
				</div>
			</div>
		</AccountShell>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);

	.account-content {
		padding-top: 40px;

		.account-orders-topbar {
			display: grid;
			grid-template-columns: 320px minmax(0, 1fr);
			align-items: center;
			gap: 24px;
			margin-bottom: 24px;

			.account-orders-title {
				font-size: var(--type-size-450);
				line-height: var(--type-line-450);
			}

			.account-orders-lifecycle {
				display: inline-grid;
				grid-template-columns: 1fr 1fr;
				border: 1px solid var(--text-primary);
				border-radius: 14px;
				overflow: hidden;

				.account-orders-lifecycle-button {
					min-width: 112px;
					height: 40px;
					padding: 0 24px;
					border: 0;
					border-radius: 0;
					background: transparent;
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
					cursor: pointer;

					&.is-active {
						background: var(--text-primary);
						color: var(--white-base);
					}
				}
			}

			.account-orders-tools {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 20px;

				.account-orders-tool-buttons {
					display: flex;
					align-items: center;
					gap: 12px;

					.account-orders-tool-button {
						--btn-border: var(--text-primary);
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						font-weight: var(--font-weight-semibold);

						:deep(.ui-button-icon) {
							width: 24px;
							height: 24px;
							flex: 0 0 24px;
						}

						&.account-orders-select-date-button {
							gap: 12px;
							padding-inline: 20px 16px;
						}
					}

					.account-orders-search {
						width: 200px;
						border-color: var(--border-default);
						border-radius: 14px;
						background: var(--contrast-light);
						box-shadow: none;
						gap: 10px;
						padding-inline: 16px;

						:deep(.ui-input-icon) {
							width: 24px;
							height: 24px;
							flex: 0 0 24px;
							display: grid;
							place-items: center;
						}
						:deep(.ui-input-field) {
							width: 100%;
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
						}

						:deep(.account-orders-search-icon) {
							width: 24px;
							height: 24px;
							display: block;
						}
					}
				}
			}
		}

			.account-orders-layout {
				display: grid;
				grid-template-columns: 320px minmax(0, 1fr);
			gap: 24px;
			align-items: start;

			.account-orders-sidebar {
				display: flex;
				flex-direction: column;
				gap: 20px;

				.account-orders-group {
					display: flex;
					flex-direction: column;
					gap: 12px;

					.account-orders-group-head {
						display: inline-flex;
						align-items: center;
						gap: 8px;

						.account-orders-group-title {
							font-size: var(--type-size-200);
							line-height: var(--type-line-200);
						}

						.account-orders-group-count {
							width: 22px;
							height: 22px;
							border-radius: 999px;
							background: var(--amber-50);
							color: var(--white-base);
							display: inline-flex;
							align-items: center;
							justify-content: center;
							font-size: var(--type-size-0);
							line-height: 1;
							font-weight: var(--font-weight-bold);
						}
					}

					.account-orders-group-items {
						display: flex;
						flex-direction: column;
						gap: 8px;

						.account-orders-list-card {
							border: 1px solid var(--border-default);
							border-radius: 12px;
							background: var(--contrast-light);
							padding: 18px 20px;
							display: flex;
							flex-direction: column;
							gap: 10px;
							cursor: pointer;
							transition:
								border-color 0.15s ease,
								background 0.15s ease,
								box-shadow 0.15s ease;

							&.is-active {
								border-color: var(--amber-50);
								background: var(--amber-10);
								box-shadow: var(--shadow-sm);
							}

							.account-orders-list-card-head {
								display: flex;
								align-items: center;
								gap: 10px;

								.account-orders-list-card-dot {
									width: 8px;
									height: 8px;
									border-radius: 999px;
									flex: 0 0 auto;

									&.is-warning {
										background: var(--amber-50);
									}

									&.is-success {
										background: var(--aloha-60);
									}

									&.is-neutral {
										background: var(--gray-70);
									}
								}

								.account-orders-list-card-title {
									font-size: var(--type-size-200);
									line-height: var(--type-line-200);
									font-weight: var(--font-weight-bold);
								}
							}

							.account-orders-list-card-meta {
								font-size: var(--type-size-100);
								line-height: var(--type-line-100);
								color: var(--text-secondary);
							}
						}
					}
				}
			}

			.account-orders-detail {
				border: 1px solid var(--gray-40);
				border-radius: 12px;
				background: var(--contrast-light);
				display: flex;
				flex-direction: column;

				.account-orders-detail-head {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 20px;
					padding: 30px 40px 18px;

					.account-orders-detail-title-row {
						display: flex;
						align-items: center;
						gap: 16px;
						flex-wrap: wrap;

						.account-orders-detail-title {
							font-size: var(--type-size-550);
							line-height: var(--type-line-550);
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
					gap: 30px;
					padding: 0 40px 34px;

					.account-orders-actions-list {
						display: flex;
						flex-direction: column;

						.account-orders-action-row {
							display: grid;
							grid-template-columns: minmax(0, 1fr) 188px;
							align-items: center;
							gap: 24px;
							padding: 20px 0;
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
						gap: 20px;

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
									width: 84px;
									height: 84px;
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
									padding-top: 6px;

									.account-orders-summary-head {
										display: flex;
										align-items: center;
										gap: 10px;
										flex-wrap: wrap;

											.account-orders-summary-title-group {
												display: inline-flex;
												align-items: center;
												gap: 8px;

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
										display: flex;
										flex-direction: column;
										gap: 4px;

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
									gap: 16px;
									min-height: 84px;
									padding-top: 0;
									width: 190px;

									.account-orders-summary-price {
										font-size: var(--type-size-300);
										line-height: var(--type-line-300);
										font-weight: var(--font-weight-bold);
										color: var(--text-primary);
									}
								}
							}
						}

						.account-orders-totals {
							display: flex;
							flex-direction: column;
							gap: 10px;
							padding-top: 2px;

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
									padding-top: 12px;

									.account-orders-total-label,
									.account-orders-total-value {
										font-size: var(--type-size-550);
										line-height: var(--type-line-550);
										font-weight: var(--font-weight-bold);
										color: var(--text-primary);
									}
								}
							}
						}
					}
				}

				.account-orders-detail-footer {
					display: flex;
					justify-content: flex-end;
					gap: 12px;
					padding: 0 40px 28px;

					:deep(.ui-button) {
						min-width: 132px;
					}
				}
			}
		}
	}

	@media (max-width: 1180px) {
		.account-content {
			.account-orders-topbar {
				grid-template-columns: 1fr;
				align-items: stretch;

				.account-orders-tools {
					flex-direction: column;
					align-items: stretch;

					.account-orders-tool-buttons {
						margin-left: 0;
						flex-wrap: wrap;

						.account-orders-search {
							width: 100%;
						}
					}
				}
			}

			.account-orders-layout {
				grid-template-columns: 1fr;
			}
		}
	}

	@media (max-width: 820px) {
		.account-content {
			.account-orders-layout {
				.account-orders-detail {
					.account-orders-detail-head {
						flex-direction: column;
						align-items: flex-start;
					}

					.account-orders-detail-body {
						.account-orders-actions-list {
							.account-orders-action-row {
								flex-direction: column;
								align-items: flex-start;

								.account-orders-payment-meta {
									align-items: flex-start;
								}
							}
						}

						.account-orders-summary {
							.account-orders-summary-items {
								.account-orders-summary-item {
									grid-template-columns: 1fr;

									.account-orders-summary-side {
										align-items: flex-start;
									}
								}
							}
						}
					}

					.account-orders-detail-footer {
						flex-wrap: wrap;
					}
				}
			}
		}
	}
}
</style>