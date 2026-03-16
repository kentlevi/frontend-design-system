import type {
	ApiClient,
	CategoryData,
	NavLinkItem,
	ProductCategoriesResponse,
} from '~/types/layout/header';
import type { ProductCategoryKey } from '~/types/products/catalog';
import type { FlagCode } from '~/data/ui/flags';
import type { SupportedCountry } from '~/constants/countries';

export const HEADER_MAX_RECENT_SEARCHES = 5;
export const HEADER_SEARCH_DEBOUNCE_DELAY_MS = 480;
export const HEADER_SEARCH_LOADING_MIN_VISIBLE_MS = 300;

export const headerSearchCategories: ProductCategoryKey[] = [
	'stickers',
	'roll-stickers',
	'sheet-stickers',
];

export const headerNavLinkConfig = [
	{
		key: 'stickers',
		labelKey: 'layout.header.nav.stickers',
		to: '/stickers',
	},
	{
		key: 'roll',
		labelKey: 'layout.header.nav.rollStickers',
		to: '/roll-stickers',
	},
	{
		key: 'sheet',
		labelKey: 'layout.header.nav.sheetStickers',
		to: '/sheet-stickers',
	},
] as const;

export function formatCategoryAsNavLink(category: CategoryData): NavLinkItem | null {
	const key = (category.url_slug || '').trim();
	const label = (category.name || '').trim();
	const to = key ? `/${key}` : '';

	if (!key || !label || !to) return null;

	return { key, label, to };
}

export async function fetchNavigationCategories(
	api: ApiClient,
	country: string
): Promise<CategoryData[]> {
	try {
		const endpoint = `/${String(country)}/navigation/categories`;
		const response = await api<ProductCategoriesResponse>(endpoint);

		if (!response?.success || !Array.isArray(response.data)) {
			return [];
		}

		return response.data;
	} catch {
		return [];
	}
}

export const headerLocaleOptionConfig: Array<{
	code: SupportedCountry;
	flagCode: FlagCode;
	labelKey: string;
}> = [
	{ code: 'us', flagCode: 'us', labelKey: 'layout.header.locale.en' },
	{ code: 'kr', flagCode: 'kr', labelKey: 'layout.header.locale.kr' },
];

export const headerAccountLinkConfig = [
	{
		labelKey: 'layout.header.accountLinks.profile',
		to: '/account/profile',
		icon: 'strong-user',
	},
	{
		labelKey: 'layout.header.accountLinks.addressBook',
		to: '/account/address-book',
		icon: 'strong-home',
	},
	{
		labelKey: 'layout.header.accountLinks.orders',
		to: '/account/orders',
		icon: 'strong-boxes-full',
	},
	{
		labelKey: 'layout.header.accountLinks.gallery',
		to: '/account/gallery',
		icon: 'regular-image',
	},
	{
		labelKey: 'layout.header.accountLinks.points',
		to: '/account/points',
		icon: 'strong-star',
	},
	{
		labelKey: 'layout.header.accountLinks.coupons',
		to: '/account/coupons',
		icon: 'strong-ticket',
	},
	{
		labelKey: 'layout.header.accountLinks.reviews',
		to: '/account/reviews',
		icon: 'strong-comments',
	},
	{
		labelKey: 'layout.header.accountLinks.quoteRequests',
		to: '/account/quote-requests',
		icon: 'strong-file-details',
	},
	{
		labelKey: 'layout.header.accountLinks.gettingStarted',
		to: '/auth/profile',
		icon: 'strong-flag',
	},
] as const;

export const headerCheckoutConfig = {
	title: 'Secure Checkout',
	phone: '+1 551 236 4533',
	email: 'info@mustickers.com',
} as const;