import configComponents from '../configModules/components';
import staticTypes from '../staticTypes';

import { getPropTypesHints, warnAboutPropTypesHints } from './propTypesHints';

type Hints = Record<
  string,
  {
    attrs: Record<string, any>;
  }
>;

export const __private_create_hints = (
  components: typeof configComponents,
  types: typeof staticTypes = {},
) => {
  const componentNames = Object.keys(components).sort();
  const componentsWithPropTypesHints: string[] = [];

  const hints = componentNames.reduce((componentAcc, componentName) => {
    const staticTypesForComponent = types[componentName];
    if (
      staticTypesForComponent &&
      Object.keys(staticTypesForComponent).length > 0
    ) {
      return {
        ...componentAcc,
        [componentName]: {
          attrs: staticTypesForComponent,
        },
      };
    }

    const propTypesHints = getPropTypesHints(components[componentName]);
    if (Object.keys(propTypesHints).length > 0) {
      componentsWithPropTypesHints.push(componentName);
    }

    return {
      ...componentAcc,
      [componentName]: {
        attrs: propTypesHints,
      },
    };
  }, {} as Hints);

  warnAboutPropTypesHints(componentsWithPropTypesHints);

  return hints;
};

export const hints = __private_create_hints(configComponents, staticTypes);
