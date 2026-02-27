import { COUNTRIES, type SupportedCountry } from '~/constants/countries';

export interface CurrencyFormatOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

export function formatCurrency(
    value: number,
    options: CurrencyFormatOptions = {}
) {
    const {
        locale = 'en-US',
        currency = 'USD',
        minimumFractionDigits = 2,
        maximumFractionDigits = minimumFractionDigits,
    } = options;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);
}

export function formatCurrencyByCountry(
    value: number,
    country: SupportedCountry
) {
    const config = COUNTRIES[country].currency;
    return formatCurrency(value, {
        locale: config.locale,
        currency: config.code,
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
    });
}

export function formatUsd(value: number) {
    return formatCurrency(value, {
        locale: 'en-US',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
