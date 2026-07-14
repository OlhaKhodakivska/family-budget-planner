import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './Button';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export function IconButton({ icon, label, variant = 'ghost', ...props }: IconButtonProps) {
  return <Button icon={icon} iconOnly variant={variant} aria-label={label} title={label} {...props} />;
}
