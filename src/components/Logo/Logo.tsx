import { useId } from 'react';

interface Props {
  size?: number | string;
  title?: string;
}

export const Logo = ({ size = 100, title }: Props) => {
  const titleId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      focusable="false"
      display="block"
      width={size}
      height={size}
      aria-hidden={title ? true : undefined}
      aria-labelledby={title ? titleId : undefined}
      role={title ? 'img' : undefined}
    >
      {title ? <title id={titleId}>{title}</title> : undefined}
      <path d="M0 100V0L20.5 10.25V89.75L0 100Z" fill="currentColor" />
      <path
        d="M80 40L100 50L80 60L40.5 79.75V59.75L60 50L40.5 40.25V20.25L80 40Z"
        fill="currentColor"
      />
    </svg>
  );
};
