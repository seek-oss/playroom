import React from 'react';
import extraTooltip from './extra-tooltip';
import dedent from 'dedent';
import styles from './snippets.less';
import { formatCode } from '../../utils/formatting';

class Tooltip extends React.Component {
  componentDidMount() {
    this.props.cm.constructor.colorize();
  }

  componentDidUpdate() {
    this.props.cm.constructor.colorize();
  }

  render() {
    return (
      <pre data-lang="jsx" className={styles.pre}>
        {dedent(this.props.data.text)}
      </pre>
    );
  }
}

const addClass = (el, className) => {
  if (!el.className.includes(className)) {
    el.className += ` ${className}`;
  }
};

const showSnippets = (cm, config = {}, code, height, changeRenderedCode) => {
  const initialCursor = cm.getCursor();
  const initialToken = cm.getTokenAt(initialCursor);
  const pad = initialToken.string.match(/^[ ]*$/)
    ? Array(initialToken.end)
        .fill()
        .map(() => ' ')
        .join('')
    : '';
  const snippets = Object.keys(config).reduce((all, displayText) => {
    all.push({
      displayText,
      text: formatCode({ code: config[displayText], initialCursor })
        .formattedCode.split('\n')
        .map(l => `${pad}${l}`)
        .join('\n')
    });
    return all;
  }, []);

  if (!snippets.length) {
    return;
  }

  const CodeMirror = cm.constructor;
  const pos = CodeMirror.Pos;
  const resetUI = () => {
    const old = document.body.querySelector('.snippet-input');

    if (old) {
      old.remove();
    }
  };
  const resetCode = () => {
    resetUI();
    changeRenderedCode(code);

    if (cm.state.completionActive) {
      cm.state.completionActive.close();
    }
  };

  cm.showHint({
    completeSingle: false,
    extraKeys: {
      Esc: resetCode
    },
    hint: () => {
      const cursor = cm.getCursor();
      const token = cm.getTokenAt(cursor);
      const start =
        token.type === 'tag bracket' ? token.start + 1 : token.start;
      const end = cursor.ch;
      const line = cursor.line;
      const currentWord = token.string.trim();
      const list = snippets.filter(item => item.text.indexOf(currentWord) >= 0);
      const hint = {
        list: list.length ? list : snippets,
        from: pos(line, start),
        to: pos(line, end)
      };

      cm.on('endCompletion', resetUI);
      cm.on('blur', () => cm.state.completionActive && resetCode());

      return extraTooltip(cm, hint, Tooltip, data => {
        resetUI();
        const hints = document.body.querySelector('.CodeMirror-hints');
        addClass(hints, 'snippets');
        hints.style.height = `${height - 60}px`;
        const container = document.body.querySelector('.ReactCodeMirror');
        const input = document.createElement('div');
        input.className = 'snippet-input';
        input.innerText = currentWord;
        container.prepend(input);

        const lines = code.split('\n');

        lines[cursor.line] =
          lines[cursor.line].slice(0, cursor.ch) +
          data.text +
          lines[cursor.line].slice(cursor.ch);

        changeRenderedCode(lines.join('\n'));
      });
    }
  });
};

export default showSnippets;
