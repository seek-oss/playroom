import React, { Component } from 'react';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import { Parser } from 'acorn-jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import Preview from './Preview/Preview';
import styles from './Playroom.less';

// CodeMirror blows up in a Node context, so only execute it in the browser
const CodeMirror =
  typeof window === 'undefined'
    ? null
    : (() => {
        const lib = require('react-codemirror');
        require('codemirror/mode/jsx/jsx');

        return lib;
      })();

export default class Playroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      codeReady: false,
      code: null,
      renderCode: null
    };
  }

  componentDidMount() {
    this.props.getCode().then(code => {
      this.initialiseCode(code);
      this.validateCode(code);
    });
  }

  storeCodeMirrorRef = cmRef => {
    this.cmRef = cmRef;
  };

  initialiseCode = code => {
    this.setState({
      codeReady: true,
      code,
      renderCode: code
    });
  };

  updateCode = code => {
    this.setState({ code });
    this.props.updateCode(code);
    this.validateCode(code);
  };

  validateCode = code => {
    const cm = this.cmRef.codeMirror;
    cm.clearGutter(styles.gutter);

    try {
      // validate code is parsable
      new Parser({ plugins: { jsx: true } }, `<div>${code}</div>`).parse();

      this.setState({ renderCode: code });
    } catch (err) {
      const errorMessage = err && (err.message || '');

      const matches = errorMessage.match(/\(([0-9]+):/);

      const lineNumber =
        matches &&
        matches.length >= 2 &&
        matches[1] &&
        parseInt(matches[1], 10);

      if (!lineNumber) {
        return;
      }

      const marker = document.createElement('div');
      marker.classList.add(styles.marker);
      marker.setAttribute('title', err.message);
      cm.setGutterMarker(lineNumber - 1, styles.gutter, marker);
    }
  };

  handleChange = debounce(this.updateCode, 200);

  render() {
    const { components, themes, widths, frameComponent } = this.props;
    const { codeReady, code, renderCode } = this.state;

    const themeNames = Object.keys(themes);
    const frames = flatMap(widths, width =>
      themeNames.map(theme => {
        return { theme, width };
      })
    );

    return !codeReady ? null : (
      <div>
        <div className={styles.previewContainer}>
          <Preview
            code={renderCode}
            components={components}
            themes={themes}
            frames={frames}
            frameComponent={frameComponent}
          />
        </div>
        <div className={styles.editorContainer}>
          <CodeMirror
            ref={this.storeCodeMirrorRef}
            value={code}
            onChange={this.handleChange}
            options={{
              mode: 'jsx',
              theme: 'neo',
              gutters: [styles.gutter]
            }}
          />
        </div>
      </div>
    );
  }
}
