import { useRedirectStore } from '~/stores/navigation/redirect.store';

export default defineNuxtRouteMiddleware((to, _from) =>
{
	const redirect_store = useRedirectStore();

	const nuxt_app = useNuxtApp();

	const supported_locales: string[] =
		nuxt_app.$i18n.locales.value.map((locale: { code: string }) =>
			locale.code
		);

	const path_segments = to.path.split('/').filter(Boolean);

	const first_segment = path_segments[0] ?? '';

	const normalized_path = supported_locales.includes(first_segment)
		? '/' + path_segments.slice(1).join('/')
		: to.path;

	const ignored_routes = [
		'/auth',
		'/logout'
	];

	const should_ignore = ignored_routes.some((route) =>
		normalized_path.startsWith(route)
	);

	if (should_ignore) {
		return;
	}

	redirect_store.setAuthRedirectUrl(to.fullPath);
});