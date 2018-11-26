module.exports = {
  title: 'Material-UI',
  outputPath: './dist/playroom',
  components: '@material-ui/core',
  frameComponent: './playroom/FrameComponent.js',
  widths: [320, 375, 768, 1024],
  exampleCode: `
    <br />
    <Badge badgeContent="2" color="primary">
      <Button color="primary">Hello</Button>
    </Badge>
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
