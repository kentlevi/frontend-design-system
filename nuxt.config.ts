// https://nuxt.com/docs/api/configuration/nuxt-config
import { loadAppEnv } from './config';
import { i18nLocales } from './i18n/locales.config';

process.env.ENV = process.env.ENV || 'development';
loadAppEnv();


export default defineNuxtConfig({
	css: [],
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
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
		defaultLocale: 'us',
		strategy: 'no_prefix',
		detectBrowserLanguage: false,

		locales: i18nLocales,

		langDir: 'locales/',
	},
});