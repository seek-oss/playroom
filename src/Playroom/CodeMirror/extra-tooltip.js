import React from 'react';
import ReactDom from 'react-dom';
import styles from './extra-tooltip.less';

// Render a tooltip when getData returns something
const extraTooltip = (cm, hint, Component, getData) => {
  const CodeMirror = cm.constructor;
  const container = document.createElement('div');

  CodeMirror.on(hint, 'close', () => container.remove());
  CodeMirror.on(hint, 'update', () => container.remove());
  CodeMirror.on(hint, 'select', (token, node) => {
    const data = getData(token, node);
    container.remove();

    if (data) {
      const x =
        node.parentNode.getBoundingClientRect().right + window.pageXOffset;
      const y = node.getBoundingClientRect().top + window.pageYOffset;

      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      container.className = styles.container;

      document.body.appendChild(container);
      ReactDom.render(<Component data={data} cm={cm} />, container);
    }
  });

  return hint;
};

export default extraTooltip;
