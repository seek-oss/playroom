import clsx, { type ClassValue } from 'clsx';
import type { AllHTMLAttributes, ElementType } from 'react';
import { sprinkles, type Sprinkles } from '../sprinkles.css';

interface BoxProps
  extends Omit<
      AllHTMLAttributes<HTMLElement>,
      'width' | 'height' | 'className' | 'data'
    >,
    Sprinkles {
  className?: ClassValue;
  component?: ElementType;
}

export const Box = ({
  component = 'div',
  className,
  ...restProps
}: BoxProps) => {
  const atomProps: Record<string, unknown> = {};

  for (const key in restProps) {
    if (sprinkles.properties.has(key as keyof Sprinkles)) {
      atomProps[key] = restProps[key as keyof typeof restProps];
      delete restProps[key as keyof typeof restProps];
    }
  }

  const userClasses = clsx(className);
  const atomClasses = clsx(sprinkles({ ...atomProps }));
  const classes = clsx(userClasses, atomClasses);

  const Component = component;

  return <Component className={classes} {...restProps} />;
};
