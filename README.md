<img src="images/logo.png?raw=true" alt="Playroom" title="Playroom" width="292" height="50" />

[![Build Status](https://img.shields.io/travis/seek-oss/playroom/master.svg?style=flat-square)](http://travis-ci.org/seek-oss/playroom) [![npm](https://img.shields.io/npm/v/playroom.svg?style=flat-square)](https://www.npmjs.com/package/playroom) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

---

<img src="images/demo.gif?raw=true" alt="Playroom Demo" title="Playroom Demo" />

Simultaneously design across a variety of themes and screen sizes, powered by JSX and your own component library.

Playroom allows you to create a zero-install code-oriented design environment, built into a standalone bundle that can be deployed alongside your existing design system documentation.

- Iterate on your designs in the final medium.
- Create quick mock-ups and interactive prototypes with real code.
- Exercise and evaluate the flexibility of your design system.
- Share your work with others by simply copying the URL.

## Demos

[SEEK Style Guide](https://seek-oss.github.io/seek-style-guide/playroom/#?code=PEhlYWRlciAvPgoKPFNlY3Rpb24gaGVhZGVyPgogIDxUZXh0IGhlcm8-V2VsY29tZSB0byBQbGF5cm9vbSE8L1RleHQ-CjwvU2VjdGlvbj4KCjxGb290ZXIgLz4)

[Braid Design System](https://seek-oss.github.io/braid-design-system/playroom/#?code=PEFsZXJ0IHRvbmU9ImluZm8iPldlbGNvbWUgdG8gUGxheXJvb20hPC9BbGVydD4) (Themed)

Send us a PR if you'd like to be in this list!

## Setup

```bash
$ npm install --save-dev playroom
```

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "playroom:start": "playroom start",
    "playroom:build": "playroom build"
  }
}
```

Add a `playroom.config.js` file to the root of your project:

```js
module.exports = {
  components: './src/components',
  outputPath: './dist/playroom',

  // Optional:
  title: 'My Awesome Library',
  themes: './src/themes',
  frameComponent: './playroom/FrameComponent.js',
  widths: [320, 375, 768, 1024],
  exampleCode: `
    <Button>
      Hello World!
    </Button>
  `,
  webpackConfig: () => ({
    // Custom webpack config goes here...
  })
};
```

Your `components` and `themes` files are expected to export a single object or a series of named exports. For example, your components file might look like this:

```js
module.exports = {
  Text: require('./Text/Text'),
  Button: require('./Button/Button')
  // etc...
};
```

When providing themes, your themes file might look something like this:

```js
module.exports = {
  themeA: require('./themeA'),
  themeB: require('./themeB')
  // etc...
};
```

If your components need to be nested within custom provider components, you can provide a custom React component file via the `frameComponent` option, which is a path to a file that might look something like this:

```js
import React from 'react';
import ThemeProvider from '../path/to/your/ThemeProvider';

export default ({ theme, children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
```

If you're using a CSS-in-JS library that generates styles dynamically, you might need to configure it to insert them into the iframe. For example, when using [styled-components](https://www.styled-components.com):

```js
import React from 'react';
import { StyleSheetManager } from 'styled-components';
import ThemeProvider from '../path/to/ThemeProvider';

export default ({ theme, children, frameWindow }) => (
  <StyleSheetManager target={frameWindow.document.head}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyleSheetManager>
);
```

Now that your project is configured, you can start a local development server:

```bash
$ npm run playroom:start
```

To build your assets for production:

```bash
$ npm run playroom:build
```

## License

MIT.
