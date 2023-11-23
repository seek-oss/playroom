import { transform } from 'sucrase';
import { parseExpression } from '@babel/parser';
import memoizeOne from 'memoize-one';

export const ReactFragmentPragma = 'R_F';
export const ReactCreateElementPragma = 'R_cE';

export const openFragmentTag = '<>';
export const closeFragmentTag = '</>';

const wrapInFragment = (code: string) =>
  `${openFragmentTag}${code}${closeFragmentTag}`;

export const compileJsx = memoizeOne(
  (code: string) =>
    transform(wrapInFragment(code.trim()), {
      transforms: ['jsx'],
      jsxPragma: ReactCreateElementPragma,
      jsxFragmentPragma: ReactFragmentPragma,
      production: true,
    }).code
);

const parseWithBabel = memoizeOne((code: string) =>
  parseExpression(wrapInFragment(code), {
    plugins: ['jsx'],
    sourceType: 'script',
    strictMode: true,
  })
);

export interface ErrorWithLocation extends Error {
  loc?: {
    line: number;
    column: number;
  };
}

export const validateCode = (code: string): true | ErrorWithLocation => {
  try {
    parseWithBabel(code);
    return true;
  } catch (err) {
    return err as ErrorWithLocation;
  }
};
