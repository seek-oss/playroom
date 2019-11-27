const path = require('path');
const webpack = require('webpack');
const TreatPlugin = require('treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const braidDir = path.dirname(
  require.resolve('braid-design-system/package.json')
);

module.exports = {
  title: 'BRAID',
  outputPath: './dist/playroom',
  components: './playroom/components.ts',
  themes: 'braid-design-system/lib/themes/index.ts',
  frameComponent: './playroom/FrameComponent.tsx',
  widths: [320, 1024],
  exampleCode: `
    <Card>
      <Checkbox id="1" label="This is a checkbox" reserveMessageSpace={false} onChange={() => {}}>
        <Text>
          This text is visible when the checkbox is checked.
        </Text>
      </Checkbox>
      <Checkbox checked id="2" label="This is a checkbox" reserveMessageSpace={false} onChange={() => {}}>
        <Text>
          This text is visible when the checkbox is checked.
        </Text>
      </Checkbox>
      <Checkbox id="3" label="This is a checkbox" reserveMessageSpace={false} onChange={() => {}}>
        <Text>
          This text is visible when the checkbox is checked.
        </Text>
      </Checkbox>
    </Card>
  `,
  webpackConfig: () => ({
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        'sku/treat': 'treat',
        'sku/react-treat': 'react-treat',
        'sku/@loadable/component': '@loadable/component',
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: [braidDir, __dirname],
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              sourceType: 'unambiguous',
              presets: [
                [
                  require.resolve('@babel/preset-typescript'),
                  {
                    isTSX: true,
                    allExtensions: true
                  }
                ],
                [
                  require.resolve('@babel/preset-env'),
                  {
                    modules: false,
                    targets: require('browserslist-config-seek')
                  }
                ],
                require.resolve('@babel/preset-react')
              ],
              plugins: [
                require.resolve('babel-plugin-syntax-dynamic-import'),
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-proposal-object-rest-spread'),
                [
                  require.resolve('babel-plugin-module-resolver'),
                  {
                    root: [braidDir],
                    extensions: ['.mjs', '.js', '.json', '.ts', '.tsx']
                  }
                ],
                require.resolve('@babel/plugin-transform-runtime'),
                require.resolve('@loadable/babel-plugin'),
                [require.resolve('babel-plugin-treat'), { alias: 'sku/treat' }]
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new TreatPlugin({
        test: {
          test: /\.treat\.ts$/,
          include: [braidDir, __dirname]
        },
        outputCSS: true,
        outputLoaders: [MiniCssExtractPlugin.loader],
        // localIdentName: 'BRAID__[name]-[local]_[hash:base64:5]',
        // themeIdentName: theme =>
        //   theme.name ? `_${theme.name}` : '[hash:base64:3]'
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
    ]
  })
};
