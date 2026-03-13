<script setup lang="ts">
import StatusBackgroundWrapper from '~/components/common/StatusBackgroundWrapper.vue';
import { useCountry } from '~/composables/app/country/useCountry';

definePageMeta({
	layout: 'home',
	hideHeader: true,
	hideFooter: true,
});

const { t } = useI18n();
const { withCountry } = useCountry();
</script>

<template>
	<StatusBackgroundWrapper test-id="auth-otp-expired-page" :full-height="true">
		<div class="auth-otp-expired-top-group">
			<UiLogo
				name="musticker"
				variant="full"
				color="colored"
				:size="88"
				class="auth-otp-expired-logo"
			/>

			<div class="auth-otp-expired-content-group">
				<div class="auth-otp-expired-heading-group">
					<h1 class="auth-otp-expired-title">
						{{ t('auth.otpExpired.title') }}
					</h1>

					<p class="auth-otp-expired-copy">
						{{ t('auth.otpExpired.description') }}
					</p>
				</div>

				<div class="auth-otp-expired-actions">
					<NuxtLink :to="withCountry('/auth/login')" class="auth-otp-expired-cta auth-otp-expired-cta--primary">
						<UiIcon name="strong-paper-plane" :size="24" color="var(--white-base)" />
						{{ t('auth.otpExpired.requestNew') }}
					</NuxtLink>

					<NuxtLink :to="withCountry('/')" class="auth-otp-expired-cta auth-otp-expired-cta--secondary">
						{{ t('auth.otpExpired.returnHome') }}
					</NuxtLink>
				</div>
			</div>
		</div>
	</StatusBackgroundWrapper>
</template>

<style scoped lang="scss">
.auth-otp-expired-top-group {
    width: min(800px, 100%);
    min-height: 0;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 56px;

    .auth-otp-expired-logo {
        display: block;
        margin: 0 auto;
    }

    .auth-otp-expired-content-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 56px;

        .auth-otp-expired-heading-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            text-align: center;

            .auth-otp-expired-title {

                font-size: var(--type-size-650);
                line-height: var(--type-line-650);
                font-weight: var(--font-weight-bold);
                color: var(--text-primary);
                letter-spacing: -0.03em;
                text-align: center;
            }

            .auth-otp-expired-copy {

                text-align: center;
                color: var(--text-primary);
                font-size: var(--type-size-300);
                line-height: var(--type-line-300);
            }
        }

        .auth-otp-expired-actions {
            width: 100%;
            max-width: 265px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;

            .auth-otp-expired-cta {
                width: 100%;
                min-height: 48px;
                border-radius: 18px;
                font-size: var(--type-size-200);
                line-height: var(--type-line-300);
                font-weight: var(--font-weight-semibold);
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;

                &.auth-otp-expired-cta--primary {
                    background: var(--text-primary);
                    color: var(--white-base);
                }

                &.auth-otp-expired-cta--secondary {
                    background: var(--contrast-light);
                    color: var(--text-primary);
                }
            }
        }
    }
}

@media (max-width: 900px) {
    .auth-otp-expired-top-group {
        gap: 14px;

        .auth-otp-expired-content-group {
            .auth-otp-expired-heading-group {
                .auth-otp-expired-copy {
                    font-size: var(--type-size-200);
                    line-height: var(--type-line-300);
                }
            }

            .auth-otp-expired-actions {
                .auth-otp-expired-cta {
                    min-height: 50px;
                    line-height: 50px;
                    padding: 0 24px;
                    border-radius: 14px;
                }
            }
        }
    }
}
</style>