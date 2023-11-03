import { transform } from '@babel/standalone';

export const ReactFragmentPragma = 'R_F';
export const ReactCreateElementPragma = 'R_cE';

export const openFragmentTag = '<>';
export const closeFragmentTag = '</>';

export const compileJsx = (code: string) =>
  transform(`${openFragmentTag}${code.trim()}${closeFragmentTag}`, {
    presets: [
      [
        'react',
        {
          pragma: ReactCreateElementPragma,
          pragmaFrag: ReactFragmentPragma,
        },
      ],
    ],
  }).code;

export const validateCode = (code: string) => {
  try {
    compileJsx(code);
    return true;
  } catch (err) {
    return false;
  }
};
