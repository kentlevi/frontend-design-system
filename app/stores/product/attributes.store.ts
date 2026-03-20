import { defineStore } from 'pinia'
import type { ColorSpec, FontSpec, QuantitySpec, SizeSpec } from '~/types/products/attributes';

export const useAttributesStore = defineStore('attributes', () => {
	// const { $api } = useNuxtApp()

	const product_w_color = ref(['transfer-sticker', 'vinyl-lettering'])

	const active_lettering_editor = ref([ 'vinyl-lettering' ])

	const sizes = ref<SizeSpec[]>([
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

	const fonts = ref<FontSpec[]>([
		{ id: 1, name: 'Antique Olive', key: 'antique-olive' },
		{ id: 1, name: 'Helvetica Neue', key: 'helvetica-neue' },
		{ id: 1, name: 'Bebas Neue', key: 'bebas-neue' },
		{ id: 1, name: 'Brush Script', key: 'brush-script' },
	])

	const colors = ref<ColorSpec []>([
		{ id: 1, key: 'black', name: 'Black', code: '#ffffff', swatch_style: { background: '#000000' } },
		{ id: 2, key: 'white', name: 'White', code: '#111827', swatch_style: { background: '#FFFFFF', border: '1px solid var(--black-base)' } },
		{ id: 3, key: 'red', name: 'Red', code: '#ffffff', swatch_style: { background: '#FF0000' } },
		{ id: 4, key: 'orange', name: 'Orange', code: '#ffffff', swatch_style: { background: '#FFA500' } },
		{ id: 5, key: 'yellow', name: 'Yellow', code: '#111827', swatch_style: { background: '#FFFF00' } },
		{ id: 6, key: 'green', name: 'Green', code: '#ffffff', swatch_style: { background: '#008000' } },
		{ id: 7, key: 'blue', name: 'Blue', code: '#ffffff', swatch_style: { background: '#0000FF' } },
		{ id: 8, key: 'purple', name: 'Purple', code: '#ffffff', swatch_style: { background: '#800080' } },
		{ id: 9, key: 'pink', name: 'Pink', code: '#111827', swatch_style: { background: '#FFC0CB' } },
		{ id: 10, key: 'yellow-orange', name: 'Yellow Orange', code: '#111827', swatch_style: { background: '#FFB700' } },
		{ id: 11, key: 'gold', name: 'Gold', code: '#111827', swatch_style: { background: 'linear-gradient(135deg, #FFD700 0%, #FFF 50%, #FFD700 100%)' } },
		{ id: 12, key: 'silver', name: 'Silver', code: '#111827', swatch_style: { background: 'linear-gradient(135deg, #C0C0C0 0%, #FFF 50%, #C0C0C0 100%)' } },
		{ id: 13, key: 'bronze', name: 'Bronze', code: '#111827', swatch_style: { background: 'linear-gradient(135deg, #CD7F32 0%, #FFF 49.52%, #CD7F32 100%)' } },
		{ id: 14, key: 'hologram', name: 'Hologram', code: '#111827', swatch_style: { background: 'linear-gradient(135deg, #B6EEE8 0%, #F5F3EA 32%, #F1B2B9 50%, #D893C1 60%, #B6EEE8 80%)' } },
		{
			id: 15,
			key: 'full-color',
			name: 'Full Color',
			code: '#111827',
			swatch_style: {
				background: 'conic-gradient(from 0deg, #ff3c3c 0deg, #ff9800 60deg, #ffe600 120deg, #1abf48 180deg, #0085ff 240deg, #7f2cff 300deg, #ff3c3c 360deg)',
			},
		}
	])


	return {
		sizes,
		quantities,
		fonts,
		colors,
		product_w_color,
		active_lettering_editor,
	}
})