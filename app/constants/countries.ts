export const COUNTRIES = {
    en: {
        name: 'Philippines',
        currency: { 
            code: 'PHP', 
            symbol: '₱', 
            locale: 'en-PH', 
            decimals: 2 
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
export const SUPPORTED_COUNTRY_SET = new Set(Object.keys(COUNTRIES))
