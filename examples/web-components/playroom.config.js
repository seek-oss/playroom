module.exports = {
  components: './components/index.ts',
  componentHints: () => {
    return {
      'wc-bar': {
        attrs: {
          name: null,
        },
      },
      'wc-foo': {
        attrs: {
          name: null,
        },
      },
    };
  },
  snippets: './snippets/index.ts',
  outputPath: './dist',
  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: __dirname,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
  }),
};
