// https://nuxt.com/docs/api/configuration/nuxt-config
import { loadAppEnv } from './config';
import { i18nLocales } from './i18n/locales.config';

process.env.ENV = process.env.ENV || 'development';
loadAppEnv();


export default defineNuxtConfig({
	app: {
		head: {
			link: [
				// Preload the Latin Pretendard subset (small, used on every page for digits, brand
				// names, currency, etc.). The Korean subset is fetched lazily via unicode-range
				// only when Hangul glyphs appear on the page.
				{
					rel: 'preload',
					href: '/fonts/PretendardVariable.latin.woff2',
					as: 'font',
					type: 'font/woff2',
					crossorigin: 'anonymous',
				},
			],
		},
	},
	css: [],
	compatibilityDate: '2025-07-15',
	devtools: {
		enabled: true,

		timeline: {
			enabled: true,
		},
	},
	// debug: process.env.ENV == 'homestead',
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
			api_url: process.env.API_BASE+'sys',
			file_url: process.env.FILE_URL,
			s3_file_url: process.env.S3_FILE_URL,
			file_base_url: process.env.FILE_BASE_URL,
			host: process.env.APP_HOST,
			api_base: process.env.API_BASE,
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
						warning.code === 'EVAL'
						&& typeof warning.id === 'string'
						&& warning.id.includes('lottie-web/build/player/lottie.js')
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
		optimizeDeps: {
			include: ['lodash-es']
		}
	},

	routeRules: {
		// Content pages — `[country]` URL segment encodes locale (kr/us), so SWR is safe.
		// Product category landings and product detail pages — content changes rarely.
		'/*/stickers/**': { swr: 3600 },
		'/*/roll-stickers/**': { swr: 3600 },
		'/*/sheet-stickers/**': { swr: 3600 },
		'/*/vinyl-lettering/**': { swr: 3600 },

		// Country home pages — shorter SWR window since promos may change.
		'/kr': { swr: 600 },
		'/us': { swr: 600 },

		// Static legal/info pages — change very rarely.
		'/*/privacy-policy': { swr: 86400 },
		'/*/terms-of-use': { swr: 86400 },
		'/*/under-construction': { swr: 86400 },

		// User-specific routes — never cache.
		'/*/account/**': { headers: { 'cache-control': 'private, no-store' } },
		'/*/cart/**': { headers: { 'cache-control': 'private, no-store' } },
		'/*/checkout/**': { headers: { 'cache-control': 'private, no-store' } },
		'/*/orders/**': { headers: { 'cache-control': 'private, no-store' } },
		'/*/order-items/**': { headers: { 'cache-control': 'private, no-store' } },
		'/*/auth/**': { headers: { 'cache-control': 'private, no-store' } },

		// Long-cache for public folder assets (icons + images + illustrations + fonts served verbatim).
		'/icons/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
		'/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
		'/illustrations/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
		'/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
	},

	modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@pinia/nuxt', '@nuxtjs/i18n', '@pinia-plugin-persistedstate/nuxt'],

	i18n: {
		defaultLocale: 'kr',
		strategy: 'no_prefix',
		detectBrowserLanguage: false,

		locales: i18nLocales,

		langDir: 'locales/',
	},
});