import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';

export function normalizeAppPath(path: string) {
	return path.replace(/\/+$/, '') || '/';
}

export function sanitizeRedirectSource(fullPath: string) {
	const parsed = new URL(fullPath, 'http://localhost');
	parsed.searchParams.delete('redirect');
	const search = parsed.searchParams.toString();
	return `${parsed.pathname}${search ? `?${search}` : ''}${parsed.hash}`;
}

export function sanitizeExistingRedirect(
	rawRedirect: unknown,
	withCountry: (path: string) => string
) {
	const homePath = normalizeAppPath(withCountry('/'));
	const loginPath = normalizeAppPath(withCountry('/auth/login'));
	const registerPath = normalizeAppPath(withCountry('/auth/register'));

	if (typeof rawRedirect !== 'string') return '';

	const candidate = rawRedirect.trim();
	if (!candidate.startsWith('/') || candidate.startsWith('//')) return '';

	const parsed = new URL(candidate, 'http://localhost');
	const targetPath = normalizeAppPath(parsed.pathname);
	if (targetPath === homePath || targetPath === loginPath || targetPath === registerPath) {
		return '';
	}

	parsed.searchParams.delete('redirect');
	const search = parsed.searchParams.toString();
	return `${parsed.pathname}${search ? `?${search}` : ''}${parsed.hash}`;
}

export function resolvePostLoginRedirect(
	rawRedirect: unknown,
	withCountry: (path: string) => string
) {
	const fallback = withCountry('/');
	const homePath = normalizeAppPath(withCountry('/'));
	const loginPath = normalizeAppPath(withCountry('/auth/login'));
	const registerPath = normalizeAppPath(withCountry('/auth/register'));

	if (typeof rawRedirect !== 'string') return fallback;

	const candidate = rawRedirect.trim();
	if (!candidate.startsWith('/') || candidate.startsWith('//')) return fallback;

	const parsed = new URL(candidate, 'http://localhost');
	const segments = parsed.pathname.split('/').filter(Boolean);
	if (segments.length === 0) return fallback;

	const currentCountryPath = normalizeAppPath(withCountry('/'));
	const currentCountry = currentCountryPath.split('/').filter(Boolean)[0] || DEFAULT_COUNTRY;
	const hasCountryPrefix = Boolean(resolveSupportedCountry(segments[0]));
	const targetSegments = hasCountryPrefix ? segments.slice(1) : segments;

	const normalizedPath =
		targetSegments.length > 0
			? `/${currentCountry}/${targetSegments.join('/')}`
			: `/${currentCountry}`;

	const normalizedTargetPath = normalizeAppPath(normalizedPath);
	if (
		normalizedTargetPath === homePath ||
		normalizedTargetPath === loginPath ||
		normalizedTargetPath === registerPath
	) {
		return fallback;
	}

	parsed.searchParams.delete('redirect');
	const normalizedSearch = parsed.searchParams.toString();
	return `${normalizedPath}${normalizedSearch ? `?${normalizedSearch}` : ''}${parsed.hash}`;
}