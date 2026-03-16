import { defineStore } from 'pinia'
import type { Categories, Category } from '~/types/navigation/navgiation'

const initialState = (): Categories => ({
	categories: []
})

export const useNavigationStore = defineStore('navigation', {
	state: (): Categories => initialState(),

	getters: {
		/* @desc sorted categories for navbar */
		sortedCategories: (state): Category[] => {
			return [...state.categories].sort((a, b) => a.sort - b.sort)
		}
	},

	actions: {

		/* @desc store categories from API */
		setCategories(categories: Category[]) {
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