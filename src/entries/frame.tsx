import Frame from '../components/Frame/Frame';
import {
  ErrorMessageSender,
  ScreenshotMessageReceiver,
} from '../components/Frame/frameMessenger';
import { renderElement } from '../render';
import { UrlParams } from '../utils/params';

renderElement(
  <UrlParams>
    {({ code, themeName, theme }) => (
      <>
        <ScreenshotMessageReceiver />
        <Frame
          code={code}
          themeName={themeName}
          theme={theme}
          ErrorComponent={ErrorMessageSender}
        />
      </>
    )}
  </UrlParams>
);
