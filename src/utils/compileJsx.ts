import { transform } from 'sucrase';

export const ReactFragmentPragma = 'R_F';
export const ReactCreateElementPragma = 'R_cE';

export const openFragmentTag = '<>';
export const closeFragmentTag = '</>';

export const compileJsx = (code: string) =>
  transform(`${openFragmentTag}${code.trim()}${closeFragmentTag}`, {
    transforms: ['jsx'],
    jsxPragma: ReactCreateElementPragma,
    jsxFragmentPragma: ReactFragmentPragma,
    production: true,
  }).code;

export const validateCode = (code: string) => {
  try {
    compileJsx(code);
    return true;
  } catch (err) {
    return false;
  }
};
