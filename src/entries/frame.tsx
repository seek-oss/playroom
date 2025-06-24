import Frame from '../components/Frame/Frame';
import { SendErrorMessage } from '../components/Frame/frameMessaging';
import { renderElement } from '../render';
import { UrlParams } from '../utils/params';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

renderElement(
  <UrlParams>
    {({ code, themeName, theme }) => (
      <Frame
        code={code}
        themeName={themeName}
        theme={theme}
        ErrorComponent={SendErrorMessage}
      />
    )}
  </UrlParams>,
  outlet
);
