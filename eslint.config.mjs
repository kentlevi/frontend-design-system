// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'

// Cast to any to satisfy TypeScript
const stylisticPlugin = /** @type {any} */ (stylistic)


export default withNuxt({
	plugins: {
		'@stylistic': stylisticPlugin
	},
	rules: {
		'vue/no-multiple-template-root': 'off',
		'@stylistic/indent': ['error', 'tab'],
		'vue/html-indent': ['error', 'tab'],
		'@stylistic/no-tabs': 'off',
		'no-unused-vars': 'error',
		'eol-last': ['error', 'never'],
		'no-trailing-spaces': 'error'
	}
})