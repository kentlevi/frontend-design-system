export type HomeProductKey = 'dieCut' | 'dieCutRoll' | 'sheet' | 'hologram' | 'vinyl';

export type HomeProductType = {
	key: HomeProductKey;
	productId: number;
	image: string;
	to: string;
	name: string;
};