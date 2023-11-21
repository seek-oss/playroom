import { transform } from 'sucrase';
import { transform as transformWithBabel } from '@babel/standalone';

export const ReactFragmentPragma = 'R_F';
export const ReactCreateElementPragma = 'R_cE';

export const openFragmentTag = '<>';
export const closeFragmentTag = '</>';

const wrapInFragment = (code: string) =>
  `${openFragmentTag}${code}${closeFragmentTag}`;

// This one sometimes throws errors with less useful information, but is fast
export const compileJsx = (code: string) =>
  transform(wrapInFragment(code.trim()), {
    transforms: ['jsx'],
    jsxPragma: ReactCreateElementPragma,
    jsxFragmentPragma: ReactFragmentPragma,
    production: true,
  }).code;

// This one throws errors with line numbers. Useful for validation
const compileJsxWithBabel = (code: string) =>
  transformWithBabel(wrapInFragment(code), {
    presets: [
      [
        'react',
        {
          development: false,
          pure: false,
          pragma: ReactCreateElementPragma,
          pragmaFrag: ReactFragmentPragma,
          runtime: 'classic',
          useBuiltIns: true,
        },
      ],
    ],
  });

export const validateCode = (code: string): true | Error => {
  try {
    compileJsxWithBabel(code);
    return true;
  } catch (err) {
    return err as Error;
  }
};
