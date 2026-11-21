import type { ComponentPropsWithRef } from 'react';
import styles from './Button.module.css';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button = ({ variant = 'secondary', className, type = 'button', ...props }: ButtonProps) => (
  <button
    type={type}
    className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
    {...props}
  />
);
