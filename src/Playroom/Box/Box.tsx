import clsx, { type ClassValue } from 'clsx';
import { forwardRef, type AllHTMLAttributes, type ElementType } from 'react';

import { sprinkles, type Sprinkles } from '../../css/sprinkles.css';

interface BoxProps
  extends Omit<
      AllHTMLAttributes<HTMLElement>,
      'width' | 'height' | 'className' | 'data'
    >,
    Sprinkles {
  className?: ClassValue;
  component?: ElementType;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ component = 'div', className, ...restProps }, ref) => {
    const atomProps: Record<string, unknown> = {};

    for (const key in restProps) {
      if (sprinkles.properties.has(key as keyof Sprinkles)) {
        atomProps[key] = restProps[key as keyof typeof restProps];
        delete restProps[key as keyof typeof restProps];
      }
    }

    const classes = clsx(className, sprinkles({ ...atomProps }));
    const Component = component;

    return <Component ref={ref} className={classes} {...restProps} />;
  }
);
