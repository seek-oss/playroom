import * as styles from './LoadingIcon.css';

interface Props {
  size?: number | string;
}

export default ({ size = 24 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    width={size}
    height={size}
    fill="none"
    className={styles.loader}
  >
    <circle
      strokeLinecap="round"
      strokeDasharray="70"
      stroke="currentcolor"
      strokeWidth="8"
      r="46"
      cy="50"
      cx="50"
    />
  </svg>
);
