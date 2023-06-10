declare module '__PLAYROOM_ALIAS__SNIPPETS__' {
  import type { Snippet } from '../utils';
  const snippets: Snippet[];
  export default snippets;
}

declare module '__PLAYROOM_ALIAS__THEMES__' {
  const themes: Record<string, any>;
  export default themes;
}

// the type for this module may not be what we want as we import it using '* as something'
// this means it won't end up actually being a record
declare module '__PLAYROOM_ALIAS__COMPONENTS__' {
  const components: Record<string, ComponentType<any>>;
  export default components;
}

declare module '__PLAYROOM_ALIAS__FRAME_COMPONENT__' {
  import { ComponentType, ComponentType } from 'react';
  const frameComponent: ComponentType<any>;
  export default frameComponent;
}

declare module '__PLAYROOM_ALIAS__USE_SCOPE__' {
  const useScope: () => Record<string, any>;
  export default useScope;
}
