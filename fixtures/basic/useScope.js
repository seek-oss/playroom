import { useContext } from 'react';

import { BasicContext } from './context.js';

export default () => ({
  hello: () => 'HELLO',
  world: () => 'WORLD',
  contextValue: useContext(BasicContext),
});
