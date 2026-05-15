import { fetchTotalPoints } from "~/services/user-point/api.service";
import { useOverviewStore } from "~/stores/users/overview.store";
import { usePointsStore } from "~/stores/user-point/points.store";

export function usePoints() {
	const overview_store = useOverviewStore()
	const { overview } = storeToRefs(overview_store)

	const points_store = usePointsStore()
	const { points_to_use } = storeToRefs(points_store)

	const total_points = ref(0)

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
		points_store.setPointsToUse(String(total_points.value))
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
		if (is_digit && getProjected(e.target as HTMLInputElement, e.key) > total_points.value) {
			e.preventDefault();
			points_to_use.value = String(total_points.value);
		}
	}

	function handlePointsPaste(e: ClipboardEvent) {
		e.preventDefault();
		const input = e.target as HTMLInputElement;
		const digits = e.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
		if (!digits) return;
		input.value = String(Math.min(getProjected(input, digits), total_points.value));
		input.dispatchEvent(new Event('input', { bubbles: true }));
	}

	watch(points_to_use, (val) => {
		const numeric_val = parseInt(val, 10) || 0
		if (numeric_val > total_points.value) {
			points_to_use.value = String(total_points.value)
		}
		points_store.setPointsToUse(points_to_use.value)
	})

	onMounted(() => {
		getTotalPoints()
	})

	return {
		points_to_use,
		total_points,

		handlePointsKeydown,
		handlePointsPaste,
		useAllPoints,
		clearPoints,
	}
}