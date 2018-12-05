const findUp = require('find-up');
const fastGlob = require('fast-glob').async;
const keyBy = require('lodash/keyBy');
const mapValues = require('lodash/mapValues');
const omit = require('lodash/omit');

const stringRegex = /^"(.*)"$/;
const parsePropTypeName = propTypeName => {
  return propTypeName
    .split(' | ')
    .filter(x => stringRegex.test(x))
    .map(x => x.replace(stringRegex, '$1'));
};

const filterProps = props => omit(props, 'className', 'children');

module.exports = async ({ cwd }) => {
  try {
    const tsConfigPath = await findUp('tsconfig.json', { cwd });

    if (!tsConfigPath) {
      return {};
    }

    const { parse } = require('react-docgen-typescript').withCustomConfig(
      tsConfigPath
    );
    const files = await fastGlob([`${cwd}/**/*.{ts,tsx}`, '!**/node_modules']);
    const types = parse(files);
    const typesByDisplayName = keyBy(types, 'displayName');
    const parsedTypes = mapValues(typesByDisplayName, component =>
      mapValues(filterProps(component.props || {}), prop =>
        parsePropTypeName(prop.type.name)
      )
    );

    return parsedTypes;
  } catch (err) {
    return {};
  }
};
