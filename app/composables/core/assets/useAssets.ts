/**
 * Centralized asset URL builder for the storefront.
 *
 * Builds CDN URLs for static, code-referenced assets (icons, marketing images)
 * by appending the configured store-front sub-path to the file_base_url.
 *
 * For database-referenced assets (e.g., product photos from prod/store-front/images),
 * use `useFileBaseUrl().resolveFileUrl(...)` directly with the DB path.
 */
export function useAssets() {
	const { resolveFileUrl } = useFileBaseUrl()

	return {
		// Concat-friendly base paths (with trailing slash) — use as: `icons + 'cart.svg'`
		icons: resolveFileUrl('store-front/icons/'),
		images: resolveFileUrl('store-front/images/'),

		// Recommended: helper functions — safer (no double-slash gotchas) and more readable
		// Usage: <img :src="icon('cart.svg')" />
		icon: (filename: string) => resolveFileUrl(`store-front/icons/${filename}`),
		image: (filename: string) => resolveFileUrl(`store-front/images/${filename}`),
	}
}
