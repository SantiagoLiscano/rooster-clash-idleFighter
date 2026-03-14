import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      '.gemini',
      'eslint.config.js',
    ],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs', '*.cjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
      'jsx-a11y': jsxA11y,
      'eslint-comments': eslintComments,
      import: importPlugin,
      security: security,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // 🧠 TypeScript Enhancements
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'warn',
        {
          name: 'react-redux',
          importNames: ['useSelector', 'useDispatch'],
          message: '⚠️ Use typed hooks: `useAppDispatch` and `useAppSelector`.',
        },
      ],

      // ⚛️ React Rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/prop-types': 'off', // Disable prop-types since we're using TypeScript
      'react/jsx-no-target-blank': 'error',
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],

      // 🔒 Security & Comments
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-disable': 'warn',
      'security/detect-object-injection': 'off',

      // 🖨️ Console Usage
      'no-console': 'warn',

      // 🧹 Unused Imports
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // 🧱 Import Sorting
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^@?\\w', '^\\u0000'],
            ['^.+\\.s?css$'],
            ['^@/lib', '^@/hooks'],
            ['^@/data'],
            ['^@/components', '^@/container'],
            ['^@/store'],
            ['^@/'],
            [
              '^\\./?$',
              '^\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\.\\.(?!/?$)',
              '^\\.\\./\\.\\./?$',
              '^\\.\\./\\.\\.(?!/?$)',
              '^\\.\\./\\.\\./\\.\\./?$',
              '^\\.\\./\\.\\./\\.\\.(?!/?$)',
            ],
            ['^@/types'],
            ['^'],
          ],
        },
      ],
    },
  },
  {
    files: ['vite.config.ts', 'vite.config.mts', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
);
