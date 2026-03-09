export function isValidAuthEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getAuthResponseMessage(payload: unknown): string {
	if (!payload || typeof payload !== 'object') return '';
	const response = payload as { message?: unknown };
	return typeof response.message === 'string' ? response.message.trim() : '';
}

export function getAuthErrorMessage(payload: unknown): string {
	if (!payload || typeof payload !== 'object') return '';
	const error = payload as { data?: { message?: unknown }; message?: unknown };
	if (typeof error.data?.message === 'string' && error.data.message.trim()) {
		return error.data.message.trim();
	}
	return typeof error.message === 'string' ? error.message.trim() : '';
}