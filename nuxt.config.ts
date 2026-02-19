export default defineNuxtConfig({
    css: ['~/assets/scss/main.scss'],
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    modules: ['@nuxtjs/i18n'],

    i18n: {
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: false,

        locales: [
            {
                code: 'en',
                name: 'English',
                files: [
                    'en/home.json',
                    'en/search.json',
                    'en/auth.json',
                    'en/account.json',
                    'en/products.json',
                    'en/product-story.json',
                    'en/product-reviews.json',
                    'en/checkout.json',
                ],
            },
            {
                code: 'kr',
                name: 'Korean',
                files: [
                    'kr/home.json',
                    'kr/search.json',
                    'kr/auth.json',
                    'kr/account.json',
                    'kr/products.json',
                    'kr/product-story.json',
                    'kr/product-reviews.json',
                    'kr/checkout.json',
                ],
            },
        ],

        langDir: 'locales/',
    },
});
