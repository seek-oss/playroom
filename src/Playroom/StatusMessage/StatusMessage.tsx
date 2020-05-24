import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import classnames from 'classnames';
import { StoreContext } from '../../StoreContext/StoreContext';
import { Text } from '../Text/Text';
import DismissIcon from '../icons/DismissIcon';

// @ts-ignore
import styles from './StatusMessage.less';

const exitAnimationDuration = 300;
const statusMessageDuration = 3000;

interface Props {
  dismissable?: boolean;
}
export const StatusMessage = ({ dismissable = false }: Props) => {
  const [{ statusMessage }, dispatch] = useContext(StoreContext);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const showStatusTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [show, setShow] = useState(false);
  const [internalMessage, setInternalMessage] = useState(statusMessage);
  const { tone, message } = internalMessage || {};

  const closeHandler = useCallback(() => {
    setShow(false);

    cleanupTimerRef.current = setTimeout(() => {
      setInternalMessage(undefined);
      dispatch({ type: 'dismissMessage' });
    }, exitAnimationDuration);
  }, [dispatch]);

  useEffect(() => {
    if (statusMessage) {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
      if (showStatusTimerRef.current) {
        clearTimeout(showStatusTimerRef.current);
      }

      setInternalMessage(statusMessage);
      setShow(true);

      showStatusTimerRef.current = setTimeout(
        closeHandler,
        statusMessageDuration
      );
    } else {
      setShow(false);
    }
  }, [closeHandler, dispatch, statusMessage]);

  return (
    <div
      onClick={dismissable ? closeHandler : undefined}
      className={classnames(styles.status, {
        [styles.positive]: tone === 'positive',
        [styles.critical]: tone === 'critical',
        [styles.dismissable]: dismissable,
        [styles.show]: show, // eslint-disable-line css-modules/no-undef-class
      })}
    >
      <Text>{message}</Text>
      {dismissable ? (
        <div className={styles.dismiss}>
          <DismissIcon size="100%" />
        </div>
      ) : null}
    </div>
  );
};
