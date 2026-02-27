import { defineConfig } from 'eslint/config';
import eslintConfigSeek from 'eslint-config-seek';

export default defineConfig([
  ...eslintConfigSeek,
  {
    rules: {
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '*.css',
              group: 'index',
              position: 'after',
              patternOptions: { matchBase: true },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['bin/**/*.cjs', 'lib/**/*.js'],
    rules: {
      'no-console': 0,
      'no-process-exit': 0,
    },
  },
  /** Should feed back upstream to eslint-config-seek */
  {
    files: ['cypress/**/*.cy.{js,ts}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name='it'][callee.property.name='only']",
          message: 'Focused tests with it.only() are not allowed',
        },
        {
          selector:
            "CallExpression[callee.object.name='describe'][callee.property.name='only']",
          message: 'Focused tests with describe.only() are not allowed',
        },
        {
          selector:
            "CallExpression[callee.object.name='context'][callee.property.name='only']",
          message: 'Focused tests with context.only() are not allowed',
        },
      ],
    },
  },
  {
    ignores: ['**/dist'],
  },
  {
    languageOptions: {
      globals: {
        __PLAYROOM_GLOBAL__CONFIG__: true,
        __PLAYROOM_GLOBAL__STATIC_TYPES__: true,
      },
    },
  },
]);
