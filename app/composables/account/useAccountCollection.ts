import { computed, ref } from 'vue';

export function useAccountCollection<T>(items: readonly T[]) {
	const collection_items = ref(items.map((item) => ({ ...item })) as T[]);

	return {
		items: collection_items,
	};
}

export function useAccountCollectionWithActive<T>(items: readonly T[]) {
	const active_item = computed(() => items[0] ?? null);

	return {
		items,
		active_item,
	};
}