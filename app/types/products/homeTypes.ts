export type HomeProductKey = 'dieCut' | 'dieCutRoll' | 'sheet' | 'hologram' | 'vinyl';

export type HomeProductType = {
	key: HomeProductKey;
	productId: string;
	image: string;
	to: string;
};