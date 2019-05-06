module.exports = {
  components: './components/index.ts',
  outputPath: './dist',

  snippets: {
    Foo: `<Foo color='red'>I am foo</Foo>`,
    Bar: `<Bar color='blue'>I am Bar</Bar>`
  },

  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react'
              ]
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    }
  })
};
