import { transform } from 'sucrase';
import { transform as transformWithBabel } from '@babel/standalone';

export const ReactFragmentPragma = 'R_F';
export const ReactCreateElementPragma = 'R_cE';

export const openFragmentTag = '<>';
export const closeFragmentTag = '</>';

const wrapInFragment = (code: string) =>
  `${openFragmentTag}${code}${closeFragmentTag}`;

// This one throws error with no useful information, but is fast
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
          pragma: ReactCreateElementPragma,
          pragmaFrag: ReactFragmentPragma,
        },
      ],
    ],
  });

export const validateCode = (code: string) => {
  try {
    compileJsxWithBabel(code);
    return true;
  } catch (err) {
    return err as Error;
  }
};
