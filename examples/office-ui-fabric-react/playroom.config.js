const path = require('path');

const fabricDir = path.dirname(
  require.resolve('office-ui-fabric-react/package.json')
);

module.exports = {
    components: './components/index.ts',
    outputPath: './dist/playroom',
    frameComponent: './playroom/FrameComponent.js',
    // themes: './themes/index.ts',
    exampleCode: `
    <Button>
      Hello World!
    </Button>
    `,
    port: 9000,
    openBrowser: true,
    webpackConfig: () => ({
      module: {
        rules: [
          {
            test: /\.js$/,
            include: __dirname,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react'
                ]
              }
            }
          },
          {
            test: /(?!\.css)\.js$/,
            include: fabricDir,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react'
                ],
                plugins: [
                  'babel-plugin-transform-class-properties'
                ]
              }
            }
          },
          {
            test: /\.css\.js$/,
            include: fabricDir,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:7]',
                  importLoaders: 2
                }
              },
              {
                loader: 'css-in-js-loader'
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                  ],
                  plugins: [
                    'babel-plugin-transform-class-properties'
                  ]
                }
              }
            ]
          },
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