// @ts-check
import withNuxt from './node_modules/.cache/nuxt/.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-restricted-syntax': ['error',
        {
          selector: "VariableDeclarator[id.type='Identifier'][id.name=/[A-Z]/][init.type='CallExpression'][init.callee.name='computed']",
          message: 'Computed declarations must use lower_snake_case.'
        }
      ],
    },
  },
)
