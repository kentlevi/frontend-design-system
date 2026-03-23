<script setup lang="ts">
const props = defineProps<{
	orderGroups: any[];
	activeOrderId?: string;
	accentClassMap: Record<string, string>;
}>();

const emit = defineEmits(['set-active']);
const { t } = useI18n();
</script>

<template>
	<aside class="account-orders-sidebar" data-testid="account-orders-sidebar">
		<section
			v-for="group in orderGroups"
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
					:class="{ 'is-active': activeOrderId === order.id }"
					:data-testid="`account-orders-item-${order.id}`"
					@click="emit('set-active', order.id)"
				>
					<div class="account-orders-list-card-head">
						<span class="account-orders-list-card-dot" :class="accentClassMap[order.accentTone]" />
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
</template>

<style scoped lang="scss">
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
				border-radius: 8px;
				background: var(--contrast-light);
				padding: 16px 24px;
				display: flex;
				flex-direction: column;
				gap: 4px;
				cursor: pointer;
				transition:
					border-color 0.15s ease,
					background 0.15s ease,
					box-shadow 0.15s ease;

				&.is-active {
					border-color: var(--gold-base);
					background: var(--gold-10);
					box-shadow: var(--shadow-sm);
				}

				.account-orders-list-card-head {
					display: flex;
					align-items: center;
					gap: 8px;

					.account-orders-list-card-dot {
						width: 8px;
						height: 8px;
						border-radius: 999px;
						flex: 0 0 auto;

						&.is-warning {
							background: var(--amber-base);
						}

						&.is-success {
							background: var(--aloha-base);
						}

						&.is-neutral {
							background: var(--gray-90);
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
</style>
