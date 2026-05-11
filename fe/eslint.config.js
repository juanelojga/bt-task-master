import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Prohibited patterns (from AGENTS.md) ──
      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // ── SOLID: Single Responsibility ──
      complexity: ['warn', 10],
      'max-lines': [
        'warn',
        { max: 250, skipBlankLines: true, skipComments: true },
      ],
      'max-lines-per-function': [
        'warn',
        { max: 250, skipBlankLines: true, skipComments: true },
      ],

      // ── SOLID: Interface Segregation (small, focused interfaces) ──
      'max-params': ['warn', 3],
      '@typescript-eslint/no-empty-interface': 'error',

      // ── SOLID: Liskov Substitution & type safety ──
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error',

      // ── Immutability & clean code ──
      'prefer-const': 'error',
      'no-var': 'error',
      'no-else-return': 'error',
      'arrow-body-style': ['error', 'as-needed'],
    },
  },
  // ── Test file overrides: relax some rules for test ergonomics ──
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/test-setup.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'max-params': 'off',
      complexity: 'off',
    },
  },
])
