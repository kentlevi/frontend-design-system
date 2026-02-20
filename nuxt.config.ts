// https://nuxt.com/docs/api/configuration/nuxt-config
import { loadAppEnv } from "./config";

loadAppEnv();

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/scripts'
    ],

    imports: {
        dirs: [
            'composables',
            'composables/core',
            'composables/ui'
        ]
    },


    runtimeConfig: {
        ENV     : process.env.ENV,
        app_name: process.env.APP,
        node_env: process.env.NODE_ENV,
        public: {
            ENV           : process.env.ENV,
            app_name      : process.env.APP,
            node_env      : process.env.NODE_ENV,
            app_url       : process.env.APP_URI,
            api_url       : process.env.API_SERVER,
            file_url      : process.env.FILE_URL,
            s3_file_url   : process.env.S3_FILE_URL,
            file_base_url : process.env.FILE_BASE_URL,
            host          : process.env.APP_HOST,
        }
    }
})