const path = require('path');

const braidDir = path.dirname(
  require.resolve('braid-design-system/package.json')
);

module.exports = {
  title: 'BRAID',
  outputPath: './dist',
  components: 'braid-design-system',
  themes: 'braid-design-system/lib/themes',
  frameComponent: './playroom/FrameComponent.js',
  widths: [320, 500, 768, 1024],
  snippets: './playroom/snippets.js',
  unstable_concurrentMode: true,
  exampleCode: `
    <ChecklistCard>
      <Checkbox id="1" label="This is a checkbox" checked={false} message={false} onChange={() => {}}>
        <Text>
          This text is visible when the checkbox is checked.
        </Text>
      </Checkbox>
      <Checkbox id="2" label="This is a checkbox" checked message={false} onChange={() => {}}>
        <Text>
          This text is visible when the checkbox is checked.
        </Text>
      </Checkbox>
      <Checkbox id="3" label="This is a checkbox" checked={false} message={false} onChange={() => {}}>
        <Text>
          This text is visible when the checkbox is checked.
        </Text>
      </Checkbox>
    </ChecklistCard>
  `,
  webpackConfig: () => ({
    resolve: {
      alias: {
        // These are done, because in example playroom _root_ imports them in its context, so it doesnt pick up the examples node_modules
        react: require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: __dirname,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /(?!\.css)\.js$/,
          include: braidDir,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        },
        {
          test: /\.css\.js$/,
          include: braidDir,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[name]__[local]___[hash:base64:7]',
                },
                importLoaders: 2,
              },
            },
            {
              loader: 'css-in-js-loader',
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties'],
              },
            },
          ],
        },
      ],
    },
  }),
};
