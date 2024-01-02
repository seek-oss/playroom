module.exports = {
  components: './components.ts',
  snippets: './snippets.ts',
  outputPath: './dist',
  openBrowser: false,
  storageKey: 'playroom-example-typescript',
  faviconPath: '../../../images/favicon.svg',
  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [
                  require.resolve('@babel/preset-env'),
                  [
                    require.resolve('@babel/preset-react'),
                    { runtime: 'automatic' },
                  ],
                  require.resolve('@babel/preset-typescript'),
                ],
              },
            },
          ],
        },
      ],
    },
  }),
};
