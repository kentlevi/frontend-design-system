<script setup lang="ts">
import { ref } from 'vue';
import { useDismissibleTooltip } from '~/composables/checkout/features/useDismissibleTooltip';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import {
	checkoutGuestEmailTooltipContent,
	checkoutGuestEmailTooltipProps,
} from '~/data/checkout/tooltips';

const {
	t,
	is_member,
	email,
	email_tooltip_open,
	toggleEmailTooltip,
	openLoginModal,
} = useCheckoutExperienceFeatureContext();

const email_tooltip_ref = ref<HTMLElement | null>(null);

useDismissibleTooltip(email_tooltip_ref, email_tooltip_open);
</script>

<template>
	<section v-if="!is_member" class="checkout-member-section">
		<h2 class="checkout-member-section-title">{{ t('checkout.guest.contactInformation') }}</h2>
		<div class="checkout-section-body checkout-section-body--compact">
			<div class="checkout-contact-group">
				<div class="checkout-contact-head">
					<div ref="email_tooltip_ref" class="checkout-contact-label-wrap">
						<span class="checkout-label">
							Email
							<span class="checkout-label-required" aria-hidden="true">*</span>
						</span>
						<UiTooltip
							:open="email_tooltip_open"
							v-bind="checkoutGuestEmailTooltipProps"
						>
							<template #trigger>
								<button type="button" class="ui-tooltip-icon-trigger" @click="toggleEmailTooltip">
									<UiIcon :name="email_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="20" color="var(--text-secondary)" decorative />
								</button>
							</template>
							<div class="ui-tooltip-copy">
								<strong class="ui-tooltip-title">{{ checkoutGuestEmailTooltipContent.title }}</strong>
								<p class="ui-tooltip-text">{{ checkoutGuestEmailTooltipContent.text }}</p>
							</div>
						</UiTooltip>
					</div>
					<div class="checkout-login-link">
						<span class="checkout-login-link-text">{{ t('checkout.guest.loginPrompt') }}</span>
						<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-login-link-action" label-class="checkout-login-link-action-label" @click="openLoginModal">
							{{ t('checkout.guest.login') }}
						</UiButton>
					</div>
				</div>
				<UiInput v-model="email" type="email" class="checkout-input" :placeholder="t('checkout.guest.fields.email.placeholder')" />
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.checkout-member-section {
	display: grid;
	gap: 12px;

	.checkout-member-section-title {
		font-size: var(--type-size-300);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.checkout-section-body {
		display: flex;
		flex-direction: column;
		gap: 12px;

		&.checkout-section-body--compact {
			gap: 16px;
		}

		.checkout-contact-group {
			display: flex;
			flex-direction: column;
			gap: 8px;

			.checkout-contact-head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;

				.checkout-contact-label-wrap {
					display: inline-flex;
					align-items: center;
					gap: 4px;

					.checkout-label-required {
						color: var(--error);
					}

				}

				.checkout-login-link {
					display: inline-flex;
					align-items: center;
					color: var(--text-primary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);

					:deep(.checkout-login-link-action) {
						--btn-soft: transparent;
						--btn-border: transparent;
						--btn-bg: transparent;
						margin-left: 4px;
						min-height: auto;
						height: auto;
						padding: 0;
						border-radius: 0;
						box-shadow: none;
						color: var(--gold-60);
						font-weight: var(--font-weight-semibold);
						text-decoration: underline;
						text-underline-offset: 3px;
						text-decoration-thickness: 2px;
					}

					:deep(.checkout-login-link-action-label) {
						padding: 0;
					}
				}
			}

			:deep(.checkout-input) {
				width: 100%;
			}
		}
	}
}

@media (max-width: 760px) {
	.checkout-member-section {
		.checkout-section-body {
			.checkout-contact-group {
				.checkout-contact-head {
					align-items: flex-start;
					flex-direction: column;
					gap: 4px;
				}
			}
		}
	}
}
</style>