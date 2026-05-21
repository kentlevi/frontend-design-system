<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useCheckoutGuestContactFeature } from '~/composables/checkout/features/useCheckoutGuestContactFeature';
import { checkoutGuestEmailTooltipProps } from '~/data/checkout/tooltips';
import { useUsersStore } from '~/stores/users/users.store';

const AuthEmailAlreadyRegisteredModal = defineAsyncComponent(
	() => import('~/components/auth/shared/AuthEmailAlreadyRegisteredModal.vue')
);
const AuthLoginForgotPasswordModal = defineAsyncComponent(
	() => import('~/components/auth/login/AuthLoginForgotPasswordModal.vue')
);
const EmailChangeModal = defineAsyncComponent(
	() => import('~/components/features/checkout/EmailChangeModal.vue')
);

const {
	translate,
	email,
	email_tooltip_open,
	email_tooltip_ref,
	email_field_ref,
	email_input_ref,
	is_authenticated_non_member,
	is_guest_email_locked,
	toggleEmailTooltip,
	openLoginModal,
	is_email_already_registered_modal_open,
	registered_email_password,
	registered_email_password_error,
	registered_email_password_visible,
	registered_email_social_provider,
	is_registered_email_forgot_password_modal_open,
	setEmailAlreadyRegisteredModalOpen,
	onRegisteredEmailPasswordInput,
	setRegisteredEmailPasswordVisible,
	continueWithRegisteredEmail,
	openRegisteredEmailForgotPasswordModal,
	onRegisteredEmailForgotPasswordModalChange,
	restoreRegisteredEmailModal,
	setGuestEmail,
	openEmailChangeModal,
	handleGuestEmailBlur,
} = useCheckoutGuestContactFeature();

const users_store = useUsersStore()

const { is_authenticated, role_code } = storeToRefs(users_store)
</script>

<template>
	<VerificationModal />
	<section v-if="!is_authenticated || role_code === 'NON_MEMBER'" class="checkout-member-section">
		<h2 class="checkout-member-section-title">
			{{ translate('checkout.guest.contactInformation') }}
		</h2>
		<div class="checkout-section-body checkout-section-body--compact">
			<div ref="email_field_ref" class="checkout-contact-group">
				<div class="checkout-contact-head">
					<div
						ref="email_tooltip_ref"
						class="checkout-contact-label-wrap"
					>
						<span class="checkout-label">
							{{ translate('checkout.guest.fields.email.label') }}
							<span
								class="checkout-label-required"
								aria-hidden="true"
							>*</span
							>
						</span>
						<UiTooltip
							:open="email_tooltip_open"
							v-bind="checkoutGuestEmailTooltipProps"
						>
							<template #trigger>
								<button
									type="button"
									class="ui-tooltip-icon-trigger"
									@click="toggleEmailTooltip"
								>
									<UiIcon
										:name="
											email_tooltip_open
												? 'strong-question-circle'
												: 'regular-question-circle'
										"
										size="20"
										color="var(--gray-90)"
										decorative
									/>
								</button>
							</template>
							<div class="ui-tooltip-copy">
								<strong class="ui-tooltip-title">{{
									translate('checkout.guest.emailTooltip.title')
								}}</strong>
								<p class="ui-tooltip-text">
									{{ translate('checkout.guest.emailTooltip.text') }}
								</p>
							</div>
						</UiTooltip>
					</div>
					<div class="checkout-login-link">
						<span class="checkout-login-link-text">{{
							translate('checkout.guest.loginPrompt')
						}}</span>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="sm"
							class="checkout-login-link-action"
							label-class="checkout-login-link-action-label"
							@click="openLoginModal"
						>
							{{ translate('checkout.guest.login') }}
						</UiButton>
					</div>
				</div>
				<UiInput
					ref="email_input_ref"
					:model-value="email"
					type="email"
					class="checkout-input"
					:disabled="is_guest_email_locked"
					:placeholder="
						translate('checkout.guest.fields.email.placeholder')
					"
					@update:model-value="setGuestEmail"
					@blur="handleGuestEmailBlur"
				>
					<template v-if="is_authenticated_non_member && is_guest_email_locked" #icon-right>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="sm"
							class="checkout-email-change-button"
							label-class="checkout-email-change-button-label"
							:no-hover="true"
							@mousedown.prevent
							@click.stop="openEmailChangeModal"
						>
							{{ translate('checkout.guest.emailChange.change') }}
						</UiButton>
					</template>
				</UiInput>
			</div>
		</div>
	</section>

	<AuthEmailAlreadyRegisteredModal
		:model-value="is_email_already_registered_modal_open"
		:email="email"
		:password="registered_email_password"
		:password-error="registered_email_password_error"
		:password-visible="registered_email_password_visible"
		:social-provider="registered_email_social_provider"
		@update:model-value="setEmailAlreadyRegisteredModalOpen"
		@update:password="onRegisteredEmailPasswordInput"
		@update:password-visible="setRegisteredEmailPasswordVisible"
		@continue="continueWithRegisteredEmail"
		@forgot-password="openRegisteredEmailForgotPasswordModal"
	/>

	<AuthLoginForgotPasswordModal
		:model-value="is_registered_email_forgot_password_modal_open"
		:email="email"
		@update:model-value="onRegisteredEmailForgotPasswordModalChange"
		@return-to-login="restoreRegisteredEmailModal"
	/>

	<EmailChangeModal />
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

				.ui-input-icon {
					width: auto;
					height: auto;
				}
			}

			:deep(.checkout-email-change-button) {
				--btn-soft: transparent;
				--btn-border: transparent;
				--btn-bg: transparent;

				min-height: auto;
				height: auto;
				padding: 0;
				border-radius: 0;
				box-shadow: none;
				color: var(--text-primary);
				font-size: var(--type-size-100);
				font-weight: var(--font-weight-semibold);
				cursor: pointer;

				.checkout-email-change-button-label {
					padding: 0;
				}
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