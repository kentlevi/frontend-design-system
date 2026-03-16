import type { CategoriesResponse } from '~/types/navigation/navgiation'

/**
 * Fetch authenticated user
 */
export async function getProductCategories(): Promise<CategoriesResponse> {
    const { $api } = useNuxtApp()

    return await $api.get('/navigation/categories')
}