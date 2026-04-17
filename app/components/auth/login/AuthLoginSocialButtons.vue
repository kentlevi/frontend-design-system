<script setup lang="ts">
import { useSocialLogin } from '~/composables/auth/login/useSocialLogin';

withDefaults(defineProps<{
	googleLabelKey?: string;
}>(), {
	googleLabelKey: 'auth.login.signInGoogle',
});

const { t: translate } = useI18n();
const { handleSocial } = useSocialLogin()
</script>

<template>
	<div class="auth-login-social-stack" data-testid="auth-login-social-stack">
		<div class="auth-login-divider">
			<span class="auth-login-social-label">{{
				translate('auth.login.socialLabel')
			}}</span>
		</div>

		<div class="auth-login-social-buttons">
			<UiButton
				variant="outline"
				tone="neutral"
				size="md"
				class="auth-login-social"
				label-class="auth-login-social-label-wrap"
				data-testid="auth-login-social-facebook"
				@click="handleSocial('facebook')"
			>
				<span class="auth-login-social-content">
					<UiSocialIcon
						name="facebook"
						:size="24"
						variant="colored"
					/>
					<span class="auth-login-social-text">{{
						translate('auth.login.signInFacebook')
					}}</span>
				</span>
			</UiButton>

			<UiButton
				variant="outline"
				tone="neutral"
				size="md"
				class="auth-login-social"
				label-class="auth-login-social-label-wrap"
				data-testid="auth-login-social-google"
				@click="handleSocial('google')"
			>
				<span class="auth-login-social-content">
					<UiSocialIcon name="google" :size="24" variant="colored" />
					<span class="auth-login-social-text">{{
						translate(googleLabelKey)
					}}</span>
				</span>
			</UiButton>
		</div>
	</div>
</template>

<style lang="scss">
.auth-login-social-stack {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.auth-login-divider {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text-muted);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);

		.auth-login-social-label {
			padding: 0 40px;
		}

		&::before,
		&::after {
			content: '';
			flex: 1;
			height: 1px;
			background: var(--border-default);
		}
	}

	.auth-login-social-buttons {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.auth-login-social {
			width: 100%;
			border-radius: 16px;
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
			box-shadow: none;
			display: flex;
			align-items: center;
			justify-content: center;

			.auth-login-social-label-wrap {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0;
			}

			.auth-login-social-content {
				display: flex;
				height: 100%;
				align-items: center;
				justify-content: center;
				gap: 8px;
			}

			.auth-login-social-text {
				display: inline-flex;
				align-items: center;
			}
		}
	}
}
</style>