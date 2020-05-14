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
};
