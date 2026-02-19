<script setup lang="ts">
import { useRegisterForm } from '@/composables/auth/useRegisterForm';

const localePath = useLocalePath();
const { t } = useI18n();

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
    submitRegister,
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
                <label class="auth-register-label">
                    {{ t('auth.register.firstName') }}
                </label>
                <UiInput
                    v-model="firstName"
                    type="text"
                    size="lg"
                    class="auth-register-input"
                    :state="firstNameError ? 'error' : 'default'"
                    :placeholder="t('auth.register.enterFirstName')"
                    data-testid="auth-register-first-name-input"
                />
                <p v-if="firstNameError" class="auth-register-error">
                    {{ firstNameError }}
                </p>
            </div>

            <div class="auth-register-field">
                <label class="auth-register-label">
                    {{ t('auth.register.lastName') }}
                    <span class="auth-register-optional">
                        ({{ t('auth.register.optional') }})
                    </span>
                </label>
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
            <label class="auth-register-label">
                {{ t('auth.register.email') }}
            </label>
            <UiInput
                v-model="email"
                type="email"
                size="lg"
                class="auth-register-input"
                :state="emailError ? 'error' : 'default'"
                :placeholder="t('auth.register.enterEmail')"
                data-testid="auth-register-email-input"
            />
            <p v-if="emailError" class="auth-register-error">
                {{ emailError }}
            </p>
        </div>

        <div class="auth-register-field">
            <label class="auth-register-label">
                {{ t('auth.register.password') }}
            </label>
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
                                :name="showPassword ? 'regular-eye' : 'regular-eye-slash'"
                                :size="18"
                                color="var(--text-muted)"
                            />
                        </button>
                    </template>
                </UiInput>
            </div>
            <p v-if="passwordError" class="auth-register-error">
                {{ passwordError }}
            </p>
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
        <p v-if="termsError" class="auth-register-error">
            {{ termsError }}
        </p>

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

        .auth-register-label {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);

            .auth-register-optional {
                color: var(--text-muted);
                font-weight: 400;
            }
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

        .auth-register-error {
            margin: 0;
            color: var(--error);
            font-size: 13px;
            line-height: 1.2;
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

    .auth-register-error {
        margin: 0;
        color: var(--error);
        font-size: 13px;
        line-height: 1.2;
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
