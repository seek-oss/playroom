import { defineConfig } from 'eslint/config';
import eslintConfigSeek from 'eslint-config-seek/vitest';

const editorUserCodeRestrictions = {
  paths: [
    '__PLAYROOM_ALIAS__THEMES__',
    '__PLAYROOM_ALIAS__USE_SCOPE__',
    {
      name: '__PLAYROOM_ALIAS__SNIPPETS__',
      message: 'Import from `configModules/snippets` instead.',
    },
  ],
  patterns: [
    {
      group: ['**/configModules/themes'],
      message:
        'Only frame code may import themes. Use `configModules/themeNames` instead.',
    },
    {
      group: ['**/configModules/useScope'],
      message: 'Only frame code may import the user scope.',
    },
  ],
};

const frameComponentRestrictions = {
  paths: [
    {
      name: '__PLAYROOM_ALIAS__FRAME_COMPONENT__',
      message:
        'Only `components/Frames/frameSrc.ts` may read the frame component from the editor. Frame code should import `configModules/frameComponent`.',
    },
  ],
  patterns: [
    {
      group: ['**/configModules/frameComponent'],
      message:
        'The frame component is user code for frames only. Use `components/Frames/frameSrc` to build frame URLs.',
    },
  ],
};

export default defineConfig([
  ...eslintConfigSeek,
  {
    settings: {
      react: {
        version: '19',
      },
    },
  },
  {
    rules: {
      curly: 'error',
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
              // Resolution depends on whether `dist` has been built, so pin the group
              pattern: '#*/**',
              group: 'internal',
            },
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
    files: [
      'packages/playroom/src/cli.ts',
      'packages/playroom/src/lib/**/*.{ts,mts}',
    ],
    rules: {
      'no-console': 0,
      'no-process-exit': 0,
    },
  },
  {
    // Keeps the editor reading data rather than user modules. The remaining
    // editor -> user code edges are `configModules/components` (hints) and
    // `__PLAYROOM_ALIAS__FRAME_COMPONENT__` (`frameSrc`).
    // Flat config replaces rather than merges `no-restricted-imports`, so all
    // editor restrictions must live in this one rule.
    files: ['packages/playroom/src/**/*.{ts,tsx}'],
    ignores: [
      'packages/playroom/src/configModules/**',
      'packages/playroom/src/entries/frame.tsx',
      'packages/playroom/src/components/Frame/**',
      'packages/playroom/src/components/RenderCode/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            ...editorUserCodeRestrictions.paths,
            ...frameComponentRestrictions.paths,
          ],
          patterns: [
            ...editorUserCodeRestrictions.patterns,
            ...frameComponentRestrictions.patterns,
          ],
        },
      ],
    },
  },
  {
    files: ['packages/playroom/src/components/Frames/frameSrc.ts'],
    rules: {
      'no-restricted-imports': ['error', editorUserCodeRestrictions],
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
