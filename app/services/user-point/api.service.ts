import type { TotalUserPointApiResponse, TotalUserPointData } from "~/types/user-point/user-point"

export async function fetchTotalPoints (): Promise<TotalUserPointApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.get<TotalUserPointData>('user-point/points')
}