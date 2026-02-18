<script setup lang="ts">
import { ref } from 'vue';

const localePath = useLocalePath();
const { t } = useI18n();

definePageMeta({
    layout: 'home',
});

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const agreeTerms = ref(false);
const optInPromos = ref(false);

const firstNameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const termsError = ref('');

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clearErrors() {
    firstNameError.value = '';
    emailError.value = '';
    passwordError.value = '';
    termsError.value = '';
}

async function submitRegister() {
    clearErrors();

    if (!firstName.value.trim()) {
        firstNameError.value = t('auth.login.validation.fieldBlank');
    }

    if (!email.value.trim()) {
        emailError.value = t('auth.login.validation.fieldBlank');
    } else if (!isValidEmail(email.value.trim())) {
        emailError.value = t('auth.login.validation.emailInvalid');
    }

    if (!password.value.trim()) {
        passwordError.value = t('auth.login.validation.fieldBlank');
    }

    if (!agreeTerms.value) {
        termsError.value = t('auth.register.validation.mustAgree');
    }

    if (
        firstNameError.value ||
        emailError.value ||
        passwordError.value ||
        termsError.value
    ) {
        return;
    }

    const params = new URLSearchParams({
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        onboarding: '1',
    });
    await navigateTo(`${localePath('/auth/profile')}?${params.toString()}`);
}
</script>

<template>
    <section class="auth-register">
        <div class="auth-register-top">
            <div
                class="auth-register-illustration auth-register-illustration-left auth-illustration-enter auth-illustration-enter-left">
                <img
                    class="auth-register-kid-falling"
                    src="/illustrations/products/sticker-kids/kid-falling-sticker.svg"
                    :alt="t('auth.register.title')"
                    loading="lazy"
                />
            </div>

            <div class="auth-register-shell auth-shell-enter">
                <div class="auth-register-card">
                    <div class="auth-register-head">
                        <UiLogo name="musticker" variant="mark" color="colored" :size="40"
                            class="auth-register-head-logo" />
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
                            <input v-model="firstName" type="text" class="auth-register-input" :class="{
                                'has-error': Boolean(firstNameError),
                            }" :placeholder="t('auth.register.enterFirstName')" />
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
                            <input v-model="lastName" type="text" class="auth-register-input"
                                :placeholder="t('auth.register.enterLastName')" />
                        </div>
                    </div>

                    <div class="auth-register-field">
                        <label class="auth-register-label">
                            {{ t('auth.register.email') }}
                        </label>
                        <input v-model="email" type="email" class="auth-register-input"
                            :class="{ 'has-error': Boolean(emailError) }"
                            :placeholder="t('auth.register.enterEmail')" />
                        <p v-if="emailError" class="auth-register-error">
                            {{ emailError }}
                        </p>
                    </div>

                    <div class="auth-register-field">
                        <label class="auth-register-label">
                            {{ t('auth.register.password') }}
                        </label>
                        <div class="auth-register-password-wrap">
                            <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                class="auth-register-input" :class="{ 'has-error': Boolean(passwordError) }"
                                :placeholder="t('auth.register.enterPassword')" />
                            <button type="button" class="auth-register-password-toggle"
                                :aria-label="t('auth.login.togglePassword')" @click="showPassword = !showPassword">
                                <UiIcon :name="showPassword
                                        ? 'regular-eye'
                                        : 'regular-eye-slash'
                                    " :size="18" color="var(--text-muted)" />
                            </button>
                        </div>
                        <p v-if="passwordError" class="auth-register-error">
                            {{ passwordError }}
                        </p>
                        <p class="auth-register-hint">
                            {{ t('auth.register.passwordHint') }}
                        </p>
                    </div>

                    <label class="auth-register-check">
                        <input v-model="agreeTerms" type="checkbox" />
                        <span>
                            {{ t('auth.register.agreePrefix') }}
                            <a href="#">{{ t('auth.register.terms') }}</a>
                            {{ t('auth.register.and') }}
                            <a href="#">{{ t('auth.register.privacy') }}</a>
                            .
                        </span>
                    </label>
                    <p v-if="termsError" class="auth-register-error">
                        {{ termsError }}
                    </p>

                    <label class="auth-register-check">
                        <input v-model="optInPromos" type="checkbox" />
                        <span>{{ t('auth.register.promoOptIn') }}</span>
                    </label>

                    <UiButton variant="filled" tone="neutral" size="lg" class="auth-register-submit"
                        @click="submitRegister">
                        {{ t('auth.register.createAccount') }}
                    </UiButton>

                    <p class="auth-register-login">
                        {{ t('auth.register.alreadyMember') }}
                        <NuxtLink :to="localePath('/auth/login')">
                            {{ t('auth.register.signInHere') }}
                        </NuxtLink>
                    </p>
                </div>
            </div>

            <div
                class="auth-register-illustration auth-register-illustration-right auth-illustration-enter auth-illustration-enter-right">
                <img
                    class="auth-register-kid-standing"
                    src="/illustrations/products/sticker-kids/kid-standing-sticker.svg"
                    :alt="t('auth.register.title')"
                    loading="lazy"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss">
.auth-register {
    min-height: calc(100vh - 176px);
    position: relative;
    background: var(--bg-page);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 380px;
        background: var(--brand-primary);
        z-index: 0;
    }

    .auth-register-top {
        min-height: 560px;
        background: transparent;
        padding: 42px 24px 100px;
        display: grid;
        grid-template-columns:
            minmax(150px, 240px) min(760px, calc(100vw - 180px)) minmax(150px, 240px);
        align-items: start;
        justify-content: center;
        gap: 34px;
        position: relative;
        z-index: 1;
    }

    .auth-register-illustration {
        width: 100%;
        height: 400px;
        display: flex;
        align-items: flex-start;
        justify-content: center;

        img {
            width: auto;
            height: 100%;
            max-width: 260px;
            object-fit: contain;
            display: block;
        }
    }

    .auth-register-kid-falling {
        height: 296px !important;
        width: auto;
    }

    .auth-register-kid-standing {
        height: 400px !important;
        width: auto;
    }

    .auth-register-illustration-left {
        justify-self: end;
    }

    .auth-register-shell {
        width: 100%;
        display: flex;
        justify-content: center;
    }

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
    }

    .auth-register-head {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

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

    .auth-register-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
    }

    .auth-register-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .auth-register-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
    }

    .auth-register-optional {
        color: var(--text-muted);
        font-weight: 400;
    }

    .auth-register-input {
        width: 100%;
        height: 48px;
        border: 1px solid var(--border-default);
        border-radius: 10px;
        padding: 0 14px;
        background: var(--contrast-light);
        font-size: 14px;
        color: var(--text-primary);

        &.has-error {
            border-color: var(--error);
        }
    }

    .auth-register-password-wrap {
        position: relative;
    }

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

    .auth-register-hint {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.55;
    }

    .auth-register-check {
        display: inline-flex;
        align-items: flex-start;
        gap: 10px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.5;

        input {
            margin-top: 2px;
        }

        a {
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

        a {
            color: var(--text-primary);
            font-weight: 700;
            text-decoration: underline;
        }
    }

    @media (max-width: 1100px) {
        .auth-register-top {
            grid-template-columns: 1fr;
            padding-bottom: 64px;
        }

        .auth-register-illustration {
            display: none;
        }
    }

    @media (max-width: 760px) {
        .auth-register-card {
            padding: 26px 18px;
            gap: 14px;
        }

        .auth-register-title {
            font-size: 28px;
            line-height: 40px;
        }

        .auth-register-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>

