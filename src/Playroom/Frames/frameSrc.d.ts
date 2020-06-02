interface FrameParams {
  code: string;
  themeName: string;
}

declare function frameSrc(
  frameParams: FrameParams,
  config: InternalPlayroomConfig
): string;

export default frameSrc;
