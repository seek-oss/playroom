import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import CollectStyles from '../CollectStyles/CollectStyles';
import FadeIn from '../FadeIn/FadeIn';
import CatchErrors from '../CatchErrors/CatchErrors';
import RenderJsx from '../RenderJsx/RenderJsx';
import styles from './Preview.less';
import flatten from 'lodash/flatten';

export default class Preview extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired
  };

  render() {
    const {
      code,
      components,
      themes,
      frames,
      frameComponent: FrameComponent
    } = this.props;

    return (
      <div className={styles.root}>
        <CollectStyles>
          {collectedStyles =>
            frames.map((frame, frameIndex) => (
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
                <Frame className={styles.frame} style={{ width: frame.width }}>
                  <FrameContextConsumer>
                    {frameContext => (
                      <div className={styles.frameContents}>
                        {collectedStyles}
                        {collectedStyles && (
                          <FadeIn delay={(frameIndex + 1) * 50}>
                            <CatchErrors key={code}>
                              <FrameComponent
                                theme={themes[frame.theme]}
                                themeName={frame.theme}
                                width={frame.width}
                                frameWindow={frameContext.window}
                              >
                                <RenderJsx
                                  jsx={code}
                                  initialState={{}}
                                  scope={components}
                                />
                              </FrameComponent>
                            </CatchErrors>
                          </FadeIn>
                        )}
                      </div>
                    )}
                  </FrameContextConsumer>
                </Frame>
              </div>
            ))
          }
        </CollectStyles>
      </div>
    );
  }
}
