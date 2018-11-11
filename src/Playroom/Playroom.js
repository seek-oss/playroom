import React, { Component } from 'react';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import { Parser } from 'acorn-jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import Resizable from 're-resizable';
import Preview from './Preview/Preview';
import styles from './Playroom.less';
import createHistory from 'history/createBrowserHistory';

import { store } from '../index';
import WindowPortal from './WindowPortal';
import UndockSvg from '../assets/noun_New Window_539930.svg';

const history = createHistory();

// CodeMirror blows up in a Node context, so only execute it in the browser
const CodeMirror =
  typeof window === 'undefined'
    ? null
    : (() => {
        const lib = require('react-codemirror');
        require('codemirror/mode/jsx/jsx');

        return lib;
      })();

const resizableConfig = {
  top: true,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
};

export default class Playroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      codeReady: false,
      code: null,
      renderCode: null,
      height: 200,
      editorUndocked: false
    };
  }

  componentDidMount() {
    Promise.all([this.props.getCode(), store.getItem('editorSize')]).then(
      ([code, height]) => {
        if (height) {
          this.setState({
            height
          });
        }
        this.initialiseCode(code);
        this.validateCode(code);
      }
    );
    this.setEditorUndocked(location.pathname === '/editor');

    this.unlisten = history.listen(location => {
      this.setEditorUndocked(location.pathname === '/editor');
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  storeCodeMirrorRef = cmRef => {
    this.cmRef = cmRef;
  };

  setEditorUndocked = val => {
    this.setState({
      editorUndocked: val
    });
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

  updateHeight = (event, direction, ref) => {
    this.setState({
      height: ref.offsetHeight
    });
    store.setItem('editorSize', ref.offsetHeight);
  };

  handleChange = debounce(this.updateCode, 200);

  handleResize = debounce(this.updateHeight, 200);

  handleUndockEditor = () => {
    history.push('/editor');
  };

  handleRedockEditor = () => {
    history.push('/');
  };

  render() {
    const { components, themes, widths, frameComponent } = this.props;
    const { codeReady, code, renderCode, height, editorUndocked } = this.state;

    const themeNames = Object.keys(themes);
    const frames = flatMap(widths, width =>
      themeNames.map(theme => {
        return { theme, width };
      })
    );

    if (editorUndocked && codeReady) {
      return (
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
          <WindowPortal
            height={height}
            width={window.outerWidth}
            onClose={this.handleRedockEditor}
          >
            <div className={styles.undockedEditorContainer}>
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
          </WindowPortal>
        </div>
      );
    }

    return !codeReady ? null : (
      <div>
        <div
          className={styles.previewContainer}
          style={{ bottom: this.state.height }}
        >
          <Preview
            code={renderCode}
            components={components}
            themes={themes}
            frames={frames}
            frameComponent={frameComponent}
          />
        </div>
        <Resizable
          className={styles.editorContainer}
          defaultSize={{
            height: `${height}`, // issue in ff & safari when not a string
            width: '100vw'
          }}
          style={{
            position: 'fixed'
          }}
          onResize={this.handleResize}
          enable={resizableConfig}
        >
          <div className={styles.editorHeader}>
            <UndockSvg
              className={styles.editorIcon}
              onClick={this.handleUndockEditor}
            />
          </div>
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
        </Resizable>
      </div>
    );
  }
}
