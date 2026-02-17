<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LoginHeader from '@/components/auth/login/LoginHeader.vue';
import LoginForgotPasswordModal from '@/components/auth/login/LoginForgotPasswordModal.vue';
import LoginMemberForm from '@/components/auth/login/LoginMemberForm.vue';
import LoginModeSwitch from '@/components/auth/login/LoginModeSwitch.vue';
import LoginNonMemberForm from '@/components/auth/login/LoginNonMemberForm.vue';
import LoginSocialButtons from '@/components/auth/login/LoginSocialButtons.vue';
import LoginVerificationModal from '@/components/auth/login/LoginVerificationModal.vue';
import { useLoginForm } from '@/composables/auth/useLoginForm';

const { t } = useI18n();

definePageMeta({
    layout: 'home',
});

const {
    memberType,
    keepSignedIn,
    showPassword,
    isNonMember,
    setMemberType,
    togglePassword,
    setKeepSignedIn,
} = useLoginForm();

const submitLabel = computed(() =>
    isNonMember.value ? t('auth.login.checkOrder') : t('auth.login.signIn')
);

const isVerificationModalOpen = ref(false);
const isForgotPasswordModalOpen = ref(false);
const memberEmail = ref('');
const memberPassword = ref('');
const nonMemberEmail = ref('');
const nonMemberOrderNumber = ref('');
const memberEmailError = ref('');
const memberPasswordError = ref('');
const nonMemberEmailError = ref('');
const nonMemberOrderError = ref('');

const demoMemberEmail = 'joy_love1990@gmail.com';
const demoMemberPassword = 'joylove1990';
const demoOrderNumber = '2502160001';

watch(memberType, () => {
    memberEmailError.value = '';
    memberPasswordError.value = '';
    nonMemberEmailError.value = '';
    nonMemberOrderError.value = '';
});

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateMember() {
    memberEmailError.value = '';
    memberPasswordError.value = '';

    if (!memberEmail.value.trim()) {
        memberEmailError.value = t('auth.login.validation.fieldBlank');
    } else if (!isValidEmail(memberEmail.value.trim())) {
        memberEmailError.value = t('auth.login.validation.emailInvalid');
    }

    if (!memberPassword.value.trim()) {
        memberPasswordError.value = t('auth.login.validation.fieldBlank');
    }

    if (memberEmailError.value || memberPasswordError.value) {
        return false;
    }

    if (
        memberEmail.value.trim().toLowerCase() !== demoMemberEmail ||
        memberPassword.value !== demoMemberPassword
    ) {
        memberEmailError.value = t('auth.login.validation.credentialsMismatch');
        memberPasswordError.value = t(
            'auth.login.validation.credentialsMismatch'
        );
        return false;
    }

    return true;
}

function validateNonMember() {
    nonMemberEmailError.value = '';
    nonMemberOrderError.value = '';

    if (!nonMemberEmail.value.trim()) {
        nonMemberEmailError.value = t('auth.login.validation.fieldBlank');
    } else if (!isValidEmail(nonMemberEmail.value.trim())) {
        nonMemberEmailError.value = t('auth.login.validation.emailInvalid');
    }

    if (!nonMemberOrderNumber.value.trim()) {
        nonMemberOrderError.value = t('auth.login.validation.fieldBlank');
    }

    if (nonMemberEmailError.value || nonMemberOrderError.value) {
        return false;
    }

    if (nonMemberOrderNumber.value.trim() !== demoOrderNumber) {
        nonMemberOrderError.value = t('auth.login.validation.orderNotFound');
        return false;
    }

    return true;
}

function onMemberEmailInput(value: string) {
    memberEmail.value = value;
    memberEmailError.value = '';
}

function onMemberPasswordInput(value: string) {
    memberPassword.value = value;
    memberPasswordError.value = '';
}

function onNonMemberEmailInput(value: string) {
    nonMemberEmail.value = value;
    nonMemberEmailError.value = '';
}

function onNonMemberOrderInput(value: string) {
    nonMemberOrderNumber.value = value;
    nonMemberOrderError.value = '';
}

function onSubmitClick() {
    if (!isNonMember.value) {
        validateMember();
        return;
    }

    if (!validateNonMember()) return;
    isVerificationModalOpen.value = true;
}

function openForgotPasswordModal() {
    isForgotPasswordModalOpen.value = true;
}
</script>

<template>
    <section class="auth-login">
        <div class="auth-login-top">
            <div class="auth-login-illustration auth-login-illustration-left">
                <UiLogo
                    name="musticker"
                    variant="mark"
                    color="colored"
                    :size="86"
                />
            </div>

            <div class="auth-login-shell">
                <div class="auth-login-card">
                    <LoginHeader />

                    <LoginModeSwitch
                        :member-type="memberType"
                        @update:member-type="setMemberType"
                    />

                    <LoginMemberForm
                        v-if="!isNonMember"
                        :show-password="showPassword"
                        :keep-signed-in="keepSignedIn"
                        :email="memberEmail"
                        :password="memberPassword"
                        :email-error="memberEmailError"
                        :password-error="memberPasswordError"
                        @toggle-password="togglePassword"
                        @update:keep-signed-in="setKeepSignedIn"
                        @update:email="onMemberEmailInput"
                        @update:password="onMemberPasswordInput"
                        @open-forgot-password="openForgotPasswordModal"
                    />

                    <LoginNonMemberForm
                        v-else
                        :email="nonMemberEmail"
                        :order-number="nonMemberOrderNumber"
                        :email-error="nonMemberEmailError"
                        :order-error="nonMemberOrderError"
                        @update:email="onNonMemberEmailInput"
                        @update:order-number="onNonMemberOrderInput"
                    />

                    <UiButton
                        variant="filled"
                        tone="neutral"
                        size="lg"
                        class="auth-login-submit"
                        @click="onSubmitClick"
                    >
                        {{ submitLabel }}
                    </UiButton>

                    <LoginSocialButtons v-if="!isNonMember" />
                </div>
            </div>

            <div class="auth-login-illustration auth-login-illustration-right">
                <UiLogo
                    name="musticker"
                    variant="mark"
                    color="colored"
                    :size="86"
                />
            </div>
        </div>

        <LoginForgotPasswordModal
            v-model="isForgotPasswordModalOpen"
            :email="memberEmail"
        />
        <LoginVerificationModal v-model="isVerificationModalOpen" />
    </section>
</template>

<style lang="scss">
.auth-login {
    min-height: calc(100vh - 176px);
    position: relative;
    background: var(--bg-page);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 540px;
        background: var(--brand-primary);
        z-index: 0;
    }

    .auth-login-top {
        min-height: 560px;
        background: transparent;
        padding: 42px 24px 100px;
        display: grid;
        grid-template-columns:
            minmax(150px, 240px) min(760px, calc(100vw - 180px))
            minmax(150px, 240px);
        align-items: start;
        justify-content: center;
        gap: 34px;
        position: relative;
        z-index: 1;
    }

    .auth-login-illustration {
        width: 190px;
        height: 260px;
        border-radius: 24px;
        border: 2px solid var(--text-primary);
        background: var(--contrast-light);
        display: grid;
        place-items: center;
    }

    .auth-login-illustration-left {
        justify-self: end;
    }

    .auth-login-shell {
        min-height: 740px;
        width: 100%;
        display: flex;
        align-items: flex-start;
    }

    .auth-login-card {
        background: var(--contrast-light);
        border: 1px solid var(--border-default);
        border-radius: 22px;
        box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
        padding: 42px 54px 40px;
        width: 100%;
        max-width: 760px;
        justify-self: center;
    }

    .auth-login-title {
        margin: 0;
        text-align: center;
        color: var(--text-primary);
        font-size: 52px;
        line-height: 1.1;
    }

    .auth-login-subtitle {
        margin: 12px 0 28px;
        text-align: center;
        color: var(--text-muted);
        font-size: 14px;

        a {
            color: var(--text-primary);
            font-weight: 600;
        }
    }

    .auth-login-segment {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border: 1px solid var(--brand-primary);
        border-radius: 999px;
        overflow: hidden;
        margin-bottom: 20px;

        button {
            height: 50px;
            border: 0;
            background: transparent;
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
            cursor: pointer;
        }

        button.active {
            background: var(--brand-primary);
        }
    }

    .auth-login-label {
        display: block;
        margin: 14px 0 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
    }

    .auth-login-label-row {
        margin-top: 14px;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;

        .auth-login-label {
            margin: 0;
        }
    }

    .auth-login-error {
        margin: 0;
        font-size: 14px;
        line-height: 1.2;
        color: var(--error);
    }

    .auth-login-input {
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

    .auth-login-password-wrap {
        position: relative;
    }

    .auth-login-password-toggle {
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

    .auth-login-inline {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;

        a,
        .auth-login-link-button {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 600;
        }
    }

    .auth-login-link-button {
        border: 0;
        background: transparent;
        padding: 0;
        cursor: pointer;
        font: inherit;
    }

    .auth-login-checkbox {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);
    }

    .auth-login-submit {
        width: 100%;
        margin-top: 18px;
        border-radius: 16px;
        box-shadow: none;
        font-size: 18px;
    }

    .auth-login-divider {
        margin: 20px 0 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-muted);
        font-size: 13px;

        &::before,
        &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border-default);
        }
    }

    .auth-login-social {
        width: 100%;
        height: 44px;
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: var(--text-primary);
        font-size: 14px;

        & + .auth-login-social {
            margin-top: 10px;
        }
    }

    @media (max-width: 1100px) {
        .auth-login-top {
            grid-template-columns: 1fr;
            padding-bottom: 64px;
        }

        .auth-login-illustration {
            display: none;
        }

        .auth-login-error {
            font-size: 13px;
        }
    }
}
</style>
