import React from 'react';
import styles from './prop-descriptions.less';
import extraTooltip from './extra-tooltip';

// Convert attribute values to arrays that addon-xml can handle
function prepareSchema(tags) {
  return Object.keys(tags).reduce((all, key) => {
    const tag = tags[key];

    all[key] = {
      ...tag,
      attrs: Object.keys(tag.attrs).reduce((allAttrs, name) => {
        if (name === 'component_description') {
          return allAttrs;
        }

        const attr = tag.attrs[name];
        allAttrs[name] = Array.isArray(attr) ? attr : attr.values;
        return allAttrs;
      }, {})
    };

    return all;
  }, {});
}

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

  return null;
}

const Tooltip = ({ data }) => (
  <div>
    {data.required && <span className={styles.required}>ⓘ</span>}
    <span>{data.description}</span>
    {data.default !== null && typeof data.default !== 'undefined' && (
      <div className={styles.default}>
        <span className={styles.defaultLabel}>Default:</span>
        <span style={{ color: getTypeColor(data) }}>{data.default}</span>
      </div>
    )}
    {data.type !== null && typeof data.type !== 'undefined' && (
      <div className={styles.default}>
        <span className={styles.defaultLabel}>Type:</span>
        <span>{data.type}</span>
      </div>
    )}
  </div>
);

function getAttribute(cm, tags, data) {
  const CodeMirror = cm.constructor;
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
    attr = tags[data.slice(1)].attrs.component_description;
  }

  return attr;
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

  return extraTooltip(cm, hint, Tooltip, token => {
    const data = getAttribute(cm, tags, token);

    return Array.isArray(data) ? null : data;
  });
}
