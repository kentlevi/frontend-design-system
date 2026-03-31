import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Categories, Category, Product, Products } from '~/types/navigation/navgiation'

/**
 * Initial categories state factory
 */
function initialCategoriesState(): Categories {
	return {
		categories: []
	}
}

/**
 * Initial products state factory
 */
function initialProductsState(): Products {
	return {
		products: []
	}
}

export const useNavigationStore = defineStore('navigation', () => {

	/* --------------------------------------------------------------------------
     * State
     * -------------------------------------------------------------------------- */

	const category_state = ref<Categories>(initialCategoriesState())
	const product_state = ref<Products>(initialProductsState())

	/* --------------------------------------------------------------------------
     * Actions
     * -------------------------------------------------------------------------- */

	function setCategories(categories: Category[]) {
		category_state.value.categories = categories
	}

	function setProducts(products: Product[]) {
		product_state.value.products = products
	}

	function clearCategories() {
		category_state.value = initialCategoriesState()
	}

	function clearProducts() {
		product_state.value = initialProductsState()
	}

	return {
		category_state,
		product_state,

		setCategories,
		setProducts,

		clearCategories,
		clearProducts
	}
})