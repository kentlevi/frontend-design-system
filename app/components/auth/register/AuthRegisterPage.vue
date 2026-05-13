<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AuthRegisterCard from '@/components/auth/register/AuthRegisterCard.vue';
import RegisterCard from '~/components/features/auth/register/RegisterCard.vue';

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
                <!-- <RegisterCard /> -->
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
        height: 336px;
        background: var(--brand-primary);
        z-index: 0;
    }

    .auth-register-top {
        min-height: 560px;
        background: transparent;
        padding: 44px  0 100px;
        display: grid;
        grid-template-columns: minmax(150px, 306px) min(588px, calc(100vw - 180px)) minmax(150px, 306px);
        align-items: start;
        justify-content: center;
        position: relative;
        z-index: 1;

        .auth-register-illustration {
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: center;

            .auth-register-kid-falling,
            .auth-register-kid-standing {
                width: auto;
                max-width: 242px;
                object-fit: contain;
                display: block;
            }

            .auth-register-kid-falling {
                height: 248px;
            }

            .auth-register-kid-standing {
                height: 352px;
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