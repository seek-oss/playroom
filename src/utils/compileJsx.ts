import { transform } from '@babel/standalone';

export const compileJsx = (code: string) =>
  transform(`<React.Fragment>${code.trim() || ''}</React.Fragment>`, {
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
