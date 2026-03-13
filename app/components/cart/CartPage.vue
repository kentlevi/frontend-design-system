<script setup lang="ts">
import { useCartPage } from '~/composables/cart/page/useCartPage';

const { t } = useI18n();

const {
	rows,
	selectedIds,
	allSelected,
	selectedRows,
	selectedTotal,
	qtySelectOptions,
	paymentOptions,
	continueShoppingPath,
	toggleRowSelection,
	updateQty,
	removeByIds,
	goToCheckout,
	formatPrice,
	sizeDimOnly,
} = useCartPage();
</script>

<template>
	<main class="cart-page" data-testid="cart-page">
		<section class="cart-page-shell">
			<header class="cart-page-head">
				<h1 class="cart-page-title">{{ t('cart.cartPage.title') }}</h1>
				<NuxtLink :to="continueShoppingPath" class="cart-page-continue">
					<UiIcon name="strong-long-arrow-right" :size="24" color="var(--text-primary)" />
					{{ t('cart.cartPage.continueShopping') }}
				</NuxtLink>
			</header>

			<section class="cart-page-layout">
				<section class="cart-list" data-testid="cart-page-list">
					<div class="cart-list-controls">
						<UiCheckbox
							class="cart-check-row"
							:model-value="allSelected"
							box-class="cart-check-row-box"
							icon-class="cart-check-row-icon"
							@update:model-value="allSelected = $event"
						>
							{{ t('cart.cartPage.selectAll', { count: rows.length }) }}
						</UiCheckbox>
						<UiButton
							class="cart-remove-btn"
							variant="outline"
							tone="default"
							size="md"
							label-class="cart-remove-btn-label"
							:disabled="selectedIds.length === 0"
							@click="removeByIds(selectedIds)"
						>
							<UiIcon name="regular-trash" :size="24" color="var(--text-primary)" />
							{{ t('cart.cartPage.remove') }}
						</UiButton>
					</div>

					<div class="cart-list-head">
						<span class="cart-list-head-label">{{ t('cart.cartPage.headers.item') }}</span>
						<span class="cart-list-head-label">{{ t('cart.cartPage.headers.quantity') }}</span>
						<span class="cart-list-head-label">{{ t('cart.cartPage.headers.price') }}</span>
						<span class="cart-list-head-spacer" />
					</div>

					<article
						v-for="row in rows"
						:key="row.id"
						class="cart-row"
						data-testid="cart-page-row"
					>
						<UiCheckbox
							class="cart-check-row cart-check-row--item"
							:model-value="selectedIds.includes(row.id)"
							box-class="cart-check-row-box"
							icon-class="cart-check-row-icon"
							@update:model-value="toggleRowSelection(row.id, $event)"
						/>

						<div class="cart-item">
							<div class="cart-item-thumb">
								<img
									:src="row.artworkPreviewUrl || row.product.image"
									:alt="row.product.name"
									class="cart-item-thumb-image"
								>
							</div>
							<div class="cart-item-copy">
								<h3 class="cart-item-title">{{ row.product.name }}</h3>
								<p class="cart-item-size">{{ t('cart.cartPage.sizeLabel', { size: sizeDimOnly(row.sizeLabel) }) }}</p>
								<UiButton class="cart-link-btn" variant="ghost" tone="default" size="24">
									{{ t('cart.cartPage.replaceArtwork') }}
								</UiButton>
							</div>
						</div>

						<div class="cart-qty-wrap">
							<UiButton class="cart-link-btn" variant="ghost" tone="default" size="24">
								{{ t('cart.cartPage.editSize') }}
							</UiButton>
							<UiSelect
								class="cart-qty-select-control"
								:model-value="row.qty"
								:options="qtySelectOptions"
								icon-family="regular"
								:icon-size="24"
								trigger-class="cart-qty-select-trigger"
								@update:model-value="updateQty(row.id, Number($event))"
							/>
						</div>

						<strong class="cart-row-price">{{ formatPrice(row.total) }}</strong>

						<UiButton
							class="cart-delete-btn"
							variant="ghost"
							tone="default"
							size="sm"
							icon-only
							icon="regular-trash"
							icon-size="24"
							:sr-label="t('cart.cartPage.removeItemSr')"
							@click="removeByIds([row.id])"
						/>
					</article>
				</section>

				<aside class="cart-summary-column" data-testid="cart-page-summary">
					<section class="cart-summary-card">
						<header class="cart-summary-header">
							<h2 class="cart-summary-title">{{ t('cart.cartPage.orderSummary') }}</h2>
						</header>
						<div class="cart-summary-body">
							<div class="cart-summary-line">
								<span class="cart-summary-total-label">{{ t('cart.cartPage.total') }}</span>
								<strong class="cart-summary-total-value">{{ formatPrice(selectedTotal) }}</strong>
							</div>
							<div class="cart-summary-actions">
								<UiButton
									type="button"
									variant="filled"
									tone="neutral"
									size="md"
									class="cart-checkout-btn"
									:disabled="selectedRows.length === 0"
									@click="goToCheckout"
								>
									{{ t('cart.cartPage.proceedCheckout', { count: selectedRows.length }) }}
								</UiButton>
								<p class="cart-summary-note">
									{{ t('cart.cartPage.note') }}
								</p>
							</div>
						</div>
					</section>

					<section class="cart-payment-section">
						<p class="cart-payment-label">{{ t('cart.cartPage.availablePaymentOptions') }}</p>
						<div class="cart-payment-grid">
							<span
								v-for="option in paymentOptions"
								:key="option.key"
								class="cart-payment-chip"
							>
								<img
									:src="option.icon"
									:alt="option.label"
									class="cart-payment-chip-icon"
									loading="lazy"
								>
							</span>
						</div>
					</section>
				</aside>
			</section>
		</section>
	</main>
</template>

<style scoped lang="scss">
.cart-page {
    min-height: calc(100dvh - 120px);
    background: var(--bg-page);
    padding: 48px 24px 72px;

    .cart-page-shell {
        max-width: 1200px;
        margin: 0 auto;

        .cart-page-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--gray-30);

            .cart-page-title {

                font-size: var(--type-size-500);
                line-height: var(--type-line-500);
                color: var(--text-primary);
            }

            .cart-page-continue {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--text-primary);
                text-decoration: none;
                font-size: var(--type-size-200);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-200);
            }
        }

        .cart-page-layout {
            margin-top: 26px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 282px;
            gap: 34px;

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
                        color: var(--text-primary);
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);

                        .cart-check-row-box {
                            width: 20px;
                            height: 20px;
                            border-radius: 5px;
                            border-color: var(--text-primary);
                            background: var(--contrast-light);
                        }

                        .cart-check-row-icon {
                            width: 16px;
                            height: 16px;
                            display: block;
                        }
                    }

                    .cart-remove-btn {
                        min-width: 118px;
                        height: 40px;
                        border-radius: 16px;
                        border: 1px solid var(--gold-40);
                        background: var(--gold-10);
                        color: var(--abyss-base);
                        padding: 8px 24px;
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                        font-weight: var(--font-weight-medium);
                        cursor: pointer;
                        transition: background-color 0.16s ease, border-color 0.16s ease,
                            opacity 0.16s ease;

                        .cart-remove-btn-label {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        }

                        &:hover:not(:disabled) {
                            background: var(--brand-primary-soft-hover, #f6f1d8);
                            border-color: var(--brand-primary-dark-hover, #e3cc4e);
                        }

                        &:disabled {
                            opacity: 0.45;
                            cursor: not-allowed;
                        }
                    }
                }

                .cart-list-head {
                    display: grid;
                    grid-template-columns: 1fr 180px 160px 40px;
                    gap: 14px;
                    border-bottom: 1px solid var(--gray-30);
                    padding-bottom: 10px;
                    color: var(--text-primary);
                    font-size: var(--type-size-100);
                    font-weight: var(--font-weight-medium);
                    line-height: var(--type-line-100);

                    .cart-list-head-label,
                    .cart-list-head-spacer {
                        display: block;
                    }
                }

                .cart-row {
                    display: grid;
                    grid-template-columns: 24px 1fr 220px 160px 40px;
                    gap: 14px;
                    align-items: center;
                    padding: 20px 0;
                    border-bottom: 1px solid var(--gray-30);

                    .cart-check-row {
                        &.cart-check-row--item {
                            justify-self: start;
                        }
                    }

                    .cart-item {
                        display: flex;
                        align-items: center;
                        gap: 16px;

                        .cart-item-thumb {
                            width: 96px;
                            height: 96px;
                            border-radius: 10px;
                            background: var(--gray-20);
                            display: grid;
                            place-items: center;
                            overflow: hidden;

                            .cart-item-thumb-image {
                                width: 62px;
                                height: 62px;
                                object-fit: contain;
                            }
                        }

                            .cart-item-copy {
                            .cart-item-title {

                                font-size: var(--type-size-100);
                                line-height: var(--type-line-100);
                                color: var(--text-primary);
                            }

                            .cart-item-size {

                                font-size: var(--type-size-100);
                                line-height: var(--type-line-100);
                                color: var(--text-secondary);
                            }

                            .cart-link-btn {
                                border: 0;
                                background: transparent;
                                color: var(--gold-60);
                                padding: 0;
                                font-size: var(--type-size-100);
                                line-height: var(--type-line-100);
                                font-weight: var(--font-weight-semibold);
                                cursor: pointer;
                            }
                        }
                    }

                    .cart-qty-wrap {
                        display: flex;
                        align-items: center;
                        gap: 32px;

                        .cart-link-btn {
                            border: 0;
                            background: transparent;
                            color: var(--gold-60);
                            padding: 0;
                            font-size: var(--type-size-100);
                            line-height: var(--type-line-100);
                            font-weight: var(--font-weight-semibold);
                            cursor: pointer;
                        }

                        .cart-qty-select-control {
                            width: 129px;
                            min-width: 129px;
                        }

                        .cart-qty-select-trigger {
                            height: 40px;
                            border-radius: 8px;
                            border: 1px solid var(--gray-40);
                            background: var(--contrast-light);
                            padding: 8px 16px;
                            box-shadow: none;
                        }
                    }

                    .cart-row-price {
                        font-size: var(--type-size-300);
                        line-height: var(--type-line-300);
                        color: var(--text-primary);
                    }

                    .cart-delete-btn {
                        color: var(--abyss-base);
                        border: 0;
                        background: transparent;
                        width: 30px;
                        height: 30px;
                        display: grid;
                        place-items: center;
                        cursor: pointer;
                    }
                }
            }

            .cart-summary-column {
                align-self: start;
                max-width: 282px;
                display: flex;
                flex-direction: column;
                gap: 24px;

                .cart-summary-card {
                    border: 1px solid var(--gray-30);
                    border-radius: 16px;
                    background: var(--bg-page);

                    .cart-summary-header {
                        padding: 16px 24px;
                        border-bottom: 1px solid var(--gray-30);

                        .cart-summary-title {

                            font-size: var(--type-size-200);
                            font-weight: var(--font-weight-bold);
                            line-height: var(--type-line-200);
                            color: var(--text-primary);
                        }
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
                            color: var(--text-primary);

                            .cart-summary-total-label {
                                font-size: var(--type-size-100);
                                font-weight: var(--font-weight-semibold);
                                line-height: var(--type-line-100);
                            }

                            .cart-summary-total-value {
                                font-size: var(--type-size-400);
                                line-height: var(--type-line-400);
                                font-weight: var(--font-weight-bold);
                            }
                        }

                        .cart-summary-actions {
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                            align-items: center;

                            .cart-checkout-btn {
                                width: 100%;
                                height: 48px;
                                border-radius: 16px;
                                font-size: var(--type-size-200);
                                font-weight: var(--font-weight-medium);
                                line-height: var(--type-line-200);
                                box-shadow: none;
                            }

                            .cart-summary-note {

                                color: var(--text-secondary);
                                font-size: var(--type-size-100);
                                line-height: var(--type-line-100);
                            }
                        }
                    }
                }

                .cart-payment-section {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .cart-payment-label {

                        color: var(--text-primary);
                        font-size: var(--type-size-100);
                        font-weight: var(--font-weight-regular);
                        line-height: var(--type-line-100);
                    }

                    .cart-payment-grid {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 8px;
                        flex-wrap: nowrap;

                        .cart-payment-chip {
                            flex: 1 1 0;
                            min-width: 0;
                            height: 40px;
                            width: 50px;
                            border: 1px solid var(--gray-40);
                            border-radius: 8px;
                            display: grid;
                            place-items: center;
                            background: var(--contrast-light);
                            box-sizing: border-box;

                            .cart-payment-chip-icon {
                                object-fit: contain;
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 1200px) {
        .cart-page-shell {
            .cart-page-head {
                .cart-page-title {
                    font-size: var(--type-size-550);
                    line-height: var(--type-line-550);
                }

                .cart-page-continue {
                    font-size: var(--type-size-200);
                    line-height: var(--type-line-200);
                }
            }

            .cart-page-layout {
                .cart-list {
                    .cart-row {
                        .cart-row-price {
                            font-size: var(--type-size-500);
                            line-height: var(--type-line-500);
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 980px) {
        .cart-page-shell {
            .cart-page-layout {
                grid-template-columns: 1fr;

                .cart-list {
                    .cart-row {
                        grid-template-columns: 24px 1fr;

                        .cart-qty-wrap,
                        .cart-row-price,
                        .cart-delete-btn {
                            grid-column: 2 / 3;
                        }

                        .cart-row-price {
                            margin-top: 6px;
                        }
                    }
                }
            }
        }
    }
}
</style>