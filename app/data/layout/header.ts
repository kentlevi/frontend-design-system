import type { ProductCategoryKey } from '~/data/products/catalog';
import type { FlagCode } from '~/data/ui/flags';

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
        labelKey: 'home.header.nav.stickers',
        to: '/stickers',
    },
    {
        key: 'roll',
        labelKey: 'home.header.nav.rollStickers',
        to: '/roll-stickers',
    },
    {
        key: 'sheet',
        labelKey: 'home.header.nav.sheetStickers',
        to: '/sheet-stickers',
    },
] as const;

export const headerLocaleOptionConfig: Array<{
    code: 'en' | 'kr';
    flagCode: FlagCode;
    labelKey: string;
}> = [
    { code: 'en', flagCode: 'us', labelKey: 'home.header.locale.en' },
    { code: 'kr', flagCode: 'kr', labelKey: 'home.header.locale.kr' },
];

export const headerAccountLinkConfig = [
    {
        labelKey: 'home.header.accountLinks.profile',
        to: '/account/profile',
        icon: 'light-user',
    },
    {
        labelKey: 'home.header.accountLinks.addressBook',
        to: '/account/address-book',
        icon: 'light-home',
    },
    {
        labelKey: 'home.header.accountLinks.orders',
        to: '/account/orders',
        icon: 'light-box-full',
    },
    {
        labelKey: 'home.header.accountLinks.gallery',
        to: '/account/gallery',
        icon: 'light-image',
    },
    {
        labelKey: 'home.header.accountLinks.points',
        to: '/account/points',
        icon: 'light-star',
    },
    {
        labelKey: 'home.header.accountLinks.coupons',
        to: '/account/coupons',
        icon: 'light-ticket',
    },
    {
        labelKey: 'home.header.accountLinks.reviews',
        to: '/account/reviews',
        icon: 'light-comments',
    },
    {
        labelKey: 'home.header.accountLinks.quoteRequests',
        to: '/account/quote-requests',
        icon: 'light-file-details',
    },
    {
        labelKey: 'home.header.accountLinks.gettingStarted',
        to: '/auth/profile',
        icon: 'light-arrow-right',
    },
] as const;
