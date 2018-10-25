module.exports = {
  title: 'Material-UI',
  outputPath: './dist/playroom',
  components: '@material-ui/core',
  frameComponent: './playroom/FrameComponent.js',
  widths: [320, 375, 768, 1024],
  exampleCode: `
    {/* For some reason, the styles only work in the first iframe. */}
    {/* We'll need to look into this further... */}
    <Badge badgeContent="2" color="primary">
      <Button color="primary">Hello</Button>
    </Badge>
  `
};
