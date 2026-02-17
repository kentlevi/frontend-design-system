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
                files: ['en/home.json', 'en/auth.json', 'en/account.json'],
            },
            {
                code: 'kr',
                name: 'Korean',
                files: ['kr/home.json', 'kr/auth.json', 'kr/account.json'],
            },
        ],

        langDir: 'locales/',
    },
});
