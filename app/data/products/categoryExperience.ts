import type {
	SizeFeatureCard,
} from '~/types/products/categoryExperience';

export const PRODUCT_SELECTION_NAV_DELAY_MS = 920;

export const size_options = [
	'small30',
	'medium75',
	'large100',
	'extraLarge125',
] as const;

export const quantity_options = [
	10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000,
] as const;

export const size_feature_cards: readonly SizeFeatureCard[] = [
	{
		code: 'small30',
		image: '/icons/custom/size-use-cases/small-helmet.svg',
		desc_key: 'small',
	},
	{
		code: 'medium75',
		image: '/icons/custom/size-use-cases/medium-tumbler.svg',
		desc_key: 'medium',
	},
	{
		code: 'large100',
		image: '/icons/custom/size-use-cases/large-case.svg',
		desc_key: 'large',
	},
	{
		code: 'extraLarge125',
		image: '/icons/custom/size-use-cases/extra-large-cooler.svg',
		desc_key: 'extraLarge',
	},
];