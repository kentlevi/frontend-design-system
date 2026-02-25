// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'

export default withNuxt({
	plugins: {
		'@stylistic': stylistic
	},
	rules: {
		'vue/no-multiple-template-root': 'off',
		'vue/max-attributes-per-line': ['error', { singleline: 3 }],
		'@stylistic/indent': ['error', 'tab'],
		'vue/html-indent': ['error', 'tab'],
		'@stylistic/no-tabs': 'off',
		'no-unused-vars': 'error',
		'eol-last': ['error', 'never'],
		'no-trailing-spaces': 'error'
	}
})