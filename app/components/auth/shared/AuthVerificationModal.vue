<script setup lang="ts">
import { watch } from 'vue';
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
        align?: 'start' | 'center';
        width?: string;
        modalClass?: string;
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
        align: 'center',
        width: '504px',
        modalClass: '',
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
</script>

<template>
    <UiModal
        :model-value="modelValue"
        :width="width"
        :align="align"
        :modal-class="modalClass"
        :data-testid="`${testIdPrefix}-modal`"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <div class="auth-verification-modal">
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
                    <p v-if="orderNumber" class="auth-verification-order-number">
                        {{ t(`${key}.orderNumberLabel`) }}: {{ orderNumber }}
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
                        :value="value"
                        :data-testid="`${testIdPrefix}-code-${index + 1}`"
                        @input="onInput(index, $event)"
                        @keydown="handleKeyDown(index, $event)"
                        @paste="onPaste"
                    />
                </div>
                <p v-if="error" class="auth-verification-error">
                    {{ error }}
                </p>
            </div>

            <div class="auth-verification-actions">
                <UiButton
                    variant="filled"
                    tone="neutral"
                    size="lg"
                    class="auth-verification-submit"
                    :disabled="verifying"
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
                        @click="emit('resend')"
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
    gap: 24px;

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
        gap: 14px;
    }

    .auth-verification-copy {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .auth-verification-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 24px;
        font-weight: 600;
        line-height: 36px;
        letter-spacing: -0.02em;
    }

    .auth-verification-text {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;
    }

    .auth-verification-email {
        color: #c3a700;
        font-weight: 700;
    }

    .auth-verification-order-number {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;
    }

    .auth-verification-code-group {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .auth-verification-label {
        margin: 0;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 600;
        line-height: 24px;
    }

    .auth-verification-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
    }

    .auth-verification-input {
        height: 56px;
        border: 1px solid var(--border-default);
        border-radius: 8px;
        padding: 0;
        color: var(--text-primary);
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        transition: border-color 0.2s ease;

        &:focus {
            outline: none;
            border-color: var(--brand-primary);
        }
    }

    .auth-verification-input--error {
        border-color: var(--error);

        &:focus {
            border-color: var(--error);
        }
    }

    .auth-verification-error {
        margin: 0;
        color: var(--error);
        font-size: 14px;
        line-height: 24px;
    }

    .auth-verification-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .auth-verification-submit {
        width: 100%;
        border-radius: 16px;
        font-size: 16px;
        line-height: 26px;
        box-shadow: none;
    }

    .auth-verification-resend {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.2;
    }

    .auth-verification-resend-btn {
        border: 0;
        background: transparent;
        color: var(--text-primary);
        text-decoration: underline;
        font-size: inherit;
        font-weight: 700;
        padding: 0;
    }
}
</style>
