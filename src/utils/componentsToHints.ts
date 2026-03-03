// @ts-expect-error
import ppt from 'parse-prop-types';

// interop with esm build and cjs in jest
const parsePropTypes = typeof ppt === 'function' ? ppt : ppt.default;

import configComponents from '../configModules/components';

const staticTypes = __PLAYROOM_GLOBAL__STATIC_TYPES__;

type Hints = Record<
  string,
  {
    attrs: Record<string, any>;
  }
>;

export const __private_create_hints = (
  components: typeof configComponents,
  types: typeof staticTypes = {}
) => {
  const componentNames = Object.keys(components).sort();

  return componentNames.reduce((componentAcc, componentName) => {
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

    const { children, ...filteredPropTypes } = parsePropTypes(
      components[componentName]
    );
    const propNames = Object.keys(filteredPropTypes);

    return {
      ...componentAcc,
      [componentName]: {
        attrs: propNames.reduce((propAcc, propName) => {
          const propType = filteredPropTypes[propName].type;

          return {
            ...propAcc,
            [propName]:
              propType.name === 'oneOf'
                ? propType.value.filter((x: any) => typeof x === 'string')
                : null,
          };
        }, {} as Hints[string]['attrs']),
      },
    };
  }, {} as Hints);
};

export const hints = __private_create_hints(configComponents, staticTypes);
