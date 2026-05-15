import { fetchTotalPoints } from "~/services/user-point/api.service";
import { useOverviewStore } from "~/stores/users/overview.store";
import { usePointsStore } from "~/stores/user-point/points.store";
import { useCartStore } from "~/stores/core/cart/cart.store";
import { useProductionShippingStore } from "~/stores/production-shipping/production-shipping.store";
import { useCouponDiscount } from "~/composables/coupon/useCouponDiscount";

export function usePoints() {
	const overview_store = useOverviewStore()
	const { overview } = storeToRefs(overview_store)

	const points_store = usePointsStore()
	const { points_to_use } = storeToRefs(points_store)

	const cart_store = useCartStore()
	const { selected_total_cost } = storeToRefs(cart_store)

	const shipping_store = useProductionShippingStore()
	const { selected_shipping } = storeToRefs(shipping_store)

	const { discount: coupon_discount } = useCouponDiscount()

	const total_points = ref(0)

	const max_points_allowed = computed(() => {
		const shipping = selected_shipping.value?.shipping_price ?? 0
		const cost_before_points = Math.max(0, selected_total_cost.value + shipping - coupon_discount.value)
		return Math.min(total_points.value, cost_before_points)
	})

	async function getTotalPoints() {
		try{
			const response = await fetchTotalPoints()
			const total = response.data?.total_points ?? 0
			total_points.value = total

			if (overview.value) {
				overview_store.setOverview({ ...overview.value, total_points: total })
			}
		} catch(err) {
			console.log(err)
		}
	}

	function useAllPoints() {
		points_store.setPointsToUse(String(max_points_allowed.value))
	}

	function clearPoints() {
		points_store.clearPointsToUse()
	}

	function getProjected(input: HTMLInputElement, insert: string): number {
		const start = input.selectionStart ?? 0;
		const end = input.selectionEnd ?? 0;
		return parseInt(input.value.slice(0, start) + insert + input.value.slice(end), 10) || 0;
	}

	function handlePointsKeydown(e: KeyboardEvent) {
		const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
		const is_digit = /^\d$/.test(e.key);
		if (!is_digit && !allowed.includes(e.key)) { e.preventDefault(); return; }
		if (is_digit && getProjected(e.target as HTMLInputElement, e.key) > max_points_allowed.value) {
			e.preventDefault();
			points_to_use.value = String(max_points_allowed.value);
		}
	}

	function handlePointsPaste(e: ClipboardEvent) {
		e.preventDefault();
		const input = e.target as HTMLInputElement;
		const digits = e.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
		if (!digits) return;
		input.value = String(Math.min(getProjected(input, digits), max_points_allowed.value));
		input.dispatchEvent(new Event('input', { bubbles: true }));
	}

	watch(points_to_use, (val) => {
		const numeric_val = parseInt(val, 10) || 0
		if (numeric_val > max_points_allowed.value) {
			points_to_use.value = String(max_points_allowed.value)
		}
		points_store.setPointsToUse(points_to_use.value)
	})

	onMounted(() => {
		getTotalPoints()
	})

	return {
		points_to_use,
		total_points,
		max_points_allowed,

		handlePointsKeydown,
		handlePointsPaste,
		useAllPoints,
		clearPoints,
	}
}