import { defineStore } from 'pinia'

export interface CategoryIdentity {
    id: number
    name: string
    url_slug: string
    description: string
    sort: number
}

export interface NavigationState {
    categories: CategoryIdentity[]
}

const initialState = (): NavigationState => ({
    categories: []
})

export const useNavigationStore = defineStore('navigation', {
    state: (): NavigationState => initialState(),

    getters: {
        /* @desc sorted categories for navbar */
        sortedCategories: (state): CategoryIdentity[] => {
            return [...state.categories].sort((a, b) => a.sort - b.sort)
        }
    },

    actions: {

        /* @desc store categories from API */
        setCategories(categories: CategoryIdentity[]) {
            this.$patch({
                categories
            })
        },

        /* @desc clear categories */
        clearCategories() {
            this.$patch(initialState())
        }
    }
})