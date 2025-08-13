import { useContext } from 'react';

import { BasicContext } from './context';

export default () => ({
  hello: () => 'HELLO',
  world: () => 'WORLD',
  contextValue: useContext(BasicContext),
});
