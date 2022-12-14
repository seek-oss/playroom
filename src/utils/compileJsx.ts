import { transform } from '@babel/standalone';

export const openFragmentTag = '<React.Fragment>';
export const closeFragmentTag = '</React.Fragment>';

export const compileJsx = (code: string) =>
  transform(`${openFragmentTag}${code.trim() || ''}${closeFragmentTag}`, {
    presets: ['react'],
  }).code;

export const validateCode = (code: string) => {
  try {
    compileJsx(code);
    return true;
  } catch (err) {
    return false;
  }
};
