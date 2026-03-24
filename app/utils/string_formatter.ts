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