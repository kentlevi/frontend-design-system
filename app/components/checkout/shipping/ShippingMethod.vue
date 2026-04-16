<template>
	<div class="checkout-member-block">
		<div class="checkout-member-block-head">
			<div class="checkout-member-block-title">
				{{ translate('checkout.member.shippingMethod') }}
			</div>
			<div class="checkout-member-block-note">
				{{ translate('checkout.member.shippingNote') }}
			</div>
		</div>

		<ShippingMethodSkeletonLoader
			v-if="is_loading || active_shipping_methods.length === 0"
		/>
		<template v-else>
			<div
				class="checkout-member-card-grid"
				:class="{ 'only-one': active_shipping_methods.length === 1 }"
			>
				<button
					v-for="method in active_shipping_methods"
					:key="method.key"
					type="button"
					class="checkout-member-choice-card"
					:class="{
						'is-active': selected_shipping_method === method.key,
					}"
					@click="selectShippingMethod(method.key)"
				>
					<img
						:src="method.icon"
						:alt="method.name"
						class="checkout-member-choice-icon"
					>

					<div class="checkout-member-choice-copy">
						<div class="checkout-member-choice-title-row">
							<div class="checkout-member-choice-title">
								{{ method.name }}
							</div>
						</div>
						<div class="checkout-member-choice-subtitle">
							{{
								active_shipping_methods.length === 1
									? method.longer_date_message
									: method.date
							}}
						</div>
					</div>

					<div class="checkout-member-choice-price">
						{{ method.price }}
					</div>
				</button>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { useShippingMethod } from '~/composables/checkout/shipping/useShippingMethod';
import ShippingMethodSkeletonLoader from '~/components/checkout/shipping/SkeletonShippingMethod.vue';

const { t: translate } = useI18n();

const {
	is_loading,
	active_shipping_methods,
	selected_shipping_method,
	selectShippingMethod,
} = useShippingMethod();
</script>

<style scoped lang="scss">
.checkout-member-block {
	display: grid;
	gap: 8px;

	.checkout-member-block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.checkout-member-block-title {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.checkout-member-block-note {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		text-align: right;
	}

	.checkout-member-card-grid {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(2, minmax(0, 1fr));

		&.only-one {
			grid-template-columns: 1fr;
		}

		.checkout-member-choice-card {
			min-height: 62px;
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 14px 16px;
			border: 1px solid var(--gray-40);
			border-radius: 12px;
			background: var(--contrast-light);
			text-align: left;
			cursor: pointer;

			&.is-active {
				border-color: var(--gray-60);
				background: var(--gray-20);
			}

			.checkout-member-choice-icon {
				width: 36px;
				height: 36px;
				object-fit: contain;
				flex-shrink: 0;
			}

			.checkout-member-choice-copy {
				flex: 1;
				display: grid;
				gap: 4px;
			}

			.checkout-member-choice-title-row {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 8px;
			}

			.checkout-member-choice-title {
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				color: var(--text-primary);
			}

			.checkout-member-choice-badge {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				flex-shrink: 0;
			}

			.checkout-member-choice-badge-copy {
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
			}

			.checkout-member-choice-subtitle {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
			}

			.checkout-member-choice-price {
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				color: var(--text-primary);
			}
		}
	}
}

@media (max-width: 760px) {
	.checkout-member-block {
		.checkout-member-block-head {
			align-items: flex-start;
			flex-direction: column;
		}

		.checkout-member-block-note {
			text-align: left;
		}

		.checkout-member-card-grid {
			grid-template-columns: 1fr;
		}
	}
}
</style>