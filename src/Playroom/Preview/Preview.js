import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Iframe from './Iframe';
import styles from './Preview.less';
import compileJsx from '../../utils/compileJsx';

export default class Preview extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    themes: PropTypes.object,
    frames: PropTypes.arrayOf(
      PropTypes.shape({
        theme: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired
      })
    )
  };

  static defaultProps = { themes: [], frames: [] };

  render() {
    const { code, frames } = this.props;

    let renderCode = code;

    try {
      renderCode = compileJsx(code);
    } catch (e) {
      renderCode = '';
    }

    return (
      <div className={styles.root}>
        {frames.map(frame => (
          <div
            key={`${frame.theme}_${frame.width}`}
            className={styles.frameContainer}
          >
            <div className={styles.frameName}>
              {frame.theme === '__PLAYROOM__NO_THEME__' ? (
                <strong className={styles.strong}>
                  {frame.width}
                  px
                </strong>
              ) : (
                <Fragment>
                  <strong className={styles.strong}>{frame.theme}</strong>
                  {` \u2013 ${frame.width}px`}
                </Fragment>
              )}
            </div>
            <Iframe
              src={`frame.html#?themeName=${encodeURIComponent(
                frame.theme
              )}&code=${encodeURIComponent(renderCode)}`}
              className={styles.frame}
              style={{ width: frame.width }}
            />
          </div>
        ))}
      </div>
    );
  }
}
