<script setup lang="ts">
import { ref, watch } from 'vue';

const { t } = useI18n();

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        email: string;
        code: string;
        error?: string;
        verifying?: boolean;
    }>(),
    {
        error: '',
        verifying: false,
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'update:code', value: string): void;
    (e: 'verify'): void;
}>();

const codeInputs = ref<Array<string>>(['', '', '', '']);
const inputRefs = ref<HTMLInputElement[]>([]);

watch(
    () => props.code,
    (value) => {
        const digits = (value || '').replace(/\D/g, '').slice(0, 4).split('');
        codeInputs.value = [0, 1, 2, 3].map((index) => digits[index] || '');
    },
    { immediate: true }
);

function emitCode() {
    emit('update:code', codeInputs.value.join(''));
}

function closeModal() {
    emit('update:modelValue', false);
}

function handleInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    codeInputs.value[index] = value;
    emitCode();

    if (value && index < 3) {
        inputRefs.value[index + 1]?.focus();
    }
}

function handleKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !codeInputs.value[index] && index > 0) {
        inputRefs.value[index - 1]?.focus();
    }
}

function handlePaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/\D/g, '').slice(0, 4).split('');
    if (!digits.length) return;

    event.preventDefault();
    codeInputs.value = [0, 1, 2, 3].map((index) => digits[index] || '');
    emitCode();

    const focusIndex = Math.min(digits.length, 3);
    inputRefs.value[focusIndex]?.focus();
}
</script>

<template>
    <UiModal
        :model-value="modelValue"
        width="504px"
        align="center"
        modal-class="auth-register-verification-dialog"
        data-testid="auth-register-verification-modal"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <div class="auth-register-verification-modal">
            <button
                type="button"
                class="auth-register-verification-close"
                aria-label="Close modal"
                @click="closeModal"
            >
                <UiIcon name="regular-times" :size="24" color="#2a2f3d" />
            </button>

            <div class="auth-register-verification-head">
                <img
                    src="/illustrations/icon-verification.svg"
                    alt="Verification shield"
                    class="auth-register-verification-icon"
                />

                <div class="auth-register-verification-copy">
                    <h3 class="auth-register-verification-title">
                        {{ t('auth.login.verification.title') }}
                    </h3>

                    <p class="auth-register-verification-text">
                        {{ t('auth.login.verification.messagePrefix') }}<strong
                            class="auth-register-verification-email"
                            >{{ props.email }}</strong
                        >{{ t('auth.login.verification.messageSuffix') }}
                    </p>
                </div>
            </div>

            <div class="auth-register-verification-code-group">
                <label
                    class="auth-register-verification-label"
                    for="auth-register-verification-code-0"
                >
                    {{ t('auth.login.verification.enterCode') }}
                </label>
                <div class="auth-register-verification-grid">
                    <input
                        v-for="(value, index) in codeInputs"
                        :id="`auth-register-verification-code-${index}`"
                        :key="`verification-code-${index}`"
                        :ref="el => { if (el) inputRefs[index] = el as HTMLInputElement }"
                        :class="[
                            'auth-register-verification-input',
                            { 'auth-register-verification-input--error': !!props.error },
                        ]"
                        type="text"
                        inputmode="numeric"
                        maxlength="1"
                        placeholder="0"
                        autocomplete="one-time-code"
                        :value="value"
                        :data-testid="`auth-register-verification-code-${index + 1}`"
                        @input="handleInput(index, $event)"
                        @keydown="handleKeyDown(index, $event)"
                        @paste="handlePaste"
                    />
                </div>
                <p v-if="props.error" class="auth-register-verification-error">
                    {{ props.error }}
                </p>
            </div>

            <div class="auth-register-verification-actions">
                <UiButton
                    variant="filled"
                    tone="neutral"
                    size="lg"
                    class="auth-register-verification-submit"
                    :disabled="props.verifying"
                    data-testid="auth-register-verification-submit-button"
                    @click="emit('verify')"
                >
                    {{ props.verifying ? 'Verifying...' : 'Verify Email Address' }}
                </UiButton>

                <p class="auth-register-verification-resend">
                    {{ t('auth.login.verification.resendPrefix') }}<button
                        type="button"
                        class="auth-register-verification-resend-btn"
                    >
                        {{ t('auth.login.verification.resendCta') }}</button
                    >{{ t('auth.login.verification.resendSuffix') }}
                </p>
            </div>
        </div>
    </UiModal>
</template>

<style scoped lang="scss">
.auth-register-verification-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 32px;

    .auth-register-verification-close {
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

    .auth-register-verification-head {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: 14px;
    }

    .auth-register-verification-icon {
        width: 52px;
        height: 52px;
        object-fit: contain;
        display: block;
    }

    .auth-register-verification-copy {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .auth-register-verification-title {
            margin: 0;
            color: var(--text-primary);
            font-size: 24px;
            font-weight: 600;
            line-height: 36px;
            letter-spacing: -0.02em;
        }

        .auth-register-verification-text {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 24px;
        }

        .auth-register-verification-email {
            color: #c3a700;
            font-weight: 700;
        }
    }

    .auth-register-verification-label {
        margin: 0;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 600;
        line-height: 24px;
    }

    .auth-register-verification-code-group {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .auth-register-verification-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
    }

    .auth-register-verification-input {
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

    .auth-register-verification-input--error {
        border-color: var(--error);

        &:focus {
            border-color: var(--error);
        }
    }

    .auth-register-verification-error {
        margin: 0;
        color: var(--error);
        font-size: 14px;
        line-height: 24px;
    }

    .auth-register-verification-submit {
        width: 100%;
        border-radius: 16px;
        font-size: 16px;
        line-height: 26px;
        box-shadow: none;
    }

    .auth-register-verification-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .auth-register-verification-resend {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.2;
    }

    .auth-register-verification-resend-btn {
        border: 0;
        background: transparent;
        color: var(--text-primary);
        text-decoration: underline;
        font-size: inherit;
        font-weight: 700;
        padding: 0;
    }
}

@media (max-width: 900px) {
    .auth-register-verification-modal {
        gap: 12px;

        .auth-register-verification-copy {
            .auth-register-verification-title {
                font-size: 32px;
            }
        }

        .auth-register-verification-label {
            font-size: 16px;
        }

        .auth-register-verification-input {
            height: 56px;
            font-size: 24px;
        }

        .auth-register-verification-submit {
            font-size: 18px;
        }

        .auth-register-verification-resend {
            font-size: 16px;
        }
    }
}
</style>
