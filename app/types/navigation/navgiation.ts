import type { ApiResponse } from '~/types/config/api'

export type CategoriesResponse = ApiResponse<Category[]>

export type ProductsResponse = ApiResponse<Product[]>

export interface Category {
	id: number
	name: string
	url_slug: string
	description: string
	sort: number
}

export interface Product {
	id: number
	name: string
	url_slug: string
}

export interface Categories {
	categories: Category[]
}

export interface Products {
	products: Product[]
}