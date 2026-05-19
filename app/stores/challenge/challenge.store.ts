import type { Challenge } from '~/types/challenge/challenge'

export const useChallengeStore = defineStore('challenge', () => {
	const challenges = ref<Challenge[]>([])
	const is_loading = ref(false)

	function setChallenges(value: Challenge[]) {
		challenges.value = value
	}

	function setLoading(value: boolean) {
		is_loading.value = value
	}

	function clearChallengeState() {
		challenges.value = []
		is_loading.value = false
	}

	return {
		challenges,
		is_loading,

		setChallenges,
		setLoading,
		clearChallengeState,
	}
})