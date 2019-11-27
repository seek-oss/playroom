module.exports = {
  components: './components/index.ts',
  outputPath: './dist',
  patterns: [
    { name: 'Foo', code: '<Foo />' },
    { name: 'Bar', code: '<Bar />' }
  ],
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
