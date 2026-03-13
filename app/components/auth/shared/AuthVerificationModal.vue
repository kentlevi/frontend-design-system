<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { toRef } from 'vue';
import { useAuthVerificationModal } from '~/composables/auth/verification/useAuthVerificationModal';
import { authVerificationConfig, type AuthVerificationI18nBase } from '~/data/auth/verification';

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		modelValue: boolean;
		email?: string;
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
}>();

const {
	codeInputs,
	inputRefs,
	key,
	computedSubmitLabel,
	canResend,
	modalAlign,
	closeModal,
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
</script>

<template>
	<UiModal
		:model-value="modelValue"
		:close-on-backdrop="false"
		:width="width"
		:align="modalAlign"
		:modal-class="modalClass"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<div class="auth-verification-modal">
			<UiLoadingOverlay
				:visible="verifying"
				:label="computedSubmitLabel"
				test-id="auth-verification-loading-overlay"
				position="absolute"
				background="rgba(246, 246, 248, 0.72)"
				:z-index="5"
				loader-width="74px"
				loader-height="74px"
			/>

			<UiButton
				v-if="showCloseButton"
				variant="ghost"
				tone="neutral"
				size="24"
				:no-hover="true"
				class="auth-verification-close"
				:aria-label="t(`${key}.closeModal`)"
				:sr-label="t(`${key}.closeModal`)"
				icon-only
				icon="regular-times"
				:icon-size="24"
				@click="closeModal"
			/>

			<div class="auth-verification-head">
				<slot name="icon">
					<UiIcon name="strong-shield" :size="46" color="var(--brand-primary)" />
				</slot>
				<div class="auth-verification-copy">
					<h3 class="auth-verification-title">
						{{ t(`${key}.title`) }}
					</h3>
					<p class="auth-verification-text">
						{{ t(`${key}.messagePrefix`) }}
						<strong class="auth-verification-email">{{ email }}</strong>
						{{ t(`${key}.messageSuffix`) }}
					</p>
				</div>
			</div>

			<div class="auth-verification-code-group">
				<label class="auth-verification-label" :for="`${testIdPrefix}-code-0`">
					{{ t(`${key}.enterCode`) }}
				</label>
				<div class="auth-verification-grid">
					<input
						v-for="(value, index) in codeInputs"
						:id="`${testIdPrefix}-code-${index}`"
						:key="`${testIdPrefix}-code-${index}`"
						:ref="el => { if (el) inputRefs[index] = el as HTMLInputElement }"
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
					{{ error }}
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
					{{ computedSubmitLabel }}
				</UiButton>

				<p v-if="!resendLimitReached" class="auth-verification-resend">
					{{ t(`${key}.resendPrefix`) }}
					<UiButton
						variant="ghost"
						tone="neutral"
						size="sm"
						:no-hover="true"
						class="auth-verification-resend-btn"
						label-class="auth-verification-resend-btn-label"
						:data-testid="`${testIdPrefix}-resend`"
						:disabled="!canResend"
						@click="onResendClick"
					>
						{{ t(`${key}.resendCta`) }}
					</UiButton>
					{{ t(`${key}.resendSuffix`) }}
				</p>
				<p v-else class="auth-verification-resend">
					{{ t(`${key}.resendLimitReachedPrefix`) }} <b>{{ t(`${key}.resendLimitReachedMiddle`) }}</b>{{ t(`${key}.resendLimitReachedSuffix`) }}
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

        :deep(img),
        :deep(svg) {
            display: block;
            width: 48px;
            height: 48px;
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
                .auth-verification-resend-btn-label {
                    padding: 0;
                    text-decoration: underline;
                    font-size: inherit;
                    line-height: inherit;
                    font-weight: var(--font-weight-bold);
                }

                &[disabled] {
                    .auth-verification-resend-btn-label {
                        text-decoration: none;
                    }
                }
            }
        }

    }
}

:deep(.auth-verification-modal .ui-loading-overlay) {
    border-radius: 14px;
}
</style>