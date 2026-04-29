<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, toRef } from 'vue';
import { useAuthVerificationModal } from '~/composables/auth/verification/useAuthVerificationModal';
import { authVerificationConfig, type AuthVerificationI18nBase } from '~/data/auth/verification';

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		modelValue: boolean;
		email?: string;
		showEmailInMessage?: boolean;
		code?: string;
		error?: string;
		resendLimitReached?: string;
		verifying?: boolean;
		submitLabel?: string;
		busyLabel?: string;
		translationBase?: AuthVerificationI18nBase;
		orderNumber?: string;
		otpLength?: number;
		testIdPrefix?: string;
		showCloseButton?: boolean;
		align?: 'start' | 'top' | 'center' | 'bottom';
		width?: string;
		modalClass?: string;
		resendCooldownRemaining?: number;
	}>(),
	{
		email: '',
		showEmailInMessage: true,
		code: '',
		error: '',
		resendLimitReached: '',
		verifying: false,
		submitLabel: '',
		busyLabel: '',
		translationBase: 'auth.verification',
		orderNumber: '',
		otpLength: authVerificationConfig.otpLength,
		testIdPrefix: 'auth-verification',
		showCloseButton: false,
		align: 'top',
		width: '504px',
		modalClass: '',
		resendCooldownRemaining: 0,
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'update:code', value: string): void;
	(e: 'verify'): void;
	(e: 'resend'): void;
	(e: 'close'): void;
}>();

const {
	codeInputs: code_inputs,
	inputRefs: input_refs,
	key: translation_key,
	computedSubmitLabel: computed_submit_label,
	canResend: can_resend,
	modalAlign: modal_align,
	closeModal: baseCloseModal,
	onInput,
	onPaste,
	onResendClick,
	handleKeyDown,
} = useAuthVerificationModal({
	otpLength: toRef(props, 'otpLength'),
	code: toRef(props, 'code'),
	verifying: toRef(props, 'verifying'),
	submitLabel: toRef(props, 'submitLabel'),
	busyLabel: toRef(props, 'busyLabel'),
	translationBase: toRef(props, 'translationBase'),
	resendCooldownRemaining: toRef(props, 'resendCooldownRemaining'),
	modelValue: toRef(props, 'modelValue'),
	align: toRef(props, 'align'),
	emitUpdateModelValue: (value) => emit('update:modelValue', value),
	emitUpdateCode: (value) => emit('update:code', value),
	emitResend: () => emit('resend'),
});

/**
 * Extra logic when modal closes
 */
function runCloseSideEffects() {
	/** Example cleanup */
	emit('update:code', '');
	emit('close');
}

/**
 * Wrapped close modal
 */
function closeModal() {
	runCloseSideEffects();
	baseCloseModal();
}

/**
 * Catch UiModal model changes
 *
 * This is important because the modal may close
 * from places other than your button.
 */
function handleModalModelValueUpdate(value: boolean) {
	if (!value) {
		closeModal();
		return;
	}

	emit('update:modelValue', value);
}

const formatted_error_parts = computed(() => {
	if (!props.error) return [];

	return props.error
		.split(/(\[b\].*?\[\/b\]|<b>.*?<\/b>)/g)
		.filter(Boolean)
		.map(part => {
			const match = part.match(/^<b>(.*?)<\/b>$|^\[b\](.*?)\[\/b\]$/);
			return {
				text: match ? (match[1] || match[2] || '') : part,
				is_bold: Boolean(match),
			};
		});
});
</script>

<template>
	<UiModal
		:model-value="modelValue"
		:close-on-backdrop="false"
		:width="width"
		:align="modal_align"
		:modal-class="modalClass"
		@update:model-value="handleModalModelValueUpdate"
	>
		<template #overlay>
			<UiLoadingOverlay
				:visible="verifying"
				:label="computed_submit_label"
				test-id="auth-verification-loading-overlay"
				variant="modal"
				position="absolute"
			/>
		</template>
		<div class="auth-verification-modal">
			<UiButton
				v-if="showCloseButton"
				variant="ghost"
				tone="neutral"
				size="24"
				:no-hover="true"
				class="auth-verification-close"
				:aria-label="t(`${translation_key}.closeModal`)"
				:sr-label="t(`${translation_key}.closeModal`)"
				icon-only
				icon="regular-times"
				:icon-size="24"
				@click="closeModal"
			/>

			<div class="auth-verification-head">
				<slot name="icon">
					<img
						src="/illustrations/icon-verification.svg"
						:alt="t(`${translation_key}.iconAlt`)"
						class="auth-verification-icon"
					>
				</slot>
				<div class="auth-verification-copy">
					<h3 class="auth-verification-title">
						{{ t(`${translation_key}.title`) }}
					</h3>
					<p class="auth-verification-text">
						{{ t(`${translation_key}.messagePrefix`) }}
						<template v-if="showEmailInMessage">
							<strong class="auth-verification-email">{{ email }}</strong>
						</template>{{ t(`${translation_key}.messageSuffix`) }}
					</p>
				</div>
			</div>

			<div class="auth-verification-code-group">
				<label class="auth-verification-label" :for="`${testIdPrefix}-code-0`">
					{{ t(`${translation_key}.enterCode`) }}
				</label>
				<div class="auth-verification-grid">
					<input
						v-for="(value, index) in code_inputs"
						:id="`${testIdPrefix}-code-${index}`"
						:key="`${testIdPrefix}-code-${index}`"
						:ref="el => { if (el) input_refs[index] = el as HTMLInputElement }"
						:class="['auth-verification-input', { 'auth-verification-input--error': !!error }]"
						type="text"
						inputmode="numeric"
						maxlength="1"
						autocomplete="one-time-code"
						placeholder="0"
						:value="value"
						:data-testid="`${testIdPrefix}-code-${index + 1}`"
						@input="onInput(index, $event)"
						@keydown="handleKeyDown(index, $event)"
						@paste="onPaste"
					>
				</div>
				<p
					v-if="error"
					class="auth-verification-error"
					data-testid="auth-verification-error"
				>
					<template v-for="(part, index) in formatted_error_parts" :key="`${part.text}-${index}`">
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
					:data-testid="`${testIdPrefix}-submit`"
					@click="emit('verify')"
				>
					{{ computed_submit_label }}
				</UiButton>

				<p v-if="!resendLimitReached" class="auth-verification-resend">
					{{ t(`${translation_key}.resendPrefix`) }}
					<UiButton
						variant="ghost"
						tone="neutral"
						size="sm"
						:no-hover="true"
						class="auth-verification-resend-btn"
						label-class="auth-verification-resend-btn-label"
						:data-testid="`${testIdPrefix}-resend`"
						:disabled="!can_resend"
						@click="onResendClick"
					>
						{{ t(`${translation_key}.resendCta`) }}
					</UiButton>{{ t(`${translation_key}.resendSuffix`) }}
				</p>
				<p v-else class="auth-verification-resend">
					{{ t(`${translation_key}.resendLimitReachedPrefix`) }} <b>{{ t(`${translation_key}.resendLimitReachedMiddle`) }}</b>{{ t(`${translation_key}.resendLimitReachedSuffix`) }}
				</p>
			</div>
		</div>
	</UiModal>
</template>

<style scoped lang="scss">
.auth-verification-modal {
    position: relative;
    margin: calc(var(--ui-modal-padding, 40px) * -1);
    padding: var(--ui-modal-padding, 40px);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 32px;

    .auth-verification-close {
        position: absolute;
        top: 24px;
        right: 24px;
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

:deep(.ui-loading-overlay) {
    border-radius: 14px;
}
</style>