export const COUNTRIES = {
    us: {
        name: 'United States',
        currency: {
            code: 'USD',
            symbol: '$',
            locale: 'en-US',
            decimals: 2,
        },
        timezone: 'America/New_York',
    },
    kr: {
        name: 'Korea',
        currency: {
            code: 'KRW',
            symbol: '\u20A9',
            locale: 'ko-KR',
            decimals: 0,
        },
        timezone: 'Asia/Seoul',
    },
} as const

export type SupportedCountry = keyof typeof COUNTRIES
export const DEFAULT_COUNTRY: SupportedCountry = 'us'
export const SUPPORTED_COUNTRY_SET = new Set<SupportedCountry>(
    Object.keys(COUNTRIES) as SupportedCountry[]
)
export const SUPPORTED_COUNTRIES = Object.keys(COUNTRIES) as SupportedCountry[]
export const COUNTRY_CODE_ALIASES: Record<string, SupportedCountry> = {
    us: 'us',
    en: 'us',
    kr: 'kr',
    ko: 'kr',
}
export const COUNTRY_TO_API_COUNTRY: Record<SupportedCountry, string> = {
    us: 'us',
    kr: 'kr',
}
export const COUNTRY_TO_HTML_LANG: Record<SupportedCountry, string> = {
    us: 'en',
    kr: 'ko',
}

export function isSupportedCountry(value: string): value is SupportedCountry {
    return SUPPORTED_COUNTRY_SET.has(value as SupportedCountry)
}

export function resolveSupportedCountry(value: string | null | undefined): SupportedCountry | null {
    if (!value) return null
    const normalized = value.toLowerCase()
    if (isSupportedCountry(normalized)) return normalized
    return COUNTRY_CODE_ALIASES[normalized] || null
}
