import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import {
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';
import { useCountry } from '~/composables/app/country/useCountry';
import { useRouter } from 'vue-router';
import {
	fetchAndStoreUser,
	requestSocialLoginRedirect,
} from '~/services/auth/auth.service';
import { useRedirectStore } from '~/stores/navigation/redirect.store';
import { useAuthLoginStore } from '~/stores/auth/login.store';
import { loadAddresses } from '~/services/user-address/user-address.service';
import { ensureDynamicFields } from '~/services/address-dynamic-fields/dynamic-fields.service';
import { useUsersStore } from '~/stores/users/users.store';
import { useTransferCart } from '~/composables/cart/useTransferCart';

export const useSocialLogin = () => {
	const router = useRouter();
	const route = useRoute();
	const auth_login_store = useAuthLoginStore()
	const users_store = useUsersStore()
	const { captureCurrentUserAsPrevious, clearPreviousUserId, runTransferCart } =
		useTransferCart()
	const { auth_redirect_url } = storeToRefs(useRedirectStore());

	const {
		is_checkout_mode,
	} = storeToRefs(auth_login_store)

	async function handleSocial(provider: string) {
		try {
			const response = await requestSocialLoginRedirect({ provider });

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

			const previous_user_id = users_store.state.id;

			captureCurrentUserAsPrevious();

			const poll_timer = setInterval(async () => {
				if (!popup_window.closed) return;

				clearInterval(poll_timer);

				const did_login = await syncSocialLoginUserState(previous_user_id);
				if (did_login) {
					await runTransferCart();

					router.push(auth_redirect_url.value);
					closeCheckoutModal();

					await ensureDynamicFields();
					loadAddresses('shipping')
					loadAddresses('billing')
					loadAddresses('drop')

				} else {
					clearPreviousUserId();
				}
			}, 500);
		} catch (error: unknown) {
			clearPreviousUserId();
			console.error(error);
		}
	}

	function closeCheckoutModal() {
		if (!is_checkout_mode.value) return

		auth_login_store.patchCheckoutState({
			is_modal_open: false,
			modal_mode: 'login',
			is_forgot_password_modal_open: false,
			forgot_password_email: '',
			should_restore_login_modal: false,
		})
	}

	async function syncSocialLoginUserState(previous_user_id: number) {
		try {
			const response = await fetchAndStoreUser();

			if (!response) {
				return false;
			}

			const new_user_id = users_store.state.id;
			const user_identity_changed = new_user_id !== 0 && new_user_id !== previous_user_id;

			if (!user_identity_changed) {
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