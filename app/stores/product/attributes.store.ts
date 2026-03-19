import { defineStore } from 'pinia'
import type { QuantitySpec } from '~/types/products/attributes';

export const useAttributesStore = defineStore('attributes', () => {
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

	const quantities = ref<QuantitySpec []>([
		{
			nr: 10,
			price: 10
		},
		{
			nr: 50,
			price: 50
		},
		{
			nr: 100,
			price: 100
		},
		{
			nr: 200,
			price: 200
		},
		{
			nr: 300,
			price: 300
		},
		{
			nr: 500,
			price: 500
		},
		{
			nr: 1000,
			price: 1000
		},
		{
			nr: 2000,
			price: 2000
		},
		{
			nr: 5000,
			price: 5000
		},
		{
			nr: 10000,
			price: 10000
		},
	]);


	return {
		sizes,
		quantities,
	}
})