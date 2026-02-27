<script setup lang="ts">
import AuthRegisterCard from '@/components/auth/register/AuthRegisterCard.vue';

const { t } = useI18n();
</script>

<template>
    <section class="auth-register" data-testid="auth-register-page">
        <div class="auth-register-top">
            <div
                class="auth-register-illustration auth-register-illustration-left auth-illustration-enter auth-illustration-enter-left"
            >
                <img
                    class="auth-register-kid-falling"
                    src="/illustrations/products/sticker-kids/kid-falling-sticker.svg"
                    :alt="t('auth.register.title')"
                    loading="lazy"
                >
            </div>

            <div class="auth-register-shell auth-shell-enter" data-testid="auth-register-shell">
                <AuthRegisterCard />
            </div>

            <div
                class="auth-register-illustration auth-register-illustration-right auth-illustration-enter auth-illustration-enter-right"
            >
                <img
                    class="auth-register-kid-standing"
                    src="/illustrations/products/sticker-kids/kid-standing-sticker.svg"
                    :alt="t('auth.register.title')"
                    loading="lazy"
                >
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

        .auth-register-illustration {
            width: 100%;
            height: 400px;
            display: flex;
            align-items: flex-start;
            justify-content: center;

            .auth-register-kid-falling,
            .auth-register-kid-standing {
                width: auto;
                max-width: 260px;
                object-fit: contain;
                display: block;
            }

            .auth-register-kid-falling {
                height: 296px !important;
            }

            .auth-register-kid-standing {
                height: 400px !important;
            }
        }

        .auth-register-illustration-left {
            justify-self: end;
        }

        .auth-register-shell {
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }
}

@media (max-width: 1100px) {
    .auth-register {
        .auth-register-top {
            grid-template-columns: 1fr;
            padding-bottom: 64px;

            .auth-register-illustration {
                display: none;
            }
        }
    }
}
</style>
