import { resolve } from 'node:path';

// @ts-expect-error No types
import makeWebpackConfig from './makeWebpackConfig';

describe('makeWebpackConfig', () => {
  it('resolves formatter modules from Playroom', async () => {
    const config = await makeWebpackConfig(
      {
        cwd: resolve(__dirname, '../cypress/projects/basic'),
        components: './components.js',
        outputPath: './dist',
        baseUrl: '',
        webpackConfig: () => ({
          resolve: {
            alias: {
              prettier: '/consumer/node_modules/prettier',
            },
          },
        }),
      },
      { production: true }
    );

    expect(config.resolve.alias).toMatchObject({
      'prettier/standalone$': require.resolve('prettier/standalone'),
      'prettier/parser-babel$': require.resolve('prettier/parser-babel'),
      'prettier/parser-postcss$': require.resolve('prettier/parser-postcss'),
      prettier: '/consumer/node_modules/prettier',
    });
  });
});
