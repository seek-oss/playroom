import type { FrameSettingsValues } from '../../utils';
import Frame from '../components/Frame/Frame';
import {
  ErrorMessageSender,
  ScreenshotMessageReceiver,
} from '../components/Frame/frameMessenger';
import playroomConfig from '../config';
import { renderElement } from '../render';
import { UrlParams } from '../utils/params';

renderElement(
  <UrlParams>
    {({ code, themeName, theme }) => {
      const frameSettings = playroomConfig.frameSettings || [];
      // Build default frame settings from config
      const defaultFrameSettings = frameSettings.reduce((acc, setting) => {
        acc[setting.id] = setting.defaultValue;
        return acc;
      }, {} as FrameSettingsValues);

      // Parse frame settings from URL if present
      const urlParams = new URLSearchParams(window.location.hash.slice(2));
      const frameSettingsParam = urlParams.get('frameSettings');
      const parsedFrameSettings = frameSettingsParam
        ? JSON.parse(frameSettingsParam)
        : {};

      const mergedFrameSettings = {
        ...defaultFrameSettings,
        ...parsedFrameSettings,
      };

      return (
        <>
          <ScreenshotMessageReceiver />
          <Frame
            code={code}
            themeName={themeName}
            theme={theme}
            frameSettings={mergedFrameSettings}
            ErrorComponent={ErrorMessageSender}
          />
        </>
      );
    }}
  </UrlParams>
);
