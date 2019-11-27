const dedent = require('dedent');

module.exports = {
  components: './components/index.ts',
  outputPath: './dist',
  patterns: [
    {
      name: 'Foo > Without Children',
      code: dedent`
        <Foo />
      `
    },
    {
      name: 'Foo > With Children',
      code: dedent`
        <Foo>
          <strong>Hello</strong>
        </Foo>
      `
    },
    {
      name: 'Bar > Without Children',
      code: dedent`
        <Bar />
      `
    },
    {
      name: 'Bar > With Children',
      code: dedent`
        <Bar>
          <strong>Hello</strong>
        </Bar>
      `
    }
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
