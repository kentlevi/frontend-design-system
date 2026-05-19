import type { ChallengeApiResponse } from '~/types/challenge/challenge'

export async function fetchChallenges(): Promise<ChallengeApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.get('challenges')
}