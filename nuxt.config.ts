// https://nuxt.com/docs/api/configuration/nuxt-config
import { loadAppEnv } from './config';

process.env.ENV = process.env.ENV || 'development';
loadAppEnv();

export default defineNuxtConfig({
    css: [],
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    imports: {
        dirs: ['composables', 'composables/core', 'composables/ui'],
    },
    runtimeConfig: {
        ENV: process.env.ENV,
        app_name: process.env.APP,
        node_env: process.env.NODE_ENV,
        public: {
            ENV: process.env.ENV,
            app_name: process.env.APP,
            node_env: process.env.NODE_ENV,
            app_url: process.env.APP_URI,
            api_url: process.env.API_SERVER,
            file_url: process.env.FILE_URL,
            s3_file_url: process.env.S3_FILE_URL,
            file_base_url: process.env.FILE_BASE_URL,
            host: process.env.APP_HOST,
            webVitalsEnabled: true,
            webVitalsDebug: false,
            webVitalsEndpoint: '/api/web-vitals',
            apiBase:
                process.env.NUXT_PUBLIC_API_BASE ||
                process.env.API_SERVER ||
                'http://127.0.0.1:8001/sys',
        },
    },
    vite: {
        server: {
            allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev'],
        },
        build: {
            rollupOptions: {
                onwarn(warning, warn) {
                    if (
                        warning.code === 'EVAL' &&
                        typeof warning.id === 'string' &&
                        warning.id.includes('lottie-web/build/player/lottie.js')
                    ) {
                        return;
                    }
                    warn(warning);
                },
            },
        },
        css: {
            devSourcemap: false,
        },
    },

    modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@pinia/nuxt', '@nuxtjs/i18n'],

    i18n: {
        defaultLocale: 'en',
        strategy: 'no_prefix',
        detectBrowserLanguage: false,

        locales: [
            {
                code: 'en',
                name: 'English',
                files: [
                    'en/layout/header/base.json',
                    'en/layout/header/accountLinks.json',
                    'en/layout/header/nav.json',
                    'en/layout/header/locale.json',
                    'en/layout/footer.json',
                    'en/home/seo.json',
                    'en/home/hero.json',
                    'en/home/toast.json',
                    'en/home/productTypes.json',
                    'en/home/feature.json',
                    'en/home/reviews.json',
                    'en/home/guarantees.json',
                    'en/home/cta.json',
                    'en/layout/header/search.json',
                    'en/auth/login.json',
                    'en/auth/verification.json',
                    'en/auth/guestVerification.json',
                    'en/auth/reset.json',
                    'en/auth/callback.json',
                    'en/auth/register.json',
                    'en/auth/profile.json',
                    'en/account/shell.json',
                    'en/account/addressBook.json',
                    'en/account/coupons.json',
                    'en/account/gallery.json',
                    'en/account/profile.json',
                    'en/account/orders.json',
                    'en/account/points.json',
                    'en/account/reviews.json',
                    'en/account/quoteRequests.json',
                    'en/product/guarantees.json',
                    'en/product/productDetails.json',
                    'en/product/products.json',
                    'en/product/story.json',
                    'en/product/reviews.json',
                    'en/cart/uploadArtwork.json',
                    'en/cart/cartPreview.json',
                    'en/cart/cartPage.json',
                    'en/checkout/guest.json',
                ],
            },
            {
                code: 'kr',
                name: 'Korean',
                files: [
                    'kr/layout/header/base.json',
                    'kr/layout/header/accountLinks.json',
                    'kr/layout/header/nav.json',
                    'kr/layout/header/locale.json',
                    'kr/layout/footer.json',
                    'kr/home/seo.json',
                    'kr/home/hero.json',
                    'kr/home/toast.json',
                    'kr/home/productTypes.json',
                    'kr/home/feature.json',
                    'kr/home/reviews.json',
                    'kr/home/guarantees.json',
                    'kr/home/cta.json',
                    'kr/layout/header/search.json',
                    'kr/auth/login.json',
                    'kr/auth/verification.json',
                    'kr/auth/guestVerification.json',
                    'kr/auth/reset.json',
                    'kr/auth/callback.json',
                    'kr/auth/register.json',
                    'kr/auth/profile.json',
                    'kr/account/shell.json',
                    'kr/account/addressBook.json',
                    'kr/account/coupons.json',
                    'kr/account/gallery.json',
                    'kr/account/profile.json',
                    'kr/account/orders.json',
                    'kr/account/points.json',
                    'kr/account/reviews.json',
                    'kr/account/quoteRequests.json',
                    'kr/product/guarantees.json',
                    'kr/product/productDetails.json',
                    'kr/product/products.json',
                    'kr/product/story.json',
                    'kr/product/reviews.json',
                    'kr/cart/uploadArtwork.json',
                    'kr/cart/cartPreview.json',
                    'kr/cart/cartPage.json',
                    'kr/checkout/guest.json',
                ],
            },
        ],

        langDir: 'locales/',
    },
});
