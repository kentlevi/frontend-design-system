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

export const headerLocaleOptionConfig: Array<{
    code: 'en' | 'kr';
    flagCode: FlagCode;
    labelKey: string;
}> = [
    { code: 'en', flagCode: 'us', labelKey: 'layout.header.locale.en' },
    { code: 'kr', flagCode: 'kr', labelKey: 'layout.header.locale.kr' },
];

export const headerAccountLinkConfig = [
    {
        labelKey: 'layout.header.accountLinks.profile',
        to: '/account/profile',
        icon: 'light-user',
    },
    {
        labelKey: 'layout.header.accountLinks.addressBook',
        to: '/account/address-book',
        icon: 'light-home',
    },
    {
        labelKey: 'layout.header.accountLinks.orders',
        to: '/account/orders',
        icon: 'light-box-full',
    },
    {
        labelKey: 'layout.header.accountLinks.gallery',
        to: '/account/gallery',
        icon: 'light-image',
    },
    {
        labelKey: 'layout.header.accountLinks.points',
        to: '/account/points',
        icon: 'light-star',
    },
    {
        labelKey: 'layout.header.accountLinks.coupons',
        to: '/account/coupons',
        icon: 'light-ticket',
    },
    {
        labelKey: 'layout.header.accountLinks.reviews',
        to: '/account/reviews',
        icon: 'light-comments',
    },
    {
        labelKey: 'layout.header.accountLinks.quoteRequests',
        to: '/account/quote-requests',
        icon: 'light-file-details',
    },
    {
        labelKey: 'layout.header.accountLinks.gettingStarted',
        to: '/auth/profile',
        icon: 'light-arrow-right',
    },
] as const;
