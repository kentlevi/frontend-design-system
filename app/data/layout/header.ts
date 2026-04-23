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
export const HEADER_SEARCH_DEBOUNCE_DELAY_MS = 500;
export const HEADER_SEARCH_LOADING_MIN_VISIBLE_MS = 300;

export const header_search_categories: ProductCategoryKey[] = [
	'stickers',
	'roll-stickers',
	'sheet-stickers',
];

export const header_nav_link_config = [
	{
		key: 'stickers',
		labelKey: 'layout.header.nav.stickers',
		to: '/stickers',
	},
	{
		key: 'roll',
		labelKey: 'layout.header.nav.homeRollStickers',
		to: '/roll-stickers',
	},
	{
		key: 'sheet',
		labelKey: 'layout.header.nav.sheetStickers',
		to: '/sheet-stickers',
	},
] as const;

export const header_nav_category_label_keys: Record<ProductCategoryKey, string> = {
	stickers: 'layout.header.nav.stickers',
	'roll-stickers': 'layout.header.nav.rollStickers',
	'sheet-stickers': 'layout.header.nav.sheetStickers',
	'vinyl-lettering': 'layout.header.nav.vinylLettering',
};

function titleizeSlug(value: string): string {
	return value
		.split('-')
		.filter(Boolean)
		.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');
}

export function resolveHeaderCategoryLabel(
	category_key: string,
	translate?: (key: string) => string,
	fallback_label = '',
): string {
	const normalized_key = (category_key || '').trim() as ProductCategoryKey;
	const translation_key = header_nav_category_label_keys[normalized_key];

	if (translation_key && translate) {
		const translated_label = translate(translation_key);
		if (translated_label && translated_label !== translation_key) {
			return translated_label;
		}
	}

	return (fallback_label || titleizeSlug(normalized_key)).trim();
}

export function formatCategoryAsNavLink(
	category: CategoryData,
	translate?: (key: string) => string,
): NavLinkItem | null {
	const key = (category.url_slug || '').trim();
	const label = resolveHeaderCategoryLabel(key, translate, (category.name || '').trim());
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

export const header_locale_option_config: Array<{
	code: SupportedCountry;
	flagCode: FlagCode;
	labelKey: string;
}> = [
	{ code: 'us', flagCode: 'us', labelKey: 'layout.header.locale.en' },
	{ code: 'kr', flagCode: 'kr', labelKey: 'layout.header.locale.kr' },
];

export const header_account_link_config = [
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

export const header_checkout_config = {
	title_key: 'layout.header.checkout.title',
	phone: '+1 551 236 4533',
	email: 'info@mustickers.com',
} as const;