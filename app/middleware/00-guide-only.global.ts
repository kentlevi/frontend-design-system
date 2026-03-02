export default defineNuxtRouteMiddleware((to) => {
	const path = to.path || '/'
	if (path.startsWith('/guide')) return

	return navigateTo(
		{
			path: '/guide',
			hash: to.hash,
		},
		{ replace: true }
	)
})
