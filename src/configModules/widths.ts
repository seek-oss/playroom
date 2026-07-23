import playroomConfig from '../config';

export type Widths = Array<number | 'Fit to window'>;
export type WidthConfig = number[] | Record<string, number>;

interface WidthOption {
  name?: string;
  width: number;
}

export const normalizeWidths = (widths: WidthConfig): WidthOption[] =>
  Array.isArray(widths)
    ? widths.map((width) => ({ width }))
    : Object.entries(widths).map(([name, width]) => ({ name, width }));

const suppliedWidths = normalizeWidths(
  playroomConfig.widths || [320, 375, 768, 1024]
);

export const getWidthName = (width: Widths[number]) =>
  suppliedWidths.find((option) => option.width === width)?.name;

const widths: Widths = [
  ...suppliedWidths.map((option) => option.width),
  'Fit to window',
];

export default widths;
