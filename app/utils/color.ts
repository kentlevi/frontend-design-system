export const isValidHex = (val: string) => /^#([0-9A-F]{3}){1,2}$/i.test(val);

export const getHexFromToken = (token: string): string => {
	if (typeof document === 'undefined') return '#000000';

	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(`--${token}`)
		.trim()
		.toLowerCase();

	return value || '#000000';
};