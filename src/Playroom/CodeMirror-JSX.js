/* eslint-disable new-cap */

import styles from './CodeMirror-JSX.less';
import { html, render } from 'lit-html';

function getTypeColor(data) {
  if (data.type === 'boolean') {
    return 'rebeccapurple';
  }

  if (data.type === 'string' || data.values.length > 0) {
    return 'darkred';
  }

  if (data.type === 'number') {
    return 'steelblue';
  }
}

function makeTooltip(data) {
  const required = data.required
    ? html`
        <span class=${styles.required}>ⓘ</span>
      `
    : '';
  const defaultValue =
    data.default !== null && typeof data.default !== 'undefined'
      ? html`
          <div class=${styles.default}>
            <span class=${styles.defaultLabel}>Default:</span>
            <span style="color:${getTypeColor(data)}">${data.default}</span>
          </div>
        `
      : '';
  const type =
    data.type !== null && typeof data.type !== 'undefined'
      ? html`
          <div class=${styles.type}>
            <span class=${styles.defaultLabel}>Type:</span>
            <span>${data.type}</span>
          </div>
        `
      : '';

  return html`
    <div>
      ${required} <span>${data.description}</span> ${defaultValue} ${type}
    </div>
  `;
}

function prepareSchema(tags) {
  return Object.keys(tags).reduce((all, tag) => {
    all[tag] = {
      ...tags[tag],
      attrs: Object.keys(tags[tag].attrs).reduce((allAttrs, attr) => {
        if (attr === 'component_description') {
          return allAttrs;
        }

        allAttrs[attr] = tags[tag].attrs[attr].values;
        return allAttrs;
      }, {})
    };

    return all;
  }, {});
}

export default function getHints(cm, options) {
  const CodeMirror = cm.constructor;
  const tags = options && options.schemaInfo;
  const hint = CodeMirror.hint.xml(
    cm,
    Object.assign({}, options, {
      schemaInfo: prepareSchema(tags)
    })
  );

  const container = document.createElement('div');
  document.body.appendChild(container);

  CodeMirror.on(hint, 'close', () => container.remove());
  CodeMirror.on(hint, 'update', () => container.remove());
  CodeMirror.on(hint, 'select', (data, node) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);

    if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    const inner = CodeMirror.innerMode(cm.getMode(), token.state);
    let attr;

    // Attribute
    if (tags[inner.state.tagName]) {
      attr = tags[inner.state.tagName].attrs[data];
    }

    // Tag
    if (data.match(/<\S+/)) {
      attr = {
        description: tags[data.slice(1)].attrs.component_description
      };
    }

    container.remove();

    if (attr && attr.description) {
      const tooltip = makeTooltip(attr);
      const x =
        node.parentNode.getBoundingClientRect().right + window.pageXOffset;
      const y = node.getBoundingClientRect().top + window.pageYOffset;

      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      container.className = styles.tooltip;
      document.body.appendChild(container);

      render(tooltip, container);
    }
  });

  return hint;
}
