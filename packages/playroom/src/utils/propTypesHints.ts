// Deprecated: remove in the next major, along with its side-effect import in `configModules/components.ts`.

// @ts-expect-error
import ppt from 'parse-prop-types';

// interop with esm build and cjs in jest
const parsePropTypes = typeof ppt === 'function' ? ppt : ppt.default;

export const getPropTypesHints = (component: unknown) => {
  const { children, ...filteredPropTypes } = parsePropTypes(component);

  return Object.fromEntries(
    Object.entries(filteredPropTypes).map(
      ([propName, { type }]: [string, any]) => [
        propName,
        type.name === 'oneOf'
          ? type.value.filter((x: any) => typeof x === 'string')
          : null,
      ],
    ),
  );
};

export const warnAboutPropTypesHints = (componentNames: string[]) => {
  if (componentNames.length === 0) {
    return;
  }

  // eslint-disable-next-line no-console
  console.warn(
    [
      `Playroom: Editor hints for the following components were derived from runtime \`propTypes\`: ${componentNames.join(', ')}.`,
      'Support for propTypes-based hints is deprecated and will be removed in the next major version.',
      'Migrate these components to TypeScript to keep receiving hints: https://github.com/seek-oss/playroom#typescript-support',
    ].join('\n'),
  );
};
