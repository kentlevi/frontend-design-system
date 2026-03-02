<script setup lang="ts">
import AuthLoginForgotPasswordModal from '@/components/auth/login/AuthLoginForgotPasswordModal.vue';
import AuthLoginHeader from '@/components/auth/login/AuthLoginHeader.vue';
import AuthLoginMemberForm from '@/components/auth/login/AuthLoginMemberForm.vue';
import AuthLoginModeSwitch from '@/components/auth/login/AuthLoginModeSwitch.vue';
import AuthLoginNonMemberForm from '@/components/auth/login/AuthLoginNonMemberForm.vue';
import AuthLoginSocialButtons from '@/components/auth/login/AuthLoginSocialButtons.vue';
import AuthLoginVerificationModal from '@/components/auth/login/AuthLoginVerificationModal.vue';
import { useLoginPageForm } from '@/composables/auth/useLoginPageForm';

const { t } = useI18n();

const {
    memberType,
    keepSignedIn,
    showPassword,
    isNonMember,
    setMemberType,
    togglePassword,
    setKeepSignedIn,
    submitLabel,
    isVerificationModalOpen,
    guestVerificationEmail,
    guestVerificationOrderNumber,
    guestVerificationToken,
    guestVerificationCode,
    guestVerificationError,
    isGuestVerifying,
    isForgotPasswordModalOpen,
    memberEmail,
    memberPassword,
    nonMemberEmail,
    nonMemberOrderNumber,
    memberEmailError,
    memberPasswordError,
    nonMemberEmailError,
    nonMemberOrderError,
    onMemberEmailInput,
    onMemberPasswordInput,
    onNonMemberEmailInput,
    onNonMemberOrderInput,
    onSubmitClick,
    submitGuestVerification,
    resendGuestVerification,
    openForgotPasswordModal,
} = useLoginPageForm();
</script>

<template>
    <section class="auth-login" data-testid="auth-login-page">
        <div class="auth-login-top">
            <div
                class="auth-login-illustration auth-login-illustration-left auth-illustration-enter auth-illustration-enter-left"
            >
                <img
                    src="/illustrations/products/sticker-kids/kid-laptop-sticker.svg"
                    :alt="t('auth.login.title')"
                    loading="lazy"
                    class="auth-login-illustration-image"
                >
            </div>

            <div class="auth-login-shell auth-shell-enter">
                <div class="auth-login-card">
                    <div class="auth-login-intro">
                        <AuthLoginHeader />

                        <AuthLoginModeSwitch
                            :member-type="memberType"
                            @update:member-type="setMemberType"
                        />
                    </div>

                    <AuthLoginMemberForm
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

                    <AuthLoginNonMemberForm
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
                        :data-testid="
                            isNonMember
                                ? 'auth-login-submit-non-member-button'
                                : 'auth-login-submit-member-button'
                        "
                        @click="onSubmitClick"
                    >
                        {{ submitLabel }}
                    </UiButton>

                    <AuthLoginSocialButtons v-if="!isNonMember" />
                </div>
            </div>

            <div
                class="auth-login-illustration auth-login-illustration-right auth-illustration-enter auth-illustration-enter-right"
            >
                <img
                    src="/illustrations/products/sticker-kids/kid-making-stickers.svg"
                    :alt="t('auth.login.title')"
                    loading="lazy"
                    class="auth-login-illustration-image"
                >
            </div>
        </div>

        <AuthLoginForgotPasswordModal
            v-model="isForgotPasswordModalOpen"
            :email="memberEmail"
            data-testid="auth-login-forgot-password-modal"
        />
        <AuthLoginVerificationModal
            v-model="isVerificationModalOpen"
            :email="guestVerificationEmail"
            :order-number="guestVerificationOrderNumber"
            :token="guestVerificationToken"
            :code="guestVerificationCode"
            :error="guestVerificationError"
            :verifying="isGuestVerifying"
            data-testid="auth-login-verification-modal"
            @update:code="guestVerificationCode = $event"
            @verify="submitGuestVerification"
            @resend="resendGuestVerification"
        />
    </section>
</template>

<style lang="scss">
.auth-login {
    --auth-illustration-enter-delay: 0.5s;
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

        .auth-login-illustration {
            width: 100%;
            height: 320px;
            display: flex;
            align-items: flex-end;
            justify-content: center;

            .auth-login-illustration-image {
                width: auto;
                height: 100%;
                max-width: 260px;
                object-fit: contain;
                display: block;
            }
        }

        .auth-login-illustration-left {
            justify-self: end;
        }

        .auth-login-shell {
            min-height: 740px;
            width: 100%;
            display: flex;
            align-items: flex-start;
            justify-content: center;

            .auth-login-card {
                background: var(--contrast-light);
                border: 1px solid var(--border-default);
                border-radius: 22px;
                box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
                padding: 42px 54px 40px;
                width: 100%;
                max-width: 588px;
                justify-self: center;
                display: flex;
                flex-direction: column;
                gap: 24px;

                .auth-login-intro {
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                }

                .auth-login-submit {
                    width: 100%;
                    border-radius: 16px;
                    box-shadow: none;
                    font-size: 16px;
                    line-height: 28px;
                }
            }
        }
    }
}

@media (max-width: 1100px) {
    .auth-login {
        .auth-login-top {
            grid-template-columns: 1fr;
            padding-bottom: 64px;

            .auth-login-illustration {
                display: none;
            }
        }
    }
}
</style>
