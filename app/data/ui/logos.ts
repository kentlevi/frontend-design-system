export const logos = [
	'allstickerprinting',
	'glophics',
	'musticker',
	'ozstickerprinting',
	'singaprinting',
	'stickercanada',
	'stickerdot',
	'stickerjapan',
	'stickermarket',
	'stikchi',
] as const;

export const logoVariants = ['full', 'mark'] as const;
export const logoColors = ['colored', 'white'] as const;

export type LogoName = (typeof logos)[number];