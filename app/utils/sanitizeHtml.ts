import DOMPurify, { type Config } from 'isomorphic-dompurify';

export const sanitizeHTML = (
	html: string | undefined | null,
	options: Config = {},
): string => {
	if (!html) return '';

	return DOMPurify.sanitize(html, {
		USE_PROFILES: {
			html: true,
		},
		...options,
	});
};
