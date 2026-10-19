import playroomConfig from '../config';

export type Widths = Array<number | 'Fit to window'>;

const suppliedWidths = playroomConfig.widths || [320, 375, 768, 1024];
const widths: Widths = [...suppliedWidths, 'Fit to window'];

export default widths;
