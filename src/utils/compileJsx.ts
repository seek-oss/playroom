import { transform } from 'buble';

export const compileJsx = (code: string) =>
  transform(`<React.Fragment>${code.trim() || ''}</React.Fragment>`).code;

export const validateCode = (code: string) => {
  try {
    compileJsx(code);
    return true;
  } catch (err) {
    return false;
  }
};
