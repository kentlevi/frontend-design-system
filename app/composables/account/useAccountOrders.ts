import { computed } from 'vue';
import { accountOrders } from '~/data/account/orders';

export function useAccountOrders() {
    const activeOrder = computed(() => accountOrders[0] ?? null);

    return {
        orders: accountOrders,
        activeOrder,
    };
}
