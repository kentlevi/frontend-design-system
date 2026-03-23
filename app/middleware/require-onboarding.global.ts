import { storeToRefs } from 'pinia';
import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';
import { useUsersStore } from '~/stores/users/users.store';
import { useAuthUser } from '~/composables/auth/useAuthUser';

function hasEmailValue(email: string | null | undefined): boolean {
    return Boolean((email ?? '').trim());
}

function isCallbackPath(path: string): boolean {
    return path === '/callback' || path.endsWith('/callback');
}

export default defineNuxtRouteMiddleware(async (to) => {
    const users_store = useUsersStore();
    const { state } = storeToRefs(users_store);

    /**
     * Skip callback routes
     */
    if (isCallbackPath(to.path)) {
        return;
    }

    const [first_segment] = to.path.split('/').filter(Boolean);
    const country = resolveSupportedCountry(first_segment || '') || DEFAULT_COUNTRY;

    const onboarding_path = `/${country}/auth/profile`;

    /**
     * Prevent redirect loop
     */
    if (to.path === onboarding_path) {
        return;
    }

    /**
     * If user is already loaded in store
     */
    if (state.value.id) {
        if (!hasEmailValue(state.value.email)) {
            return navigateTo(
                {
                    path: onboarding_path,
                    query: {
                        redirect: to.fullPath,
                    },
                },
                { replace: true }
            );
        }

        return;
    }

    /**
     * If user is not yet loaded, fetch /me first
     */
    const { fetchAndStoreUser } = useAuthUser();
    const is_authenticated = await fetchAndStoreUser();

    if (!is_authenticated) {
        return;
    }

    if (!hasEmailValue(state.value.email)) {
        return navigateTo(
            {
                path: onboarding_path,
                query: {
                    redirect: to.fullPath,
                },
            },
            { replace: true }
        );
    }
});