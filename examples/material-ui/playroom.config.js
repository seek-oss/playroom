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
};
