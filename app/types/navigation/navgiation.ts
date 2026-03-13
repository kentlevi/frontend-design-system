import type { ApiResponse } from '~/types/config/api'

export type CategoriesResponse = ApiResponse<Category[]>

export interface Category {
    id: number
    name: string
    url_slug: string
    description: string
    sort: number
}

export interface Categories {
    categories: Category[]
}