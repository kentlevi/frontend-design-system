<script setup lang="ts">
import UiTooltip from '@/components/ui/Tooltip.vue';
import { useRegisterForm } from '@/composables/auth/useRegisterForm';

const localePath = useLocalePath();
const { t } = useI18n();
const termsErrorPopoverPinned = ref(false);
const termsErrorPopoverHovered = ref(false);
const termsErrorHoverCloseTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const termsErrorPopoverOpen = computed(
    () => termsErrorPopoverPinned.value || termsErrorPopoverHovered.value
);
const termsErrorIconStrong = computed(() => termsErrorPopoverOpen.value);
const termsErrorRef = ref<HTMLElement | null>(null);

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

watch(
    () => Boolean(termsError.value && !agreeTerms.value),
    (hasTermsError) => {
        if (!hasTermsError) {
            clearTermsErrorHoverCloseTimer();
            termsErrorPopoverPinned.value = false;
            termsErrorPopoverHovered.value = false;
        }
    }
);

function clearTermsErrorHoverCloseTimer() {
    if (!termsErrorHoverCloseTimer.value) return;
    clearTimeout(termsErrorHoverCloseTimer.value);
    termsErrorHoverCloseTimer.value = null;
}

function toggleTermsErrorPopover() {
    termsErrorPopoverPinned.value = !termsErrorPopoverPinned.value;
}

function onTermsErrorHoverStart() {
    clearTermsErrorHoverCloseTimer();
    termsErrorPopoverHovered.value = true;
}

function onTermsErrorHoverEnd() {
    clearTermsErrorHoverCloseTimer();
    termsErrorHoverCloseTimer.value = setTimeout(() => {
        termsErrorPopoverHovered.value = false;
        termsErrorHoverCloseTimer.value = null;
    }, 90);
}

function onDocumentClick(event: MouseEvent) {
    const target = event.target as Node | null;
    if (!target) return;
    if (!termsErrorRef.value?.contains(target)) {
        clearTermsErrorHoverCloseTimer();
        termsErrorPopoverPinned.value = false;
        termsErrorPopoverHovered.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
    clearTermsErrorHoverCloseTimer();
    document.removeEventListener('click', onDocumentClick);
});
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
                    size="md"
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
                    size="md"
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
                size="md"
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
                    size="md"
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

        <div class="auth-register-check-row">
            <UiCheckbox
                v-model="agreeTerms"
                class="auth-register-check"
                :state="termsError && !agreeTerms ? 'error' : 'default'"
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
            <div
                v-if="termsError && !agreeTerms"
                ref="termsErrorRef"
                class="auth-register-terms-error"
                data-testid="auth-register-terms-error"
                @mouseenter="onTermsErrorHoverStart"
                @mouseleave="onTermsErrorHoverEnd"
            >
                <UiTooltip
                    :open="termsErrorPopoverOpen"
                    side="right"
                    mobile-side="left"
                    tone="danger"
                    :offset="10"
                    :slide-distance="36"
                    content-testid="auth-register-terms-error-popover"
                    class="auth-register-terms-error-tooltip"
                >
                    <template #trigger>
                        <button
                            type="button"
                            class="auth-register-terms-error-button"
                            :aria-expanded="termsErrorPopoverOpen"
                            aria-haspopup="dialog"
                            data-testid="auth-register-terms-error-button"
                            @click="toggleTermsErrorPopover"
                            @focus="onTermsErrorHoverStart"
                        >
                            <span class="auth-register-terms-error-icon-stack" aria-hidden="true">
                                <UiIcon
                                    name="regular-info-circle"
                                    :size="24"
                                    color="var(--error)"
                                    class="auth-register-terms-error-icon auth-register-terms-error-icon-regular"
                                    :class="{ 'is-hidden': termsErrorIconStrong }"
                                />
                                <UiIcon
                                    name="strong-info-circle"
                                    :size="24"
                                    color="var(--error)"
                                    class="auth-register-terms-error-icon auth-register-terms-error-icon-strong"
                                    :class="{ 'is-visible': termsErrorIconStrong }"
                                />
                            </span>
                        </button>
                    </template>

                    <UiIcon
                        name="strong-exclamation-triangle"
                        :size="24"
                        color="var(--contrast-light)"
                        class="auth-register-terms-error-popover-icon"
                    />
                    <span>{{ termsError }}</span>
                </UiTooltip>
            </div>
        </div>

        <UiCheckbox v-model="optInPromos" class="auth-register-check" data-testid="auth-register-opt-in-promos">
            <span class="auth-register-check-text">{{ t('auth.register.promoOptIn') }}</span>
        </UiCheckbox>

        <UiButton
            variant="filled"
            tone="neutral"
            size="md"
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
    padding: 40px;
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
        gap: 24px;

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
            line-height: 24px;
            color: var(--text-primary);

            .auth-register-optional {
                color: var(--text-muted);
                font-weight: 400;
            }
        }

        .auth-register-label-error {
            color: var(--error);
            font-size: 14px;
            font-weight: 600;
            line-height: 24px;
        }

        .auth-register-input {
            width: 100%;
        }

        .auth-register-password-wrap {
            position: relative;

            .auth-register-password-toggle {
                border: 0;
                background: transparent;
                display: grid;
                place-items: center;
            }
        }

        .auth-register-hint {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
        }
    }

    .auth-register-check {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;

        .auth-register-check-link {
            color: var(--text-primary);
            font-weight: 700;
        }
    }

    .auth-register-check-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;

        .auth-register-check {
            flex: 1;
        }
    }

    .auth-register-terms-error {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--error);
        font-size: 14px;
        line-height: 24px;
        text-align: right;
        max-width: 220px;
        position: relative;

        .auth-register-terms-error-icon {
            flex-shrink: 0;
            transition: opacity 0.2s ease;
            transform-origin: center;
            color: var(--error);
        }

        .auth-register-terms-error-icon-stack {
            position: relative;
            width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            .auth-register-terms-error-icon {
                position: absolute;
                inset: 0;
                margin: auto;
            }
        }

        .auth-register-terms-error-icon-regular {
            opacity: 1;

            &.is-hidden {
                opacity: 0;
            }
        }

        .auth-register-terms-error-icon-strong {
            opacity: 0;

            &.is-visible {
                opacity: 1;
            }
        }

        .auth-register-terms-error-button {
            border: 0;
            background: transparent;
            padding: 0;
            margin: 0;
            color: var(--error);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--error);
        }

        .auth-register-terms-error-popover-icon {
            flex-shrink: 0;
        }

        .auth-register-terms-error-tooltip {
            :deep(.ui-tooltip-content) {
                font-size: 14px;
                line-height: 24px;
            }
        }
    }

    .auth-register-submit {
        margin-top: 8px;
        width: 100%;
        border-radius: 16px;
        box-shadow: none;
        font-size: 16px;
        line-height: 28px;
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

        .auth-register-check-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
        }

        .auth-register-terms-error {
            justify-content: flex-start;
            text-align: left;
            max-width: none;

            .auth-register-terms-error-tooltip {
                :deep(.ui-tooltip-content) {
                    min-width: 220px;
                }
            }
        }

    }
}

@media (prefers-reduced-motion: reduce) {
    .auth-register-card {
        .auth-register-terms-error {
            .auth-register-terms-error-icon {
                transition: none;
            }
        }
    }
}
</style>
