import omit from 'lodash/omit';
import parsePropTypes from 'parse-prop-types';

const staticTypes = __PLAYROOM_GLOBAL__STATIC_TYPES__;

export default components => {
  const componentNames = Object.keys(components).sort();

  return Object.assign(
    {},
    ...componentNames.map(componentName => {
      const staticTypesForComponent = staticTypes[componentName];
      if (
        staticTypesForComponent &&
        Object.keys(staticTypesForComponent).length > 0
      ) {
        return {
          [componentName]: {
            attrs: staticTypesForComponent
          }
        };
      }

      const parsedPropTypes = parsePropTypes(components[componentName]);
      const filteredPropTypes = omit(parsedPropTypes, 'children', 'className');
      const propNames = Object.keys(filteredPropTypes);

      return {
        [componentName]: {
          attrs: Object.assign(
            {},
            ...propNames.map(propName => {
              const propType = filteredPropTypes[propName].type;

              return {
                [propName]:
                  propType.name === 'oneOf'
                    ? propType.value.filter(x => typeof x === 'string')
                    : null
              };
            })
          )
        }
      };
    })
  );
};
