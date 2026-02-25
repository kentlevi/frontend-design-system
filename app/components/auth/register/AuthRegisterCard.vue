<script setup lang="ts">
import { useRegisterForm } from '@/composables/auth/useRegisterForm';

const localePath = useLocalePath();
const { t } = useI18n();

const termsErrorOpen = ref(false);

const {
    firstName,
    lastName,
    email,
    password,
    showPassword,
    agreeTerms,
    optInPromos,
    firstNameError,
    emailError,
    passwordError,
    termsError,
    verificationEmail,
    verificationCode,
    verificationError,
    isVerifying,
    isVerificationModalOpen,
    submitRegister,
    submitVerification,
} = useRegisterForm();
</script>

<template>
    <div class="auth-register-card" data-testid="auth-register-card">
        <div class="auth-register-head">
            <UiLogo
                name="musticker"
                variant="mark"
                color="colored"
                :size="40"
                class="auth-register-head-logo"
            />
            <h1 class="auth-register-title">
                {{ t('auth.register.title') }}
            </h1>
            <p class="auth-register-subtitle">
                {{ t('auth.register.subtitle') }}
            </p>
        </div>

        <div class="auth-register-grid">
            <div class="auth-register-field">
                <div class="auth-register-label-row">
                    <label class="auth-register-label">
                        {{ t('auth.register.firstName') }}
                    </label>
                    <span v-if="firstNameError" class="auth-register-label-error">
                        {{ firstNameError }}
                    </span>
                </div>
                <UiInput
                    v-model="firstName"
                    type="text"
                    size="lg"
                    class="auth-register-input"
                    :state="firstNameError ? 'error' : 'default'"
                    :placeholder="t('auth.register.enterFirstName')"
                    data-testid="auth-register-first-name-input"
                />
            </div>

            <div class="auth-register-field">
                <div class="auth-register-label-row">
                    <label class="auth-register-label">
                        {{ t('auth.register.lastName') }}
                        <span class="auth-register-optional">
                            ({{ t('auth.register.optional') }})
                        </span>
                    </label>
                </div>
                <UiInput
                    v-model="lastName"
                    type="text"
                    size="lg"
                    class="auth-register-input"
                    :placeholder="t('auth.register.enterLastName')"
                    data-testid="auth-register-last-name-input"
                />
            </div>
        </div>

        <div class="auth-register-field">
            <div class="auth-register-label-row">
                <label class="auth-register-label">
                    {{ t('auth.register.email') }}
                </label>
                <span v-if="emailError" class="auth-register-label-error">
                    {{ emailError }}
                </span>
            </div>
            <UiInput
                v-model="email"
                type="email"
                size="lg"
                class="auth-register-input"
                :state="emailError ? 'error' : 'default'"
                :placeholder="t('auth.register.enterEmail')"
                data-testid="auth-register-email-input"
            />
        </div>

        <div class="auth-register-field">
            <div class="auth-register-label-row">
                <label class="auth-register-label">
                    {{ t('auth.register.password') }}
                </label>
                <span v-if="passwordError" class="auth-register-label-error">
                    {{ passwordError }}
                </span>
            </div>
            <div class="auth-register-password-wrap">
                <UiInput
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    size="lg"
                    class="auth-register-input"
                    :state="passwordError ? 'error' : 'default'"
                    :placeholder="t('auth.register.enterPassword')"
                    data-testid="auth-register-password-input"
                >
                    <template #icon-right>
                        <button
                            type="button"
                            class="auth-register-password-toggle"
                            :aria-label="t('auth.login.togglePassword')"
                            data-testid="auth-register-password-toggle"
                            @click="showPassword = !showPassword"
                        >
                            <UiIcon
                                :name="showPassword ? 'regular-eye-slash' : 'regular-eye'"
                                :size="24"
                                color="var(--gray-90)"
                            />
                        </button>
                    </template>
                </UiInput>
            </div>
            <p class="auth-register-hint">
                {{ t('auth.register.passwordHint') }}
            </p>
        </div>

        <UiCheckbox
            v-model="agreeTerms"
            class="auth-register-check"
            :state="termsError ? 'error' : 'default'"
            data-testid="auth-register-agree-terms"
        >
            <span class="auth-register-check-text">
                {{ t('auth.register.agreePrefix') }}
                <a href="#" class="auth-register-check-link" data-testid="auth-register-terms-link">{{ t('auth.register.terms') }}</a>
                {{ t('auth.register.and') }}
                <a href="#" class="auth-register-check-link" data-testid="auth-register-privacy-link">{{ t('auth.register.privacy') }}</a>
                .
            </span>
        </UiCheckbox>
        <div v-if="termsError" class="auth-register-terms-error" data-testid="auth-register-terms-error">
            <button
                type="button"
                class="auth-register-terms-error-trigger"
                :aria-expanded="termsErrorOpen"
                aria-haspopup="dialog"
                data-testid="auth-register-terms-error-trigger"
                @click="termsErrorOpen = !termsErrorOpen"
                @blur="termsErrorOpen = false"
            >
                <UiIcon name="strong-info-circle" :size="16" />
            </button>
            <div
                class="auth-register-terms-error-toast"
                role="status"
                :class="{ 'is-visible': termsErrorOpen }"
                data-testid="auth-register-terms-error-toast"
            >
                <span class="auth-register-terms-error-toast-text">{{ termsError }}</span>
            </div>
        </div>

        <UiCheckbox v-model="optInPromos" class="auth-register-check" data-testid="auth-register-opt-in-promos">
            <span class="auth-register-check-text">{{ t('auth.register.promoOptIn') }}</span>
        </UiCheckbox>

        <UiButton
            variant="filled"
            tone="neutral"
            size="lg"
            class="auth-register-submit"
            data-testid="auth-register-submit"
            @click="submitRegister"
        >
            {{ t('auth.register.createAccount') }}
        </UiButton>

        <p class="auth-register-login">
            {{ t('auth.register.alreadyMember') }}
            <NuxtLink
                :to="localePath('/auth/login')"
                class="auth-register-login-link"
                data-testid="auth-register-login-link"
            >
                {{ t('auth.register.signInHere') }}
            </NuxtLink>
        </p>
        
        <AuthRegisterVerificationModal
            v-model="isVerificationModalOpen"
            :email="verificationEmail"
            :code="verificationCode"
            :error="verificationError"
            :verifying="isVerifying"
            data-testid="auth-register-verification-modal"
            @update:code="verificationCode = $event"
            @verify="submitVerification"
        />
    </div>
</template>

<style lang="scss">
.auth-register-card {
    width: 100%;
    max-width: 588px;
    border: 1px solid var(--border-default);
    background: var(--contrast-light);
    border-radius: 22px;
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
    padding: 42px 54px 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: relative;

    .auth-register-head {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .auth-register-head-logo {
            align-self: start;
        }

        .auth-register-title {
            margin: 0;
            font-size: 28px;
            line-height: 40px;
            color: var(--text-primary);
        }

        .auth-register-subtitle {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 24px;
        }
    }

    .auth-register-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;

        .auth-register-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
    }

    .auth-register-field {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .auth-register-label-row {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
        }

        .auth-register-label {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);

            .auth-register-optional {
                color: var(--text-muted);
                font-weight: 400;
            }
        }

        .auth-register-label-error {
            color: var(--error);
            font-size: 12px;
            font-weight: 600;
        }

        .auth-register-input {
            width: 100%;
        }

        .auth-register-password-wrap {
            position: relative;

            .auth-register-password-toggle {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                border: 0;
                background: transparent;
                width: 30px;
                height: 30px;
                display: grid;
                place-items: center;
            }
        }

        .auth-register-hint {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.55;
        }
    }

    .auth-register-check {
        display: inline-flex;
        align-items: flex-start;
        gap: 10px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.5;

        .auth-register-check-link {
            color: var(--text-primary);
            font-weight: 700;
        }
    }

    .auth-register-error,
    .auth-register-error-inline {
        margin: 0;
        color: var(--error);
        font-size: 13px;
        line-height: 1.2;
    }

    .auth-register-error-inline {
        align-self: flex-end;
        margin-top: -6px;
    }

    .auth-register-terms-error {
        align-self: flex-end;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: -6px;
        margin-right: 6px;

        .auth-register-terms-error-trigger {
            border: 0;
            background: transparent;
            color: #ef2e2e;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
        }

        .auth-register-terms-error-toast {
            position: absolute;
            right: 0;
            top: calc(100% + 8px);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 14px;
            border-radius: 18px;
            background: #ef2e2e;
            color: var(--contrast-light);
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 8px 18px rgba(239, 46, 46, 0.25);
            opacity: 0;
            pointer-events: none;
            transform: translateY(-4px);
            transition: opacity 0.15s ease, transform 0.15s ease;
            max-width: 140px;
            text-align: center;
            line-height: 1.35;

            &::before {
                content: '';
                position: absolute;
                right: 12px;
                top: -6px;
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid #ef2e2e;
            }

            .auth-register-terms-error-toast-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        }

        .auth-register-terms-error-trigger:focus-visible + .auth-register-terms-error-toast,
        &:hover .auth-register-terms-error-toast,
        .auth-register-terms-error-toast.is-visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }
    }

    .auth-register-submit {
        margin-top: 8px;
        width: 100%;
        border-radius: 16px;
        box-shadow: none;
        font-size: 18px;
    }

    .auth-register-login {
        margin: 0;
        text-align: center;
        color: var(--text-secondary);
        font-size: 14px;

        .auth-register-login-link {
            color: var(--text-primary);
            font-weight: 700;
            text-decoration: underline;
        }
    }

    @media (max-width: 760px) {
        padding: 26px 18px;
        gap: 14px;

        .auth-register-head {
            .auth-register-title {
                font-size: 28px;
                line-height: 40px;
            }
        }

        .auth-register-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
