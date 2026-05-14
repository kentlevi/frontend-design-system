import type { ApiResponse } from "../config/api"

export interface TotalUserPointData {
	total_points: number
}

export type TotalUserPointApiResponse = ApiResponse<TotalUserPointData>