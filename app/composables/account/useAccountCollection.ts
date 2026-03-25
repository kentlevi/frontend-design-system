import { computed } from 'vue';

export function useAccountCollection<T>(items: readonly T[]) {
	return {
		items,
	};
}

export function useAccountCollectionWithActive<T>(items: readonly T[]) {
	const active_item = computed(() => items[0] ?? null);

	return {
		items,
		active_item,
	};
}