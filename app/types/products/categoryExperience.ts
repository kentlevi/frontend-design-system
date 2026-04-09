export type SizeOptionKey =
	| 'small30'
	| 'medium75'
	| 'large100'
	| 'extraLarge125';

export type SizeFeatureCard = {
	key: SizeOptionKey;
	image: string;
	descriptionKey: 'small' | 'medium' | 'large' | 'extraLarge';
};