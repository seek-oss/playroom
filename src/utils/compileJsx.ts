import { transform } from '@babel/standalone';
/* eslint-disable-next-line import/no-unresolved */
/* @ts-expect-error: This import is webpack magic */
import processCode from '__PLAYROOM_ALIAS__PROCESS_CODE__';

export const compileJsx = (code: string) => {
  const processedCode = processCode(code);

  if (typeof processedCode !== 'string') {
    throw new Error('processCode function must return a string of code.');
  }

  return transform(`<React.Fragment>${processedCode.trim()}</React.Fragment>`, {
    presets: ['react'],
  }).code;
};

export const validateCode = (code: string) => {
  try {
    compileJsx(code);
    return true;
  } catch (err) {
    return false;
  }
};
