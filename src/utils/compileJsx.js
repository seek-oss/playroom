import { transform } from 'buble';

export default code =>
  transform(`<React.Fragment>${code.trim() || ''}</React.Fragment>`).code;
