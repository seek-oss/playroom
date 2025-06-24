export default {
  moduleNameMapper: {
    // Stubbing to basic config. Unit tests should not rely on
    // a Playroom config object, instead test private functions
    // that accept dependencies. See `componentsToHints` test.
    __PLAYROOM_ALIAS__COMPONENTS__:
      '<rootDir>/cypress/projects/basic/components.js',
  },
  globals: {
    // Same as `__PLAYROOM_ALIAS__COMPONENTS__` above.
    __PLAYROOM_GLOBAL__STATIC_TYPES__: {},
  },
};
