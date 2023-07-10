module.exports = {
  components: './components.ts',
  snippets: './snippets.ts',
  outputPath: './dist',
  openBrowser: false,
  storageKey: 'playroom-example-typescript',
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
                presets: [
                  require.resolve('@babel/preset-env'),
                  [
                    require.resolve('@babel/preset-react'),
                    { runtime: 'automatic' },
                  ],
                ],
              },
            },
          ],
        },
      ],
    },
  }),
};
