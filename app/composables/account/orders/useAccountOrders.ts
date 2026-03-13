import { computed, ref, watch } from 'vue';
import { accountOrders } from '~/data/account/orders';
import type { AccountOrder, AccountOrderLifecycle, AccountOrderSection } from '~/types/account/orders';

const section_order: AccountOrderSection[] = ['ongoing', 'actionRequired', 'completed'];

export function useAccountOrders() {
	const lifecycle = ref<AccountOrderLifecycle>('active');
	const search_query = ref('');
	const is_detail_open = ref(true);
	const active_order_id = ref(accountOrders[0]?.id ?? '');

	const filtered_orders = computed(() => {
		const normalized_query = search_query.value.trim().toLowerCase();

		return accountOrders.filter((order) => {
			if (order.lifecycle !== lifecycle.value) return false;
			if (!normalized_query) return true;

			return [
				order.id,
				order.date,
				order.paymentMethodLabel,
				order.statusKey,
			].some((value) => value.toLowerCase().includes(normalized_query));
		});
	});

	const order_groups = computed(() => {
		return section_order
			.map((section) => ({
				section,
				items: filtered_orders.value.filter((order) => order.section === section),
			}))
			.filter((group) => group.items.length > 0);
	});

	const active_order = computed<AccountOrder | null>(() => {
		return filtered_orders.value.find((order) => order.id === active_order_id.value) ?? filtered_orders.value[0] ?? null;
	});

	watch(
		filtered_orders,
		(next_orders) => {
			if (!next_orders.length) {
				active_order_id.value = '';
				return;
			}

			if (!next_orders.some((order) => order.id === active_order_id.value)) {
				active_order_id.value = next_orders[0].id;
			}
		},
		{ immediate: true }
	);

	function set_lifecycle(next_lifecycle: AccountOrderLifecycle) {
		lifecycle.value = next_lifecycle;
	}

	function set_active_order(order_id: string) {
		active_order_id.value = order_id;
	}

	function toggle_detail_open() {
		is_detail_open.value = !is_detail_open.value;
	}

	return {
		lifecycle,
		search_query,
		is_detail_open,
		order_groups,
		active_order,
		set_lifecycle,
		set_active_order,
		toggle_detail_open,
	};
}