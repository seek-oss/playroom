const { decorateClientConfig } = require('seek-style-guide-webpack');

module.exports = {
  title: 'SEEK Style Guide',
  outputPath: './dist/playroom',
  components: 'seek-style-guide/react',
  frameComponent: './playroom/FrameComponent.js',
  widths: [320, 375, 768, 1024],
  exampleCode: `
    <Header authenticationStatus="unauthenticated" activeTab="Job Search" />

    <PageBlock>
      <Section header>
        <Text hero>Sign In</Text>
      </Section>
      <AsidedLayout size="40%">
        <Card>
          <Section>
            <TextField label="Email address" />
            <TextField label="Password" type="password" />
            <ButtonGroup>
              <Button color="pink">Sign in</Button>
              <Button color="transparent">Cancel</Button>
            </ButtonGroup>
          </Section>
        </Card>
      </AsidedLayout>
    </PageBlock>

    <Footer />
  `,
  webpackConfig: () =>
    decorateClientConfig({
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
        ],
      },
    }),
  iframeSandbox: true,
};
