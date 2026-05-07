<script setup lang="ts">
import { ref } from 'vue';
import { useDismissibleTooltip } from '~/composables/checkout/features/useDismissibleTooltip';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import {
	checkoutMemberPointsTooltipContent,
	checkoutMemberPointsTooltipProps,
} from '~/data/checkout/tooltips';

const {
	t,
	is_member,
	points_to_use,
	points_tooltip_open,
	coupon_code,
	useAllPoints,
	clearPoints,
	togglePointsTooltip,
} = useCheckoutExperienceFeatureContext();

const points_tooltip_ref = ref<HTMLElement | null>(null);

useDismissibleTooltip(points_tooltip_ref, points_tooltip_open);
</script>

<template>
	<div v-if="is_member" class="checkout-member-perks">
		<div class="checkout-member-perks-head">
			{{ t('checkout.member.discountsAndPerks') }}
		</div>
		<div class="checkout-member-perks-body">
			<div class="checkout-member-perk-field">
				<div class="checkout-member-perk-label-row">
					<div ref="points_tooltip_ref" class="checkout-member-perk-label-group">
						<span class="checkout-member-perk-label-primary">{{ t('checkout.member.points') }}</span>
						<UiTooltip :open="points_tooltip_open" v-bind="checkoutMemberPointsTooltipProps">
							<template #trigger>
								<button type="button" class="ui-tooltip-icon-trigger" @click="togglePointsTooltip">
									<UiIcon :name="points_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="24" color="var(--gray-90)" decorative />
								</button>
							</template>
							<div class="ui-tooltip-copy">
								<strong class="ui-tooltip-title">{{ checkoutMemberPointsTooltipContent.title }}</strong>
								<p class="ui-tooltip-text">{{ checkoutMemberPointsTooltipContent.text }}</p>
							</div>
						</UiTooltip>
					</div>
					<span class="checkout-member-perk-label-secondary">{{ t('checkout.member.pointsAvailable', { value: 0 }) }}</span>
				</div>
				<div class="checkout-member-perk-control">
					<UiInput v-model="points_to_use" size="md" :placeholder="t('checkout.member.pointsPlaceholder')" />
					<UiButton variant="outline" tone="neutral" size="md" class="checkout-member-inline-button" @click="points_to_use ? clearPoints() : useAllPoints()">
						{{ points_to_use ? 'Remove' : t('checkout.member.useAll') }}
					</UiButton>
				</div>
			</div>
			<div class="checkout-member-perk-field">
				<div class="checkout-member-perk-label-row">
					<span class="checkout-member-perk-label-primary">{{ t('checkout.member.coupon') }}</span>
				</div>
				<div class="checkout-member-perk-control">
					<UiInput v-model="coupon_code" size="md" :placeholder="t('checkout.member.couponPlaceholder')" />
					<UiButton variant="outline" tone="neutral" size="md" class="checkout-member-inline-button">
						{{ t('checkout.member.applyCoupon') }}
					</UiButton>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.checkout-member-perks {
	border-bottom: 1px solid var(--gray-40);

	.checkout-member-perks-head {
		padding: 18px 24px;
		border-bottom: 1px solid var(--gray-40);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.checkout-member-perks-body {
		display: grid;
		gap: 12px;
		padding: 16px 24px;

		.checkout-member-perk-field {
			display: grid;
			gap: 8px;

			.checkout-member-perk-label-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16px;
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);

				.checkout-member-perk-label-group {
					display: inline-flex;
					align-items: center;
					gap: 6px;
					min-width: 0;
					position: relative;

					.checkout-member-perk-label-primary {
						color: var(--text-primary);
						font-weight: var(--font-weight-semibold);
					}

				}

				.checkout-member-perk-label-secondary {
					flex-shrink: 0;
					text-align: right;
				}
			}

			.checkout-member-perk-control {
				display: grid;
				grid-template-columns: minmax(0, 1fr) auto;
				gap: 12px;

				.checkout-member-inline-button {
					min-width: 98px;
					padding-inline: 18px;
					border-radius: 16px;
				}
			}
		}
	}
}

@media (max-width: 760px) {
	.checkout-member-perks {
		.checkout-member-perks-body {
			.checkout-member-perk-field {
				.checkout-member-perk-label-row {
					align-items: flex-start;
					flex-direction: column;
				}

				.checkout-member-perk-control {
					grid-template-columns: 1fr;
				}
			}
		}
	}
}
</style>