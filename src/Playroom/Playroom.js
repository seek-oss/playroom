import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parsePropTypes from 'parse-prop-types';
import flatten from 'lodash/flatten';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import { Parser } from 'acorn-jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import Preview from './Preview/Preview';
import styles from './Playroom.less';

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
      const parser = new Parser(
        { plugins: { jsx: true } },
        `<div>${code}</div>`
      );
      const ast = parser.parse();

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
      </div>
    );
  }
}
