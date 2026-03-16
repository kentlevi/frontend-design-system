import type {
	SizeFeatureCard,
} from '~/types/products/categoryExperience';

export const PRODUCT_SELECTION_NAV_DELAY_MS = 920;

export const sizeOptions = [
	'small30',
	'medium75',
	'large100',
	'extraLarge125',
] as const;

export const quantityOptions = [
	10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000,
] as const;

export const sizeFeatureCards: readonly SizeFeatureCard[] = [
	{
		key: 'small30',
		image: '/icons/custom/size-use-cases/small-helmet.svg',
		descriptionKey: 'small',
	},
	{
		key: 'medium75',
		image: '/icons/custom/size-use-cases/medium-tumbler.svg',
		descriptionKey: 'medium',
	},
	{
		key: 'large100',
		image: '/icons/custom/size-use-cases/large-case.svg',
		descriptionKey: 'large',
	},
	{
		key: 'extraLarge125',
		image: '/icons/custom/size-use-cases/extra-large-cooler.svg',
		descriptionKey: 'extraLarge',
	},
];