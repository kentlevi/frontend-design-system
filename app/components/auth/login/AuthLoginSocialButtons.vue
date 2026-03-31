<script setup lang="ts">
import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import {
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';
import { useAuthUser } from '~/composables/auth/useAuthUser';
import { useLoginUser } from '~/composables/auth/useLoginUser';
import { useCountry } from '~/composables/app/country/useCountry';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { withCountry } = useCountry();

function getRedirectCandidate() {
	const query_redirect = Array.isArray(route.query.redirect)
		? route.query.redirect[0]
		: route.query.redirect;
	if (query_redirect) return query_redirect;
	if (!import.meta.client) return null;
	return window.history.state?.back ?? null;
}

async function syncSocialLoginUserState() {
	try {
		const { fetchAndStoreUser } = useAuthUser();
		const response = await fetchAndStoreUser();

		if (!response) {
			return false;
		}

		if (import.meta.client) {
			window.localStorage.setItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY, '1');
			window.dispatchEvent(new CustomEvent(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT));
		}

		return true;
	} catch {
		// Keep social login flow non-blocking if profile hydration fails.
		return false;
	}
}

async function handleSocial(provider: string) {
	try {
		const { handleSocialLogin } = useLoginUser();
		const response = await handleSocialLogin({ provider });

		const redirect_url = response.data?.url;

		if (!redirect_url || !import.meta.client) return;

		const popup_width = 500;
		const popup_height = 600;
		const popup_left = (window.screen.width - popup_width) / 2;
		const popup_top = (window.screen.height - popup_height) / 2;

		const popup_window = window.open(
			redirect_url,
			'SocialLogin',
			`width=${popup_width},height=${popup_height},top=${popup_top},left=${popup_left}`
		);

		if (!popup_window) {
			console.error('Pop up blocked');
			return;
		}

		const poll_timer = setInterval(async () => {
			if (!popup_window.closed) return;

			clearInterval(poll_timer);

			const did_login = await syncSocialLoginUserState();
			if (did_login) {
				router.push(resolvePostLoginRedirect(getRedirectCandidate(), withCountry));
			}
		}, 500);
	} catch (error: unknown) {
		console.error(error);
	}
}
</script>

<template>
	<div class="auth-login-social-stack" data-testid="auth-login-social-stack">
		<div class="auth-login-divider">
			<span class="auth-login-social-label">{{ t('auth.login.socialLabel') }}</span>
		</div>

		<div class="auth-login-social-buttons">
			<UiButton
				variant="outline" tone="neutral" size="md" class="auth-login-social"
				label-class="auth-login-social-label-wrap"
				data-testid="auth-login-social-facebook" @click="handleSocial('facebook')">
				<span class="auth-login-social-content">
					<UiSocialIcon name="facebook" :size="24" variant="colored" />
					<span class="auth-login-social-text">{{ t('auth.login.signInFacebook') }}</span>
				</span>
			</UiButton>

			<UiButton
				variant="outline" tone="neutral" size="md" class="auth-login-social"
				label-class="auth-login-social-label-wrap"
				data-testid="auth-login-social-google" @click="handleSocial('google')">
				<span class="auth-login-social-content">
					<UiSocialIcon name="google" :size="24" variant="colored" />
					<span class="auth-login-social-text">{{ t('auth.login.signInGoogle') }}</span>
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