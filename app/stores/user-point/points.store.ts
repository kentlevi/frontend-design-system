export const usePointsStore = defineStore('points', () => {
	const points_to_use = ref('')

	function setPointsToUse(value: string) {
		points_to_use.value = value
	}

	function clearPointsToUse() {
		points_to_use.value = ''
	}

	return {
		points_to_use,
		setPointsToUse,
		clearPointsToUse,
	}
})