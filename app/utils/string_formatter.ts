import { useCountry } from "~/composables/app/country/useCountry"
import { COUNTRIES } from "~/constants/countries"

/**
 * Convert first character of a string to uppercase
 */
export function capitalizeFirst(value: string): string {
	/** Return early if value is empty */
	if (!value) return ''

	/** Uppercase first character and append the rest */
	return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Convert first character of every word to uppercase
 */
export function capitalizeWords(value: string): string {
	/** Return early if value is empty */
	if (!value) return ''

	/** Split by space, capitalize each word, then join back */
	return value
		.split(' ')
		.map((word) => capitalizeFirst(word.toLowerCase()))
		.join(' ')
}

/**
 * Convert full string to uppercase
 */
export function toUpper(value: string): string {
	/** Return early if value is empty */
	if (!value) return ''

	/** Convert string to uppercase */
	return value.toUpperCase()
}

/**
 * Convert full string to lowercase
 */
export function toLower(value: string): string {
	/** Return early if value is empty */
	if (!value) return ''

	/** Convert string to lowercase */
	return value.toLowerCase()
}

/**
 * Convert string to title case
 */
export function toTitleCase(value: string): string {
	/** Reuse capitalizeWords for title case behavior */
	return capitalizeWords(value)
}

/**
 * Trim extra spaces from both ends and between words
 */
export function normalizeSpaces(value: string): string {
	/** Return early if value is empty */
	if (!value) return ''

	/** Remove extra spaces and keep single spaces only */
	return value.trim().replace(/\s+/g, ' ')
}

export function numberFormat(value: number | string): string {
	const { country } = useCountry();
	const config = COUNTRIES[country.value].currency;

	if (value === null || value === undefined || value === '') return '0';

	// Ensure we are working with a number
	const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

	if (isNaN(num)) return '0';

	return new Intl.NumberFormat(config.locale, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(num);
}

/**
 * Checks if a value is a valid number or a string that can become one.
 * Handles: "1,000", 1000, "10.5", etc.
 */
export const isConvertibleToNumber = (value: string | number): boolean => {
	// 1. If it's already a number, just make sure it's not NaN or Infinity
	if (typeof value === 'number') {
		return Number.isFinite(value);
	}

	// 2. If it's not a string (like null, undefined, or an object), it's not a number
	if (typeof value !== 'string') {
		return false;
	}

	// 3. Clean the string: remove commas and trim whitespace
	const cleanValue = value.replace(/,/g, '').trim();

	// 4. Check if the cleaned string is empty
	if (cleanValue === '') {
		return false;
	}

	// 5. Check if parseFloat can handle it and if the result is a real number
	const parsed = parseFloat(cleanValue);
	return !isNaN(parsed) && isFinite(parsed);
}

export const formatLabel = (value : string | number) : string | number => {
	if( !isConvertibleToNumber(value) )
		return value

	return numberFormat(value)
}