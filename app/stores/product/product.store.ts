import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', () => {
	// const { $api } = useNuxtApp()

	const sizes = ref([
		{
			id: 1,
			width: 30,
			height: 30,
			label: 'Small'
		},
		{
			id: 2,
			width: 75,
			height: 75,
			label: 'Medium'
		},
		{
			id: 3,
			width: 100,
			height: 100,
			label: 'Large'
		},
		{
			id: 4,
			width: 125,
			height: 125,
			label: 'Extra'
		}
	])

	const quantities = ref([
		10,
		50,
		100,
		200,
		300,
		500,
		1000,
		2000,
		5000,
		10000
	]);

	return {
		sizes,
		quantities,
	}
})