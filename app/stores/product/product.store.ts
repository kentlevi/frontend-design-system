import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', () => {
	// const { $api } = useNuxtApp()

	const sizes = ref([
		{
			id: 1,
			width: 35,
			height: 35,
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

	const shipping_fee = ref('$45')

	// 📌 Percentage of discount
	const discount_perce = ref('-7%')

	// 📌Discounted price
	const discounted_price = ref()

	// 📌Actual Price
	const price = ref(0)

	return {
		sizes,
		quantities,
		shipping_fee,
		discount_perce,
		discounted_price,
		price,
	}
})