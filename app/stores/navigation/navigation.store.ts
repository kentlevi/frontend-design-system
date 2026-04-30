import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Categories, Category, Product } from '~/types/navigation/navgiation'
/**
 * Initial categories state factory
 */
function initialCategoriesState(): Categories {
	return {
		categories: []
	}
}

export const useNavigationStore = defineStore('navigation', () => {
	/* --------------------------------------------------------------------------
     * State
     * -------------------------------------------------------------------------- */

	const category_state = ref<Categories>(initialCategoriesState())
	const product_state = ref<Record<string, Product[]>>({})
	const selected_product_id = ref<number | null>(null)

	/* --------------------------------------------------------------------------
     * Setters
     * -------------------------------------------------------------------------- */

	function setSelectedProductId(id: number) {
		selected_product_id.value = id
	}

	function setCategories(categories: Category[]) {
		category_state.value.categories = categories
	}

	function setProducts(url_slug: string, products: Product[]) {
		product_state.value[url_slug] = products
	}

	function clearCategories() {
		category_state.value = initialCategoriesState()
	}

	function clearProducts() {
		product_state.value = {}
	}

	return {
		category_state,
		product_state,
		selected_product_id,

		setSelectedProductId,
		setCategories,
		setProducts,

		clearCategories,
		clearProducts
	}
})