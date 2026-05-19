import { storeToRefs } from 'pinia'
import { useChallengeStore } from '~/stores/challenge/challenge.store'
import { fetchChallenges } from './api.service'

export function useGetChallenges() {
	const challenge_store = useChallengeStore()
	const { challenges, is_loading } = storeToRefs(challenge_store)
	const { setChallenges, setLoading } = challenge_store

	async function getChallenges() {
		setLoading(true)

		try {
			const response = await fetchChallenges()

			setChallenges(response?.data ?? [])
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return {
		challenges,
		is_loading,
		getChallenges,
	}
}