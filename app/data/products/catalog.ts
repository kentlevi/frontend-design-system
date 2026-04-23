import type {
	ProductCategory,
	ProductCategoryKey,
} from '~/types/products/catalog';

const commonBlurb =
	'Premium print quality with clean edges and durable adhesive for daily use.';

export const productCatalog: Record<ProductCategoryKey, ProductCategory> = {
	stickers: {
		key: 'stickers',
		title: 'Stickers',
		defaultProductId: 'die-cut-sticker',
		products: [
			{ id: 'die-cut-sticker', name: 'Die Cut Sticker', icon: 'strong-star', image: '/illustrations/products/stickers/die-cut.svg', blurb: commonBlurb },
			{ id: 'circle-sticker', name: 'Round Stickers', icon: 'strong-stars', image: '/illustrations/products/stickers/circle.svg', blurb: commonBlurb },
			{ id: 'rectangle-sticker', name: 'Rectangular Stickers', icon: 'strong-shield', image: '/illustrations/products/stickers/rectangle.svg', blurb: commonBlurb },
			{ id: 'square-sticker', name: 'Square Stickers', icon: 'strong-shield', image: '/illustrations/products/stickers/square.svg', blurb: commonBlurb },
			{ id: 'oval-sticker', name: 'Oval Stickers', icon: 'strong-stars', image: '/illustrations/products/stickers/oval.svg', blurb: commonBlurb },
			{ id: 'rounded-sticker', name: 'Rounded Square Stickers', icon: 'strong-star', image: '/illustrations/products/stickers/rounded.svg', blurb: commonBlurb },
			{ id: 'kiss-cut-sticker', name: 'Kiss Cut Stickers', icon: 'strong-truck', image: '/illustrations/products/stickers/kiss-cut.svg', blurb: commonBlurb },
			{ id: 'sticker-sheet', name: 'Sticker Sheets', icon: 'strong-shield', image: '/illustrations/products/stickers/sheet.svg', blurb: commonBlurb },
			{ id: 'clear-sticker', name: 'Clear Stickers', icon: 'strong-stars', image: '/illustrations/products/stickers/clear.svg', blurb: commonBlurb },
			{ id: 'hologram-sticker', name: 'Hologram Stickers', icon: 'strong-stars', image: '/illustrations/products/stickers/hologram.svg', blurb: commonBlurb },
			{ id: 'transfer-sticker', name: 'Transfer Stickers', icon: 'strong-truck', image: '/illustrations/products/stickers/transfer.svg', blurb: commonBlurb },
			{ id: 'vinyl-lettering', name: 'Vinyl Lettering', icon: 'strong-ship', image: '/illustrations/products/stickers/vinyl-lettering.svg', blurb: commonBlurb },
		],
	},
	'roll-stickers': {
		key: 'roll-stickers',
		title: 'Roll Stickers',
		defaultProductId: 'die-cut-roll',
		products: [
			{ id: 'die-cut-roll', name: 'Die Cut Roll Stickers', icon: 'strong-ship', image: '/illustrations/products/roll-stickers/die-cut-labels.svg', blurb: commonBlurb },
			{ id: 'clear-roll', name: 'Clear Roll Stickers', icon: 'strong-ship', image: '/illustrations/products/roll-stickers/clear-labels.svg', blurb: commonBlurb },
			{ id: 'circle-roll', name: 'Circle Roll Stickers', icon: 'strong-stars', image: '/illustrations/products/roll-stickers/circle-labels.svg', blurb: commonBlurb },
			{ id: 'square-roll', name: 'Square Roll Stickers', icon: 'strong-shield', image: '/illustrations/products/roll-stickers/square-labels.svg', blurb: commonBlurb },
			{ id: 'rectangle-roll', name: 'Rectangle Roll Stickers', icon: 'strong-shield', image: '/illustrations/products/roll-stickers/rectangle-labels.svg', blurb: commonBlurb },
			{ id: 'rounded-roll', name: 'Rounded Roll Stickers', icon: 'strong-star', image: '/illustrations/products/roll-stickers/rounded-labels.svg', blurb: commonBlurb },
			{ id: 'oval-roll', name: 'Oval Roll Stickers', icon: 'strong-stars', image: '/illustrations/products/roll-stickers/oval-labels.svg', blurb: commonBlurb },
			{ id: 'paper-roll', name: 'Paper Roll Stickers', icon: 'strong-truck', image: '/illustrations/products/roll-stickers/paper-labels.svg', blurb: commonBlurb },
		],
	},
	'sheet-stickers': {
		key: 'sheet-stickers',
		title: 'Sheet Stickers',
		defaultProductId: 'die-cut-sheet',
		products: [
			{ id: 'die-cut-sheet', name: 'Die Cut Sheet Stickers', icon: 'strong-shield', image: '/illustrations/products/sheet-stickers/die-cut-sheet.svg', blurb: commonBlurb },
			{ id: 'circle-sheet', name: 'Circle Sheet Stickers', icon: 'strong-stars', image: '/illustrations/products/sheet-stickers/circle-sheet.svg', blurb: commonBlurb },
			{ id: 'oval-sheet', name: 'Oval Sheet Stickers', icon: 'strong-stars', image: '/illustrations/products/sheet-stickers/oval-sheet.svg', blurb: commonBlurb },
			{ id: 'square-sheet', name: 'Square Sheet Stickers', icon: 'strong-shield', image: '/illustrations/products/sheet-stickers/square-sheet.svg', blurb: commonBlurb },
			{ id: 'rectangle-sheet', name: 'Rectangle Sheet Stickers', icon: 'strong-shield', image: '/illustrations/products/sheet-stickers/rectangle-sheet.svg', blurb: commonBlurb },
			{ id: 'rounded-sheet', name: 'Rounded Corner Sheet Stickers', icon: 'strong-star', image: '/illustrations/products/sheet-stickers/rounded-sheet.svg', blurb: commonBlurb },
		],
	},
	'vinyl-lettering': {
		key: 'vinyl-lettering',
		title: 'Vinyl Lettering',
		defaultProductId: 'custom-lettering',
		products: [
			{ id: 'custom-lettering', name: 'Custom Lettering', icon: 'strong-ship', image: '/illustrations/products/stickers/vinyl-lettering.svg', blurb: commonBlurb },
		],
	},
};