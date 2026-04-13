// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from '@typescript-eslint/eslint-plugin'

const stylistic_plugin = /** @type {any} */ (stylistic)
const ts_plugin = /** @type {any} */ (tseslint)

const base_naming_rules = [
	{
		selector: 'default',
		format: null,
		leadingUnderscore: 'allow',
		trailingUnderscore: 'allow'
	},
	{
		selector: ['parameter', 'variable'],
		format: ['snake_case', 'camelCase', 'PascalCase', 'UPPER_CASE'],
		leadingUnderscore: 'allow',
	},
	{
		selector: 'function',
		format: ['camelCase'],
		leadingUnderscore: 'allow'
	},
	{
		selector: ['classMethod', 'objectLiteralMethod', 'typeMethod', 'accessor'],
		format: ['camelCase'],
		leadingUnderscore: 'allow'
	},
	{
		selector: ['property', 'objectLiteralProperty', 'typeProperty'],
		modifiers: ['requiresQuotes'],
		format: null
	}
]

export default withNuxt(
	{
		plugins: {
			'@stylistic': stylistic_plugin,
			'@typescript-eslint': ts_plugin
		},
		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx', '.vue']
			},
			'import/resolver': {
				alias: {
					map: [
						['~', './app'],
						['@', './app'],
						['~~', '.'],
						['@@', '.']
					],
					extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.d.ts', '.vue']
				},
				typescript: {
					project: ['./tsconfig.json', './.nuxt/tsconfig.app.json']
				},
				node: {
					extensions: ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.d.ts', '.vue']
				}
			}
		},
		rules: {
			'vue/no-multiple-template-root': 'off',
			'vue/multi-word-component-names': 'off',
			'@stylistic/indent': ['error', 'tab'],
			'vue/html-indent': ['error', 'tab'],
			'@stylistic/no-tabs': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_'
			}],
			'@typescript-eslint/unified-signatures': 'off',
			'@typescript-eslint/naming-convention': ['error', ...base_naming_rules],
			'import/no-duplicates': 'error',
			'no-restricted-syntax': ['error',
				{
					selector: "VariableDeclarator[id.type='Identifier'][id.name=/[A-Z]/][init.type='CallExpression'][init.callee.name='computed']",
					message: 'Computed declarations must use lower_snake_case.'
				}
			],
			'eol-last': ['error', 'never'],
			'no-trailing-spaces': 'error'
		}
	},
	{
		files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
		rules: {
			'@typescript-eslint/naming-convention': 'off'
		}
	},
	{
		files: ['composables/**/*.{js,ts,mjs,cjs}'],
		rules: {
			'@typescript-eslint/naming-convention': [
				'error',
				...base_naming_rules,
				{
					selector: 'function',
					format: ['camelCase'],
					custom: {
						regex: '^use[A-Z][A-Za-z0-9]*$',
						match: true
					}
				}
			],
			'import/no-default-export': 'error'
		}
	},
	{
		files: [
			'nuxt.config.{js,ts,mjs,cjs}',
			'app.config.{js,ts,mjs,cjs}',
			'config/**/*.{js,ts,mjs,cjs}',
			'constants/**/*.{js,ts,mjs,cjs}',
			'**/*.d.ts'
		],
		rules: {
			'@typescript-eslint/naming-convention': [
				'error',
				...base_naming_rules,
				{
					selector: 'variable',
					modifiers: ['const'],
					format: ['UPPER_CASE']
				},
				{
					selector: ['property', 'typeProperty'],
					filter: {
						regex: '^[A-Z0-9_]+$',
						match: true
					},
					format: ['UPPER_CASE']
				}
			]
		}
	}
)
