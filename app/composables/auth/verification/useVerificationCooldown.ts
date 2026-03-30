import { onBeforeUnmount, ref } from 'vue';

type CooldownResponse = {
	data?: {
		cooldown_remaining?: unknown;
	};
} | null;

function normalizeCooldownSeconds(value: unknown): number {
	const seconds = Number(value);
	if (!Number.isFinite(seconds) || seconds <= 0) {
		return 0;
	}

	return Math.max(0, Math.floor(seconds));
}

export function toEpochMilliseconds(value: unknown): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value > 1e12 ? value : value * 1000;
	}

	if (typeof value === 'string') {
		const parsed_number = Number(value);
		if (Number.isFinite(parsed_number)) {
			return parsed_number > 1e12 ? parsed_number : parsed_number * 1000;
		}

		const parsed_date = Date.parse(value);
		return Number.isFinite(parsed_date) ? parsed_date : Number.NaN;
	}

	if (value instanceof Date) {
		return value.getTime();
	}

	return Number.NaN;
}

export function getRemainingSecondsFromTimestamp(value: unknown): number {
	const cooldown_until = toEpochMilliseconds(value);
	if (!Number.isFinite(cooldown_until)) {
		return 0;
	}

	const remaining = Math.ceil((cooldown_until - Date.now()) / 1000);
	return Math.max(0, remaining);
}

export function isTimestampExpired(value: unknown): boolean {
	const expiry_time = toEpochMilliseconds(value);
	if (!Number.isFinite(expiry_time)) {
		return true;
	}

	return Date.now() >= expiry_time;
}

export function getCooldownSecondsFromResponse(response: unknown): number {
	const payload = response as CooldownResponse;
	return normalizeCooldownSeconds(payload?.data?.cooldown_remaining ?? 0);
}

export function useVerificationCooldown() {
	const remaining_seconds = ref(0);
	let timer: ReturnType<typeof setInterval> | null = null;

	function clear() {
		if (!timer) return;
		clearInterval(timer);
		timer = null;
	}

	function start(seconds: number) {
		clear();
		remaining_seconds.value = normalizeCooldownSeconds(seconds);

		if (remaining_seconds.value <= 0) {
			return;
		}

		timer = setInterval(() => {
			if (remaining_seconds.value <= 1) {
				clear();
				remaining_seconds.value = 0;
				return;
			}

			remaining_seconds.value -= 1;
		}, 1000);
	}

	function applyFromResponse(response: unknown): number {
		const seconds = getCooldownSecondsFromResponse(response);
		if (seconds <= 0) {
			clear();
			remaining_seconds.value = 0;
			return 0;
		}

		start(seconds);
		return seconds;
	}

	onBeforeUnmount(() => {
		clear();
	});

	return {
		remaining: remaining_seconds,
		start,
		clear,
		applyFromResponse,
	};
}