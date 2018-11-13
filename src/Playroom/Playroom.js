import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parsePropTypes from 'parse-prop-types';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import { Parser } from 'acorn-jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import Resizable from 're-resizable';
import Preview from './Preview/Preview';
import styles from './Playroom.less';

import { store } from '../index';
import WindowPortal from './WindowPortal';
import UndockSvg from '../assets/noun_New Window_539930.svg';

// CodeMirror blows up in a Node context, so only execute it in the browser
const ReactCodeMirror =
  typeof window === 'undefined'
    ? null
    : (() => {
        const lib = require('react-codemirror');
        require('codemirror/mode/jsx/jsx');
        require('codemirror/addon/edit/closetag');
        require('codemirror/addon/edit/closebrackets');
        require('codemirror/addon/hint/show-hint');
        require('codemirror/addon/hint/xml-hint');

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

const completeAfter = (cm, predicate) => {
  const CodeMirror = cm.constructor;
  const cur = cm.getCursor();
  if (!predicate || predicate())
    setTimeout(() => {
      if (!cm.state.completionActive) {
        cm.showHint({ completeSingle: false });
      }
    }, 100);

  return CodeMirror.Pass;
};

const completeIfAfterLt = cm => {
  const CodeMirror = cm.constructor;

  return completeAfter(cm, () => {
    const cur = cm.getCursor();
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });
};

const completeIfInTag = cm => {
  const CodeMirror = cm.constructor;

  return completeAfter(cm, () => {
    const tok = cm.getTokenAt(cm.getCursor());
    if (
      tok.type == 'string' &&
      (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
        tok.string.length == 1)
    ) {
      return false;
    }
    const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
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
    this.setEditorUndocked(true);
  };

  handleRedockEditor = () => {
    this.setEditorUndocked(false);
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

    const componentNames = Object.keys(components).sort();
    const tags = Object.assign(
      {},
      ...componentNames.map(componentName => {
        const { propTypes = {} } = components[componentName];
        const parsedPropTypes = parsePropTypes(components[componentName]);
        const filteredPropTypes = omit(
          parsedPropTypes,
          'children',
          'className'
        );
        const propNames = Object.keys(filteredPropTypes);

        return {
          [componentName]: {
            attrs: Object.assign(
              {},
              ...propNames.map(propName => {
                const propType = filteredPropTypes[propName].type;

                return {
                  [propName]:
                    propType.name === 'oneOf'
                      ? propType.value.filter(x => typeof x === 'string')
                      : null
                };
              })
            )
          }
        };
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
              <ReactCodeMirror
                ref={this.storeCodeMirrorRef}
                value={code}
                onChange={this.handleChange}
                options={{
                  mode: 'jsx',
                  autoCloseTags: true,
                  autoCloseBrackets: true,
                  theme: 'neo',
                  gutters: [styles.gutter],
                  hintOptions: { schemaInfo: tags },
                  extraKeys: {
                    Tab: cm => {
                      const indent = cm.getOption('indentUnit');
                      const spaces = Array(indent + 1).join(' ');
                      cm.replaceSelection(spaces);
                    },
                    "'<'": completeAfter,
                    "'/'": completeIfAfterLt,
                    "' '": completeIfInTag,
                    "'='": completeIfInTag
                  }
                }}
              />
            </div>
          </WindowPortal>
        </div>
      );
    }

    return !codeReady ? null : (
      <div className={styles.root}>
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
          <div className={styles.toolbar}>
            <UndockSvg
              title="Undock editor"
              className={styles.toolbarIcon}
              onClick={this.handleUndockEditor}
            />
          </div>
          <ReactCodeMirror
            ref={this.storeCodeMirrorRef}
            value={code}
            onChange={this.handleChange}
            options={{
              mode: 'jsx',
              autoCloseTags: true,
              autoCloseBrackets: true,
              theme: 'neo',
              gutters: [styles.gutter],
              hintOptions: { schemaInfo: tags },
              extraKeys: {
                Tab: cm => {
                  const indent = cm.getOption('indentUnit');
                  const spaces = Array(indent + 1).join(' ');
                  cm.replaceSelection(spaces);
                },
                "'<'": completeAfter,
                "'/'": completeIfAfterLt,
                "' '": completeIfInTag,
                "'='": completeIfInTag
              }
            }}
          />
        </Resizable>
      </div>
    );
  }
}
