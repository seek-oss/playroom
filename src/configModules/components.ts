// Import as a side-effect here so parse-prop-types would patch "prop-types" before components import.
import 'parse-prop-types';

import * as sourceComponents from '__PLAYROOM_ALIAS__COMPONENTS__';

// Exclude undefined components, e.g. an exported TypeScript type.
const components = Object.fromEntries(
  Object.entries(sourceComponents).filter(([_, value]) => value)
);

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export default components as typeof import('__PLAYROOM_ALIAS__COMPONENTS__').default;
