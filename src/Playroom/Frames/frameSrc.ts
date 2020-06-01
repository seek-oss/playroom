/* eslint-disable-next-line import/no-unresolved */
// @ts-ignore
import { frameSrc } from '__PLAYROOM_ALIAS__FRAME_COMPONENT__';

interface FrameParams {
  code: string;
  themeName: string;
}
const defaultFrameSrc = (
  { code, themeName }: FrameParams,
  { baseUrl, paramType }: InternalPlayroomConfig
) =>
  `${baseUrl}frame.html${
    paramType === 'hash' ? '#' : ''
  }?themeName=${encodeURIComponent(themeName)}&code=${encodeURIComponent(
    code
  )}`;

export default frameSrc ? frameSrc : defaultFrameSrc;
