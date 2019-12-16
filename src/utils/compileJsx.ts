import { transform } from 'buble';

export default (code: string) =>
  transform(`<React.Fragment>${code.trim() || ''}</React.Fragment>`).code;
