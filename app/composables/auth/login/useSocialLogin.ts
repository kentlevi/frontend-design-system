import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import {
    HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
    LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';
import { useLoginUser } from '~/composables/auth/useLoginUser';
import { useCountry } from '~/composables/app/country/useCountry';
import { useRouter } from 'vue-router';
import { fetchAndStoreUser } from '~/services/auth/auth.service';

export const useSocialLogin = () => {
    const router = useRouter();
    const route = useRoute();
    const { withCountry } = useCountry();

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

    return {
        handleSocial
    }
}