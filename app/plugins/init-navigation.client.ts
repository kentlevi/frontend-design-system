import { defineNuxtPlugin } from '#app'
import { useNavigationStore } from '@/stores/navigation'

export default defineNuxtPlugin(async (nuxtApp) => {
    interface Category {
        id: number
        name: string
        url_slug: string
        description: string
        sort: number
    }


    const { $api, $pinia } = useNuxtApp()
    const navigationStore = useNavigationStore($pinia)

    try {

        const response = await $api.get<Category[]>('navigation/categories')

        if (!response.success) {
            navigationStore.clearCategories()
            return
        }

        const categories = response.data ?? []

        if (!categories || !categories.length) {
            navigationStore.clearCategories()
            return
        }

        navigationStore.setCategories(categories)

    } catch (error) {

        console.error('Navigation init failed:', error)

        navigationStore.clearCategories()
    }

})