import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './Preview.less';
import ConfigPanel from '../ConfigPanel/ConfigPanel';
import Iframe from './Iframe';

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

  constructor(props) {
    super(props);

    this.state = {
      widths: new Set(),
      themes: new Set()
    };

    this.applyConfig = this.applyConfig.bind(this);
  }

  applyConfig(config) {
    this.setState(config);
  }

  render() {
    const { code, frames } = this.props;
    const { widths, themes } = this.state;

    return (
      <Fragment>
        <ConfigPanel frames={frames} onChange={this.applyConfig} />

        <div className={styles.root}>
          {frames
            .filter(
              f =>
                widths.has(f.width) &&
                (f.theme === '__PLAYROOM__NO_THEME__' || themes.has(f.theme))
            )
            .map(frame => (
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
                  )}&code=${encodeURIComponent(code)}`}
                  className={styles.frame}
                  style={{ width: frame.width }}
                />
              </div>
            ))}
        </div>
      </Fragment>
    );
  }
}
