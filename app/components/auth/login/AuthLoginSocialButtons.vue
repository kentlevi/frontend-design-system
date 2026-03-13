<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCountry } from '~/composables/app/country/useCountry';
import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import type { UserIdentity, UserProfile } from '~/stores/user';
import {
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';

const { t } = useI18n();
const api = useApi();
const router = useRouter();
const route = useRoute();
const { withCountry, apiCountry } = useCountry();
const userStore = useUserStore();

function getRedirectCandidate() {
	const queryRedirect = Array.isArray(route.query.redirect)
		? route.query.redirect[0]
		: route.query.redirect;
	if (queryRedirect) return queryRedirect;
	if (!import.meta.client) return null;
	return window.history.state?.back ?? null;
}

interface SocialLogin {
	data: {
		url: string
	}
}

interface MeResponse {
	success: boolean;
	message?: string;
	data: {
		user?: UserIdentity & { profile: UserProfile | null };
	};
}

async function syncSocialLoginUserState() {
	try {
		const response = await api<MeResponse>(`/${apiCountry.value}/user/me`, {
			method: 'GET',
		});

		if (!response?.data?.user) return false;

		const guestLoginMode = useCookie<string | number | null>('guest_login_mode', {
			maxAge: 60 * 60 * 24 * 3,
			sameSite: 'lax',
			path: '/',
		});
		const mockUser = useCookie<{
			firstName: string;
			lastName: string;
			email: string;
		} | null>('mock_user', {
			sameSite: 'lax',
			path: '/',
		});

		userStore.setUser(response.data.user);
		guestLoginMode.value = 0;

		const fields = response.data.user.profile?.user_field_values ?? [];
		const firstName =
			fields.find((field) =>
				field.country_field?.field_key === 'first_name' ||
				(field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === 1
			)?.value?.trim() || '';
		const lastName =
			fields.find((field) =>
				field.country_field?.field_key === 'last_name' ||
				(field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === 2
			)?.value?.trim() || '';

		mockUser.value = {
			firstName,
			lastName,
			email: response.data.user.email || '',
		};

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

/* @desc social login popup */
async function handleSocial(provider: string) {
	try {
		const response = await api<SocialLogin>(`/${apiCountry.value}/auth/social/redirect`, {
			method: 'POST',
			body: {
				provider
			}
		})

		const url = response.data?.url

		if (!url) return

		const width = 500
		const height = 600
		const left = (window.screen.width - width) / 2
		const top = (window.screen.height - height) / 2

		const popup = window.open(
			url,
			'SocialLogin',
			`width=${width},height=${height},top=${top},left=${left}`
		)

		if (!popup) return console.error('Pop up blocked');

		const pollTimer = setInterval(async () => {
			if (popup.closed) {
				clearInterval(pollTimer)

				const didLogin = await syncSocialLoginUserState()
				if (didLogin) {
					router.push(resolvePostLoginRedirect(getRedirectCandidate(), withCountry))
				}
			}
		}, 500)
	} catch (error: unknown) {
		console.error(error)
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