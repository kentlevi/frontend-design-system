import type { ApiResponse } from '~/types/config/api'

export interface Challenge {
	id: number
	code: string
	name: string
	description: string
	reward: string
	is_completed: boolean
	acquired_at: string | null
}

export type ChallengeApiResponse = ApiResponse<Challenge[]>