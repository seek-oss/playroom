interface Props {
  size?: number | string;
  title?: string;
}

export const Logo = ({ size = 100, title }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 390 290"
    focusable="false"
    width={size}
  >
    {title ? <title>{title}</title> : undefined}
    <path
      d="M385,285H5V179.42H385ZM92.51,5H5V179.42H92.51ZM210.45,5H92.51V179.42H210.45ZM385,5H210.45V179.42H385Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="4"
    />
  </svg>
);
