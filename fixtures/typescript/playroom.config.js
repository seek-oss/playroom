export default {
  components: './components.ts',
  snippets: './snippets.ts',
  outputPath: './dist',
  openBrowser: false,
  port: 9002,
  storageKey: 'playroom-example-typescript',
  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: import.meta.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [
                  import.meta.resolve('@babel/preset-env'),
                  [
                    import.meta.resolve('@babel/preset-react'),
                    { runtime: 'automatic' },
                  ],
                  import.meta.resolve('@babel/preset-typescript'),
                ],
              },
            },
          ],
        },
      ],
    },
  }),
};
