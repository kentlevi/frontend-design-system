import { useNavigationStore } from '@/stores/navigation'
import { getProductCategories } from '~/services/navigation/navigation.service'

export function useNavigation() {
    const navigationStore = useNavigationStore()

    /**
     * Fetch navigation categories from API and store them
     */
    async function fetchAndStoreCategories(): Promise<boolean> {
        try {
            const response = await getProductCategories()
            const categories = response.data

            if (!categories || categories.length === 0) {
                navigationStore?.clearCategories()
                return false
            }

            navigationStore.setCategories(categories)
            return true
        } catch (err) {
            console.error('Navigation fetch failed:', err)
            navigationStore?.clearCategories()
            return false
        }
    }

    return {
        fetchAndStoreCategories
    }
}