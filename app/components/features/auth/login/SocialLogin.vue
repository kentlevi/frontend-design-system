<script lang="ts" setup>
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import { useSocialLogin } from '~/composables/auth/login/useSocialLogin';

const { t: translate } = useI18n();

const { handleSocial } = useSocialLogin();
</script>

<template>
	<MuLinearWrapper direction="column" gap="8px">
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
				<UiSocialIcon name="facebook" :size="24" variant="colored" />
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
					translate('auth.login.signInGoogle')
				}}</span>
			</span>
		</UiButton>
	</MuLinearWrapper>
</template>

<style lang="scss">
.auth-login-social {
    .auth-login-social-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}
</style>