import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
} from '~/data/home/onboarding';
import type { NonMemberLoginVerificationResponse, NonMemberVerificationCache } from '~/types/auth/auth';

export function isValidAuthEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getAuthResponseMessage(payload: unknown): string {
	if (!payload || typeof payload !== 'object') return '';
	const response = payload as { message?: unknown };
	return typeof response.message === 'string' ? response.message.trim() : '';
}

export function getAuthResponseMessageCode(payload: unknown): string {
	if (!payload || typeof payload !== 'object') return '';

	const response = payload as {
		data?: { code?: unknown }
	}

	return typeof response.data?.code === 'string'
		? response.data.code.trim()
		: '';
}

export function getAuthResponseCode(payload: unknown): string {
	if (!payload || typeof payload !== 'object') return '';
	const response = payload as { data?: { code?: unknown } };
	const code = response.data?.code;
	return typeof code === 'string' ? code.trim() : '';
}

export function getAuthErrorMessage(payload: unknown): string {
	if (!payload || typeof payload !== 'object') return '';
	const error = payload as { data?: { message?: unknown }; message?: unknown };
	if (typeof error.data?.message === 'string' && error.data.message.trim()) {
		return error.data.message.trim();
	}
	return typeof error.message === 'string' ? error.message.trim() : '';
}

export function setGuestLoginToastPending() {
	if (!import.meta.client) return;
	window.localStorage.setItem(GUEST_LOGIN_TOAST_PENDING_KEY, '1');
	window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
}

export function getGuestVerificationCache() {
	const guest_verification_cache = useCookie<NonMemberVerificationCache | null>('guest_verification_cache')
	return guest_verification_cache.value
}

export function clearGuestVerificationCache() {
	const guest_verification_cache = useCookie<NonMemberVerificationCache | null>('guest_verification_cache')
	return guest_verification_cache.value = null
}

export function cacheNonMemberVerificationData(response: NonMemberLoginVerificationResponse, email: string, order_number: string) {
	const CACHE_DURATION = 60 * 60 * 24 * 30; // 30 days

	const guest_verification_cache = useCookie<NonMemberVerificationCache | null>('guest_verification_cache', {
		maxAge: CACHE_DURATION,
		sameSite: 'lax',
		path: '/',
	});

	guest_verification_cache.value = {
		email,
		order_number: order_number,
		token: response.data?.token,
		expires_in: response.data?.expires_in,
		cached_at: Date.now(),
	}
}