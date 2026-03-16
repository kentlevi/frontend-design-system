import { computed, nextTick, ref, watch, type ComponentPublicInstance, type Ref } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import {
	HOME_WELCOME_POPOVER_PENDING_KEY,
	HOME_WELCOME_POPOVER_TRIGGER_EVENT,
} from '~/data/home/onboarding';
import type { icons } from '~/data/ui/icons';
import {
	normalizeAppPath,
	sanitizeExistingRedirect,
	sanitizeRedirectSource,
} from '~/utils/auth/redirect';

type AccountLink = {
	to: string;
	icon: keyof typeof icons;
	label: string;
};

const GUEST_ORDER_TEST_ROUTE = '/orders/12405070009';

export function useAppHeaderAccountMenu(params: {
	accountOpen: Ref<boolean>;
	isMockLoggedIn: Ref<boolean>;
	isGuestLoggedIn: Ref<boolean>;
	accountLinks: Ref<AccountLink[]>;
	setWrapRef: (element: HTMLElement | null) => void;
	closeMenu: () => void;
}) {
	const { withCountry } = useCountry();
	const route = useRoute();

	const account_toggle_ref = ref<HTMLButtonElement | null>(null);
	const account_dropdown_ref = ref<HTMLElement | null>(null);

	function bindWrapRef(element: Element | ComponentPublicInstance | null) {
		params.setWrapRef(element instanceof HTMLElement ? element : null);
	}

	function handleAccountLinkClick(event: MouseEvent, to: string) {
		if (to === '/auth/profile') {
			event.preventDefault();
			if (import.meta.client) {
				window.localStorage.setItem(HOME_WELCOME_POPOVER_PENDING_KEY, '1');
				window.dispatchEvent(new CustomEvent(HOME_WELCOME_POPOVER_TRIGGER_EVENT));
			}
			params.closeMenu();
			void navigateTo(withCountry('/'));
			return;
		}

		params.closeMenu();
	}

	const primary_account_links = computed(() =>
		params.accountLinks.value.filter((link) => link.to !== '/auth/profile')
	);

	const getting_started_link = computed(
		() => params.accountLinks.value.find((link) => link.to === '/auth/profile') ?? null
	);

	const guest_order_link = computed(
		() => params.accountLinks.value.find((link) => link.to === '/account/orders') ?? null
	);

	const guest_order_target = computed(() => withCountry(GUEST_ORDER_TEST_ROUTE));

	function resolveButtonElement(
		element: Element | ComponentPublicInstance | null
	) {
		if (element instanceof HTMLButtonElement) return element;
		if (element instanceof HTMLElement) {
			return element.querySelector('button');
		}
		return null;
	}

	function setAccountToggleRef(element: Element | ComponentPublicInstance | null) {
		account_toggle_ref.value = resolveButtonElement(element);
	}

	function setAccountDropdownRef(element: Element | ComponentPublicInstance | null) {
		account_dropdown_ref.value = element instanceof HTMLElement ? element : null;
	}

	const guest_login_target = computed(() => {
		const login_path = normalizeAppPath(withCountry('/auth/login'));
		const register_path = normalizeAppPath(withCountry('/auth/register'));
		const home_path = normalizeAppPath(withCountry('/'));
		const current_path = normalizeAppPath(route.path);

		if (current_path === home_path || current_path === register_path) {
			return withCountry('/auth/login');
		}

		if (current_path === login_path) {
			const current_redirect = Array.isArray(route.query.redirect)
				? route.query.redirect[0]
				: route.query.redirect;
			const preserved_redirect = sanitizeExistingRedirect(current_redirect, withCountry);
			if (!preserved_redirect) return withCountry('/auth/login');

			return {
				path: withCountry('/auth/login'),
				query: {
					redirect: preserved_redirect,
				},
			};
		}

		return {
			path: withCountry('/auth/login'),
			query: {
				redirect: sanitizeRedirectSource(route.fullPath),
			},
		};
	});

	watch(
		() => params.accountOpen.value,
		async (is_open) => {
			if (!is_open) return;

			await nextTick();

			if (params.isMockLoggedIn.value || params.isGuestLoggedIn.value) {
				account_dropdown_ref.value?.focus();
				return;
			}

			account_toggle_ref.value?.focus();
		}
	);

	return {
		bindWrapRef: bindWrapRef,
		handleAccountLinkClick: handleAccountLinkClick,
		primaryAccountLinks: primary_account_links,
		gettingStartedLink: getting_started_link,
		guestOrderLink: guest_order_link,
		guestOrderTarget: guest_order_target,
		setAccountToggleRef: setAccountToggleRef,
		setAccountDropdownRef: setAccountDropdownRef,
		guestLoginTarget: guest_login_target,
	};
}