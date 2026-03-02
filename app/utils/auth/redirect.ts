import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';

export function resolvePostLoginRedirect(
    rawRedirect: unknown,
    withCountry: (path: string) => string
) {
    const fallback = withCountry('/');
    const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';
    const homePath = normalizePath(withCountry('/'));
    const loginPath = normalizePath(withCountry('/auth/login'));
    const registerPath = normalizePath(withCountry('/auth/register'));

    if (typeof rawRedirect !== 'string') return fallback;

    const candidate = rawRedirect.trim();
    if (!candidate.startsWith('/') || candidate.startsWith('//')) return fallback;

    const parsed = new URL(candidate, 'http://localhost');
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return fallback;

    const resolvedCountry = resolveSupportedCountry(segments[0]) || DEFAULT_COUNTRY;
    if (!resolvedCountry) return fallback;

    const normalizedPath =
        segments.length > 1
            ? `/${resolvedCountry}/${segments.slice(1).join('/')}`
            : `/${resolvedCountry}`;

    const normalizedTargetPath = normalizePath(normalizedPath);
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
