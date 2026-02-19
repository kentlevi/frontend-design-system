<script setup lang="ts">
const { t } = useI18n();

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        email?: string;
    }>(),
    {
        email: 'joy_love1990@gmail.com',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const codeInputs = ['0', '0', '0', '0'];

function closeModal() {
    emit('update:modelValue', false);
}
</script>

<template>
    <UiModal
        :model-value="modelValue"
        width="760px"
        data-testid="auth-login-verification-modal"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #header>
            <span class="auth-verify-hidden-title">
                {{ t('auth.login.verification.title') }}
            </span>
        </template>

        <div class="auth-verify-modal">
            <div class="auth-verify-head">
                <UiIcon
                    name="strong-shield"
                    :size="46"
                    color="var(--brand-primary)"
                    class="auth-verify-icon"
                />

                <div class="auth-verify-copy">
                    <h3 class="auth-verify-title">
                        {{ t('auth.login.verification.title') }}
                    </h3>
                    <p class="auth-verify-text">
                        {{ t('auth.login.verification.messagePrefix') }}
                        <strong class="auth-verify-email">{{ props.email }}</strong
                        >{{ t('auth.login.verification.messageSuffix') }}
                    </p>
                </div>
            </div>

            <p class="auth-verify-label">
                {{ t('auth.login.verification.enterCode') }}
            </p>

            <div class="auth-verify-grid">
                <div
                    v-for="(value, index) in codeInputs"
                    :key="`verification-code-${index}`"
                    class="auth-verify-box"
                    :data-testid="`auth-login-verification-code-${index + 1}`"
                >
                    {{ value }}
                </div>
            </div>

            <UiButton
                variant="filled"
                tone="neutral"
                size="lg"
                class="auth-verify-submit"
                data-testid="auth-login-verification-submit"
                @click="closeModal"
            >
                {{ t('auth.login.verification.verify') }}
            </UiButton>

            <p class="auth-verify-resend">
                {{ t('auth.login.verification.resendPrefix') }}
                <UiButton
                    variant="ghost"
                    tone="default"
                    size="sm"
                    class="auth-verify-resend-btn"
                    data-testid="auth-login-verification-resend"
                >
                    {{ t('auth.login.verification.resendCta') }}
                </UiButton>
                {{ t('auth.login.verification.resendSuffix') }}
            </p>
        </div>
    </UiModal>
</template>

<style scoped lang="scss">
.auth-verify-hidden-title {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
}

.auth-verify-modal {
    padding: 4px 22px 14px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    .auth-verify-head {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: 14px;

        .auth-verify-icon {
            margin-top: 0;
        }

        .auth-verify-copy {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .auth-verify-title {
                margin: 0;
                color: var(--text-primary);
                font-size: 50px;
                font-weight: 700;
                line-height: 1.06;
                letter-spacing: -0.02em;
            }

            .auth-verify-text {
                margin: 0;
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.9;

                .auth-verify-email {
                    color: #c3a700;
                    font-weight: 700;
                }
            }
        }
    }

    .auth-verify-label {
        margin: 0;
        color: var(--text-primary);
        font-size: 34px;
        font-weight: 600;
        line-height: 1.1;
    }

    .auth-verify-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;

        .auth-verify-box {
            height: 82px;
            border: 1px solid var(--border-default);
            border-radius: 12px;
            background: var(--contrast-light);
            color: #a6a6a6;
            font-size: 46px;
            font-weight: 700;
            line-height: 1;
            display: grid;
            place-items: center;
        }
    }

    .auth-verify-submit {
        width: 100%;
        margin-top: 0;
        border-radius: 22px;
        font-size: 38px;
        box-shadow: none;
    }

    .auth-verify-resend {
        margin: 0;
        color: var(--text-secondary);
        font-size: 30px;
        line-height: 1.2;

        .auth-verify-resend-btn {
            padding: 0;
            color: var(--text-primary);
            text-decoration: underline;
            font-weight: 700;
            min-height: auto;
            height: auto;
            box-shadow: none;
        }
    }
}

@media (max-width: 900px) {
    .auth-verify-modal {
        padding: 0 4px 8px;
        gap: 12px;

        .auth-verify-head {
            .auth-verify-copy {
                .auth-verify-title {
                    font-size: 32px;
                }
            }
        }

        .auth-verify-label {
            margin-top: 0;
            font-size: 20px;
        }

        .auth-verify-grid {
            gap: 10px;

            .auth-verify-box {
                height: 56px;
                font-size: 32px;
            }
        }

        .auth-verify-submit {
            font-size: 20px;
        }

        .auth-verify-resend {
            font-size: 16px;
        }
    }
}
</style>
