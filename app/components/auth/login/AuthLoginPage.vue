<script setup lang="ts">
import AuthLoginCard from '@/components/auth/login/AuthLoginCard.vue'
import LoginCard from '@/components/features/auth/login/LoginCard.vue'
import { useAuthLoginPage } from '@/composables/auth/login/useAuthLoginPage'

const { translate } = useAuthLoginPage()
</script>

<template>
	<section class="auth-login" data-testid="auth-login-page">
		<div class="auth-login-top">
			<div
				class="auth-login-illustration auth-login-illustration-left auth-illustration-enter auth-illustration-enter-left"
			>
				<img
					src="/illustrations/products/sticker-kids/kid-laptop-sticker.svg"
					:alt="translate('auth.login.title')"
					loading="lazy"
					class="auth-login-illustration-image"
				>
			</div>

			<div class="auth-login-shell auth-shell-enter">
				<AuthLoginCard />
                <!-- <LoginCard /> -->
			</div>

			<div
				class="auth-login-illustration auth-login-illustration-right auth-illustration-enter auth-illustration-enter-right"
			>
				<img
					src="/illustrations/products/sticker-kids/kid-making-stickers.svg"
					:alt="translate('auth.login.title')"
					loading="lazy"
					class="auth-login-illustration-image"
				>
			</div>
		</div>
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
        height: 336px;
        background: var(--brand-primary);
        z-index: 0;
    }

    .auth-login-top {
        min-height: 560px;
        background: transparent;
        padding: 44px  0 100px;
        display: grid;
        grid-template-columns: minmax(150px, 306px) min(588px, calc(100vw - 180px)) minmax(150px, 306px);
        align-items: start;
        justify-content: center;
        position: relative;
        z-index: 1;

        .auth-login-illustration {
            width: 100%;
            height: 248px;
            display: flex;
            align-items: flex-end;
            justify-content: center;

            .auth-login-illustration-image {
                width: auto;
                height: 100%;
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