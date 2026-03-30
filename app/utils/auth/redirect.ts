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
	const home_path = normalizeAppPath(withCountry('/'));
	const login_path = normalizeAppPath(withCountry('/auth/login'));
	const register_path = normalizeAppPath(withCountry('/auth/register'));

	if (typeof rawRedirect !== 'string') return '';

	const candidate = rawRedirect.trim();
	if (!candidate.startsWith('/') || candidate.startsWith('//')) return '';

	const parsed = new URL(candidate, 'http://localhost');
	const target_path = normalizeAppPath(parsed.pathname);
	if (target_path === home_path || target_path === login_path || target_path === register_path) {
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
	const home_path = normalizeAppPath(withCountry('/'));
	const login_path = normalizeAppPath(withCountry('/auth/login'));
	const register_path = normalizeAppPath(withCountry('/auth/register'));

	if (typeof rawRedirect !== 'string') return fallback;

	const candidate = rawRedirect.trim();
	if (!candidate.startsWith('/') || candidate.startsWith('//')) return fallback;

	const parsed = new URL(candidate, 'http://localhost');
	const segments = parsed.pathname.split('/').filter(Boolean);
	if (segments.length === 0) return fallback;

	const current_country_path = normalizeAppPath(withCountry('/'));
	const current_country = current_country_path.split('/').filter(Boolean)[0] || DEFAULT_COUNTRY;
	const has_country_prefix = Boolean(resolveSupportedCountry(segments[0]));
	const target_segments = has_country_prefix ? segments.slice(1) : segments;

	const normalized_path =
		target_segments.length > 0
			? `/${current_country}/${target_segments.join('/')}`
			: `/${current_country}`;

	const normalized_target_path = normalizeAppPath(normalized_path);
	if (
		normalized_target_path === home_path ||
		normalized_target_path === login_path ||
		normalized_target_path === register_path
	) {
		return fallback;
	}

	parsed.searchParams.delete('redirect');
	const normalized_search = parsed.searchParams.toString();
	return `${normalized_path}${normalized_search ? `?${normalized_search}` : ''}${parsed.hash}`;
}