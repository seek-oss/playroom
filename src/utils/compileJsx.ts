import { transform } from '@babel/standalone';
import memoizeOne from 'memoize-one';
import * as esbuild from 'esbuild-wasm';
import esbuildWasmUrl from 'esbuild-wasm/esbuild.wasm';

const init = esbuild.initialize({
  wasmURL: `/${esbuildWasmUrl}`,
});

export const ReactFragmentPragma = 'R_F';
export const ReactCreateElementPragma = 'R_cE';

export const openFragmentTag = '<>';
export const closeFragmentTag = '</>';

export const compileJsxWithBabel = memoizeOne((code: string) => {
  const result = transform(
    `${openFragmentTag}${code.trim()}${closeFragmentTag}`,
    {
      presets: [
        [
          'react',
          {
            pragma: ReactCreateElementPragma,
            pragmaFrag: ReactFragmentPragma,
          },
        ],
      ],
    }
  );
  return result.code;
});

export const compileJsx = memoizeOne(async (code: string) => {
  await init;
  const result = await esbuild.transform(
    `${openFragmentTag}${code.trim()}${closeFragmentTag}`,
    {
      loader: 'jsx',
      jsxFactory: ReactCreateElementPragma,
      jsxFragment: ReactFragmentPragma,
    }
  );

  return result.code;
});

export const validateCode = (code: string): true | Error => {
  try {
    compileJsxWithBabel(code);
    return true;
  } catch (err) {
    return err as Error;
  }
};
