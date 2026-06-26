import { useState } from 'react';

import type { FrameSettingsValues } from '../../utils';
import Frame from '../components/Frame/Frame';
import { InspectOverlay } from '../components/Frame/InspectOverlay';
import {
  ErrorMessageSender,
  InspectMessageReceiver,
  ScreenshotMessageReceiver,
} from '../components/Frame/frameMessenger';
import playroomConfig from '../config';
import { renderElement } from '../render';
import { UrlParams } from '../utils/params';

const FrameContent = ({
  code,
  themeName,
  theme,
}: {
  code: string;
  themeName: string | null;
  theme: string;
}) => {
  const [inspectMode, setInspectMode] = useState(false);

  const frameSettings = playroomConfig.frameSettings || [];
  const defaultFrameSettings = frameSettings.reduce((acc, setting) => {
    acc[setting.id] = setting.defaultValue;
    return acc;
  }, {} as FrameSettingsValues);

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
      <InspectMessageReceiver
        onEnable={() => setInspectMode(true)}
        onDisable={() => setInspectMode(false)}
      />
      <ScreenshotMessageReceiver />
      <Frame
        code={code}
        inspectMode={inspectMode}
        themeName={themeName}
        theme={theme}
        frameSettings={mergedFrameSettings}
        ErrorComponent={ErrorMessageSender}
      />
      <InspectOverlay />
    </>
  );
};

renderElement(
  <UrlParams>
    {({ code, themeName, theme }) => (
      <FrameContent code={code} themeName={themeName} theme={theme} />
    )}
  </UrlParams>
);
