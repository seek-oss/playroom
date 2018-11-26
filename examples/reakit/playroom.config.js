module.exports = {
  title: 'Reakit',
  outputPath: './dist/playroom',
  components: 'reakit',
  frameComponent: './playroom/FrameComponent.js',
  widths: [320, 375, 768, 1024],
  exampleCode: `
    <Group vertical>
      <Button maxWidth="20vmin">Up</Button>
      <Button maxWidth="20vmin">Down</Button>
    </Group>
  `,
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
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        }
      ]
    }
  })
};
