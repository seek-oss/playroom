import fs from 'node:fs';
import path from 'node:path';

import findUp from 'find-up';
import { glob } from 'tinyglobby';
import ts from 'typescript';

import type { PlayroomConfig } from '../utils/index.ts';

const stringRegex = /^"(.*)"$/;
const parsePropType = (propType: {
  name: string;
  value?: Array<{ value: string }>;
}) => {
  if (propType.name === 'enum' && propType.value && propType.value.length > 0) {
    return propType.value
      .filter(({ value }) => stringRegex.test(value))
      .map(({ value }) => value.replace(stringRegex, '$1'));
  }
  return [];
};

/**
 * Modified from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_keyby.
 * Only supports arrays and expects a `key` to be provided.
 */
const keyBy = <T,>(array: T[] = [], key: keyof T) =>
  array.reduce<Record<string, T>>(
    (previousValue, currentValue) => ({
      ...previousValue,
      [String(currentValue[key])]: currentValue,
    }),
    {},
  );

const mapValues = <T, R>(
  object: Record<string, T>,
  callback: (value: T) => R,
) =>
  Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, callback(value)]),
  );

export default async (
  playroomConfig: Pick<
    PlayroomConfig,
    'cwd' | 'typeScriptFiles' | 'reactDocgenTypescriptConfig'
  >,
) => {
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
    fs.readFileSync(filename, 'utf8'),
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
    tsConfigPath,
  );

  if (errors && errors.length) {
    console.error('Error parsing tsConfig file.');
    throw errors[0];
  }

  try {
    const files = await glob(typeScriptFiles, { cwd, absolute: true });
    const { withCompilerOptions } = await import('react-docgen-typescript');

    const types = withCompilerOptions(
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
      },
    ).parse(files);
    const typesByDisplayName = keyBy(types, 'displayName');
    const parsedTypes = mapValues(typesByDisplayName, (component) =>
      mapValues(component.props || {}, (prop) => parsePropType(prop.type)),
    );

    return parsedTypes;
  } catch (err) {
    console.error('Error parsing static types.');
    console.error(err);
    return {};
  }
};
