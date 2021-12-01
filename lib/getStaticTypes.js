const findUp = require('find-up');
const fastGlob = require('fast-glob');
const keyBy = require('lodash/keyBy');
const mapValues = require('lodash/mapValues');
const fs = require('fs');
const ts = require('typescript');
const path = require('path');

const stringRegex = /^"(.*)"$/;
const parsePropType = (propType) => {
  if (propType.name === 'enum' && propType.value && propType.value.length > 0) {
    return propType.value
      .filter(({ value }) => stringRegex.test(value))
      .map(({ value }) => value.replace(stringRegex, '$1'));
  }
  return [];
};

module.exports = async (playroomConfig) => {
  const {
    cwd,
    typeScriptFiles = ['**/*.{ts,tsx}', '!**/node_modules'],
    reactDocgenTypescriptConfig = {},
  } = playroomConfig;

  const tsConfigPath = await findUp('tsconfig.json', { cwd });

  if (!tsConfigPath) {
    return {};
  }

  const { config, error } = ts.readConfigFile(tsConfigPath, (filename) =>
    // eslint-disable-next-line no-sync
    fs.readFileSync(filename, 'utf8')
  );

  if (error) {
    console.error('Error reading tsConfig file.');
    throw error;
  }

  const basePath = path.dirname(tsConfigPath);
  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    basePath,
    {},
    tsConfigPath
  );

  if (errors && errors.length) {
    console.error('Error parsing tsConfig file.');
    throw errors[0];
  }

  try {
    const files = await fastGlob(typeScriptFiles, { cwd, absolute: true });
    const types = require('react-docgen-typescript')
      .withCompilerOptions(
        {
          ...options,
          noErrorTruncation: true,
        },
        {
          propFilter: {
            skipPropsWithName: ['children'],
          },
          shouldExtractValuesFromUnion: true,
          shouldExtractLiteralValuesFromEnum: true,
          shouldRemoveUndefinedFromOptional: true,
          ...reactDocgenTypescriptConfig,
        }
      )
      .parse(files);
    const typesByDisplayName = keyBy(types, 'displayName');
    const parsedTypes = mapValues(typesByDisplayName, (component) =>
      mapValues(component.props || {}, (prop) => parsePropType(prop.type))
    );

    return parsedTypes;
  } catch (err) {
    console.error('Error parsing static types.');
    console.error(err);
    return {};
  }
};
