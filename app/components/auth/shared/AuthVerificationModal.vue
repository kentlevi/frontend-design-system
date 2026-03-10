<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import lottie from 'lottie-web';
import { useI18n } from 'vue-i18n';
import { useVerificationCodeInput } from '@/composables/auth/useVerificationCodeInput';
import { authVerificationConfig, type AuthVerificationI18nBase } from '@/data/auth/verification';

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		modelValue: boolean;
		email?: string;
		code?: string;
		error?: string;
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

const { codeInputs, inputRefs, setCode, getCode, handleInput, handleKeyDown, handlePaste } =
	useVerificationCodeInput(props.otpLength);

const key = computed(() => props.translationBase);

watch(
	() => props.code,
	(value) => {
		setCode(value ?? '');
	},
	{ immediate: true }
);

const computedSubmitLabel = computed(() =>
	props.verifying
		? props.busyLabel || t(`${key.value}.verifying`)
		: props.submitLabel || t(`${key.value}.verify`)
);
const hasTriggeredResend = ref(false);
const isResendLocked = ref(false);
const canResend = computed(() => {
	if (!hasTriggeredResend.value) return true;
	if (isResendLocked.value) return false;
	return props.resendCooldownRemaining <= 0;
});
const modalAlign = computed<'top' | 'center' | 'bottom'>(() =>
	props.align === 'start' ? 'top' : props.align
);
const verifyLoaderRef = ref<HTMLElement | null>(null);
let verifyLoaderAnimation: ReturnType<typeof lottie.loadAnimation> | null = null;

function closeModal() {
	emit('update:modelValue', false);
}

function emitCode() {
	emit('update:code', getCode());
}

function onInput(index: number, event: Event) {
	handleInput(index, event);
	emitCode();
}

function onPaste(event: ClipboardEvent) {
	handlePaste(event);
	emitCode();
}

function onResendClick() {
	if (!canResend.value) return;
	hasTriggeredResend.value = true;
	isResendLocked.value = true;
	emit('resend');
}

function destroyVerifyLoaderAnimation() {
	if (!verifyLoaderAnimation) return;
	verifyLoaderAnimation.destroy();
	verifyLoaderAnimation = null;
}

async function mountVerifyLoaderAnimation() {
	if (typeof window === 'undefined' || !verifyLoaderRef.value) return;
	destroyVerifyLoaderAnimation();
	const response = await fetch('/animations/musticker-loader.json');
	if (!response.ok) return;
	const animationData = await response.json();
	verifyLoaderAnimation = lottie.loadAnimation({
		container: verifyLoaderRef.value,
		renderer: 'svg',
		loop: true,
		autoplay: true,
		animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid meet',
		},
	});
}

watch(
	() => props.verifying,
	async (loading) => {
		if (!loading) {
			destroyVerifyLoaderAnimation();
			return;
		}
		await nextTick();
		await mountVerifyLoaderAnimation();
	}
);

watch(
	() => props.resendCooldownRemaining,
	(remaining) => {
		if (!hasTriggeredResend.value) return;
		if (remaining > 0) {
			isResendLocked.value = true;
			return;
		}

		isResendLocked.value = false;
	}
);

watch(
	() => props.modelValue,
	(isOpen) => {
		if (!isOpen) return;
		hasTriggeredResend.value = false;
		isResendLocked.value = false;
	}
);

onBeforeUnmount(() => {
	destroyVerifyLoaderAnimation();
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
			<Transition name="auth-verification-loading-fade">
				<div
					v-if="verifying"
					class="auth-verification-loading-overlay"
					data-testid="auth-verification-loading-overlay"
				>
					<div
						class="auth-verification-loading-loader"
						role="status"
						aria-live="polite"
						:aria-label="computedSubmitLabel"
					>
						<div ref="verifyLoaderRef" class="auth-verification-loading-lottie" aria-hidden="true" />
					</div>
				</div>
			</Transition>

			<button
				v-if="showCloseButton"
				type="button"
				class="auth-verification-close"
				:aria-label="t(`${key}.closeModal`)"
				@click="closeModal"
			>
				<UiIcon name="regular-times" :size="24" color="#2a2f3d" />
			</button>

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

				<p class="auth-verification-resend">
					{{ t(`${key}.resendPrefix`) }}
					<button
						type="button"
						class="auth-verification-resend-btn"
						:data-testid="`${testIdPrefix}-resend`"
						:disabled="!canResend"
						@click="onResendClick"
					>
						{{ t(`${key}.resendCta`) }}
					</button>
					{{ t(`${key}.resendSuffix`) }}
				</p>
			</div>
		</div>
	</UiModal>
</template>

<style scoped lang="scss">
.auth-verification-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 32px;

    .auth-verification-loading-overlay {
        position: absolute;
        inset: 0;
        background: rgba(246, 246, 248, 0.72);
        display: grid;
        place-items: center;
        z-index: 5;
        border-radius: 22px;
    }

    .auth-verification-loading-loader {
        width: 74px;
        height: 74px;
        display: grid;
        place-items: center;
    }

    .auth-verification-loading-lottie {
        width: 100%;
        height: 100%;

        :deep(svg) {
            width: 100%;
            height: 100%;
            display: block;
        }
    }

    .auth-verification-close {
        position: absolute;
        top: -16px;
        right: -16px;
        border: 0;
        background: transparent;
        width: 24px;
        height: 24px;
        padding: 0;
        display: grid;
        place-items: center;
        cursor: pointer;
    }

    .auth-verification-head {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: 16px;

        .auth-verification-copy {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .auth-verification-title {
                margin: 0;
                color: var(--text-primary);
                font-size: var(--type-size-400);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-400);
            }

            .auth-verification-text {
                margin: 0;
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
            margin: 0;
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
            margin: 0;
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
            margin: 0;
            color: var(--text-secondary);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);

            .auth-verification-resend-btn {
                border: 0;
                background: transparent;
                color: var(--text-primary);
                text-decoration: underline;
                font-size: inherit;
                line-height: inherit;
                font-weight: var(--font-weight-bold);
                padding: 0;

                &:disabled {
                    color: var(--text-muted);
                    cursor: not-allowed;
                    text-decoration: none;
                }
            }
        }

    }
}

.auth-verification-loading-fade-enter-active,
.auth-verification-loading-fade-leave-active {
    transition: opacity 0.16s ease;
}

.auth-verification-loading-fade-enter-from,
.auth-verification-loading-fade-leave-to {
    opacity: 0;
}
</style>