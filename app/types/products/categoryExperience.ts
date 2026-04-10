export type SizeOptionKey =
	| 'small30'
	| 'medium75'
	| 'large100'
	| 'extraLarge125';

export type SizeFeatureCard = {
	code: SizeOptionKey;
	image: string;
	desc_key: 'small' | 'medium' | 'large' | 'extraLarge';
};