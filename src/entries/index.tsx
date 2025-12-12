import faviconInvertedPath from '../../images/favicon-inverted.png';
import faviconPath from '../../images/favicon.png';
import Playroom from '../components/Playroom/Playroom';
import { EditorProvider } from '../contexts/EditorContext';
import { StoreProvider } from '../contexts/StoreContext';
import { renderElement } from '../render';

const selectedElement = document.head.querySelector('link[rel="icon"]');
const favicon = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? faviconInvertedPath
  : faviconPath;

if (selectedElement) {
  selectedElement.setAttribute('href', favicon);
}

renderElement(
  <StoreProvider>
    <EditorProvider>
      <Playroom />
    </EditorProvider>
  </StoreProvider>
);
