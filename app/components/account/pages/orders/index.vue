<script setup lang="ts">
import { useAccountOrders } from '~/composables/account/orders/useAccountOrders';
import OrdersSidebar from './OrdersSidebar.vue';
import OrderDetailSection from './OrderDetailSection.vue';

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

const accent_class_map = {
	warning: 'is-warning',
	success: 'is-success',
	neutral: 'is-neutral',
} as const;
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
					<OrdersSidebar
						:order-groups="order_groups"
						:active-order-id="active_order?.id"
						:accent-class-map="accent_class_map"
						@set-active="set_active_order"
					/>
					
					<OrderDetailSection
						v-if="active_order"
						:order="active_order"
						:is-detail-open="is_detail_open"
						@toggle-detail="toggle_detail_open"
					/>
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
				font-weight: var(--font-weight-bold);
			}

			.account-orders-tools {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 20px;
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

			.account-orders-tool-buttons {
				display: flex;
				align-items: center;
				gap: 12px;

				.account-orders-tool-button {
					--btn-border: var(--text-primary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-semibold);
				}

				.account-orders-search {
					width: 200px;
					border-radius: 14px;
				}
			}
		}

		.account-orders-layout {
			display: grid;
			grid-template-columns: 320px minmax(0, 1fr);
			gap: 24px;
			align-items: start;
		}
	}
}

@media (max-width: 1180px) {
	.account-page .account-content {
		.account-orders-topbar {
			grid-template-columns: 1fr;

			.account-orders-tools {
				flex-direction: column;
				align-items: stretch;

				.account-orders-tool-buttons {
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
</style>