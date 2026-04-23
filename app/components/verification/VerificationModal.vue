<script setup lang="ts">
import { useVerificationModal } from '~/composables/verification/useVerificationModal'

const {
	translate,
	is_modal_open,
	email,
	error,
	resend_limit_reached,
	is_verifying,
	code_inputs,
	input_refs,
	can_resend,
	modal_align,
	test_id_prefix,
	modal_class,
	formatted_error_parts,
	setModalOpen,
	submitVerification,
	onInput,
	onPaste,
	onResendClick,
	handleKeyDown,
} = useVerificationModal()
</script>

<template>
	<UiModal
		:model-value="is_modal_open"
		:close-on-backdrop="false"
		width="504px"
		:align="modal_align"
		:modal-class="modal_class"
		@update:model-value="setModalOpen"
	>
		<div class="auth-verification-modal">
			<UiLoadingOverlay
				:visible="is_verifying"
				:label="translate('auth.verification.verifying')"
				test-id="verification-modal-loading-overlay"
				variant="modal"
				position="absolute"
			/>

			<UiButton
				variant="ghost"
				tone="neutral"
				size="24"
				:no-hover="true"
				class="auth-verification-close"
				:aria-label="translate(`auth.verification.closeModal`)"
				:sr-label="translate(`auth.verification.closeModal`)"
				icon-only
				icon="regular-times"
				:icon-size="24"
				@click="setModalOpen(false)"
			/>

			<div class="auth-verification-head">
				<slot name="icon">
					<img
						src="/illustrations/icon-verification.svg"
						:alt="translate(`auth.verification.iconAlt`)"
						class="auth-verification-icon"
					>
				</slot>
				<div class="auth-verification-copy">
					<h3 class="auth-verification-title">
						{{ translate(`auth.verification.title`) }}
					</h3>
					<p class="auth-verification-text">
						{{ translate(`auth.verification.messagePrefix`) }}
						<strong class="auth-verification-email">
							{{ email }}
						</strong>{{ translate(`auth.verification.messageSuffix`) }}
					</p>
				</div>
			</div>

			<div class="auth-verification-code-group">
				<label class="auth-verification-label" :for="`${test_id_prefix}-code-0`">
					{{ translate(`auth.verification.enterCode`) }}
				</label>
				<div class="auth-verification-grid">
					<input
						v-for="(value, index) in code_inputs"
						:id="`${test_id_prefix}-code-${index}`"
						:key="`${test_id_prefix}-code-${index}`"
						:ref="
							el => {
								if (el) input_refs[index] = el as HTMLInputElement
							}
						"
						:class="['auth-verification-input', { 'auth-verification-input--error': !!error }]"
						type="text"
						inputmode="numeric"
						maxlength="1"
						autocomplete="one-time-code"
						placeholder="0"
						:value="value"
						:data-testid="`${test_id_prefix}-code-${index + 1}`"
						@input="onInput(index, $event)"
						@keydown="handleKeyDown(index, $event)"
						@paste="onPaste"
					>
				</div>
				<p
					v-if="error"
					class="auth-verification-error"
					data-testid="verification-modal-error"
				>
					<template
						v-for="(part, index) in formatted_error_parts"
						:key="`${part.text}-${index}`"
					>
						<strong v-if="part.is_bold">{{ part.text }}</strong>
						<template v-else>{{ part.text }}</template>
					</template>
				</p>
			</div>

			<div class="auth-verification-actions">
				<UiButton
					variant="filled"
					tone="neutral"
					size="lg"
					class="auth-verification-submit"
					:data-testid="`${test_id_prefix}-submit`"
					@click="submitVerification"
				>
					{{ translate(`auth.verification.verify`) }}
				</UiButton>

				<p v-if="!resend_limit_reached" class="auth-verification-resend">
					{{ translate(`auth.verification.resendPrefix`) }}
					<UiButton
						variant="ghost"
						tone="neutral"
						size="sm"
						:no-hover="true"
						class="auth-verification-resend-btn"
						label-class="auth-verification-resend-btn-label"
						:data-testid="`${test_id_prefix}-resend`"
						:disabled="!can_resend"
						@click="onResendClick"
					>
						{{ translate(`auth.verification.resendCta`) }}
					</UiButton>{{ translate(`auth.verification.resendSuffix`) }}
				</p>
				<p v-else class="auth-verification-resend">
					{{ translate(`auth.verification.resendLimitReachedPrefix`) }}
					<b>{{ translate(`auth.verification.resendLimitReachedMiddle`) }}</b>{{ translate(`auth.verification.resendLimitReachedSuffix`) }}
				</p>

				<!-- COOLDOWN TIMER -->
				<!-- <p
					v-if="resend_cooldown_remaining > 0"
					class="auth-verification-resend"
				>
					{{ translate(`auth.verification.resendCooldown`, {
						seconds: resend_cooldown_remaining,
					}) }}
				</p> -->
			</div>
		</div>
	</UiModal>
</template>

<style scoped lang="scss">
.auth-verification-modal {
    position: relative;
    padding: var(--ui-modal-padding, 16px);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 32px;

    .auth-verification-close {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 24px;
        height: 24px;
        padding: 0;
        min-height: auto;
        border-radius: 0;
        box-shadow: none;
        z-index: 1;

    }

    .auth-verification-head {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr);
        align-items: start;
        gap: 16px;

        .auth-verification-icon {
            width: 52px;
            height: 52px;
            object-fit: contain;
            display: block;
        }

        .auth-verification-copy {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .auth-verification-title {

                color: var(--text-primary);
                font-size: var(--type-size-400);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-400);
            }

            .auth-verification-text {

                color: var(--text-secondary);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);

                .auth-verification-email {
                    color: #c3a700;
                    font-weight: var(--font-weight-bold);
                }
            }
        }
    }

    .auth-verification-code-group {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .auth-verification-label {

            color: var(--text-primary);
            font-size: var(--type-size-100);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-100);
        }

        .auth-verification-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;

            .auth-verification-input {
                height: 56px;
                border: 1px solid var(--border-default);
                border-radius: 8px;
                padding: 0;
                color: var(--text-primary);
                font-size: var(--type-size-400);
                line-height: var(--type-line-400);
                font-weight: var(--font-weight-bold);
                text-align: center;
                transition: border-color 0.2s ease;

                &::placeholder {
                    color: var(--gray-60);
                }

                &:focus {
                    outline: none;
                    border-color: var(--brand-primary);
                }

                &--error {
                    border-color: var(--error);

                    &:focus {
                        border-color: var(--error);
                    }
                }
            }
        }

        .auth-verification-error {

            color: var(--error);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);

            strong {
                font-weight: var(--font-weight-bold);
            }
        }
    }

    .auth-verification-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .auth-verification-submit {
            width: 100%;
            border-radius: 16px;
            font-size: var(--type-size-200);
            line-height: var(--type-line-200);
            box-shadow: none;
        }

        .auth-verification-resend {

            color: var(--text-secondary);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);

            .auth-verification-resend-btn {
                padding: 0;
                min-height: auto;
                height: auto;
                border-radius: 0;
                box-shadow: none;
                color: var(--text-primary);

                &:disabled {
                    color: var(--text-muted);
                }

                :deep(.auth-verification-resend-btn-label) {
                    padding: 0;
                    text-decoration: underline;
                    font-size: inherit;
                    line-height: inherit;
                    font-weight: var(--font-weight-bold);
                }

                &:disabled {
                    :deep(.auth-verification-resend-btn-label) {
                        text-decoration: none;
                    }
                }
            }
        }

    }
}

@media (max-width: 900px) {
    .auth-verification-modal {
        .auth-verification-head {
            .auth-verification-icon {
                width: 46px;
                height: 46px;
            }
        }
    }
}

:deep(.auth-verification-modal .ui-loading-overlay) {
    border-radius: 14px;
}
</style>