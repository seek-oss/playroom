// @ts-expect-error
import parsePropTypes from 'parse-prop-types';

import type { PlayroomProps } from '../components/Playroom/Playroom';

export default (
  components: PlayroomProps['components'],
  staticTypes: typeof __PLAYROOM_GLOBAL__STATIC_TYPES__ = {}
) => {
  const componentNames = Object.keys(components).sort();

  return Object.assign(
    {},
    ...componentNames.map((componentName) => {
      const staticTypesForComponent = staticTypes[componentName];
      if (
        staticTypesForComponent &&
        Object.keys(staticTypesForComponent).length > 0
      ) {
        return {
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
        [componentName]: {
          attrs: Object.assign(
            {},
            ...propNames.map((propName) => {
              const propType = filteredPropTypes[propName].type;

              return {
                [propName]:
                  propType.name === 'oneOf'
                    ? propType.value.filter((x: any) => typeof x === 'string')
                    : null,
              };
            })
          ),
        },
      };
    })
  );
};
