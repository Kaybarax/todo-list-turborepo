'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@todo/utils/ui/web';

const navbarVariants = cva('navbar', {
  variants: {
    variant: {
      default: 'bg-base-100',
      primary: 'bg-primary text-primary-content',
      secondary: 'bg-secondary text-secondary-content',
      accent: 'bg-accent text-accent-content',
      neutral: 'bg-neutral text-neutral-content',
    },
    size: {
      sm: 'min-h-12',
      md: 'min-h-16',
      lg: 'min-h-20',
    },
    shadow: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    shadow: 'sm',
  },
});

export interface NavbarProps extends VariantProps<typeof navbarVariants> {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Navbar({ children, variant, size, shadow, className, 'data-testid': testId }: NavbarProps) {
  return (
    <nav className={cn(navbarVariants({ variant, size, shadow }), className)} data-testid={testId}>
      {children}
    </nav>
  );
}

export interface NavbarStartProps {
  children: React.ReactNode;
  className?: string;
}

export function NavbarStart({ children, className }: NavbarStartProps) {
  return <div className={cn('navbar-start', className)}>{children}</div>;
}

export interface NavbarCenterProps {
  children: React.ReactNode;
  className?: string;
}

export function NavbarCenter({ children, className }: NavbarCenterProps) {
  return <div className={cn('navbar-center', className)}>{children}</div>;
}

export interface NavbarEndProps {
  children: React.ReactNode;
  className?: string;
}

export function NavbarEnd({ children, className }: NavbarEndProps) {
  return <div className={cn('navbar-end', className)}>{children}</div>;
}

// Compound component pattern
Navbar.Start = NavbarStart;
Navbar.Center = NavbarCenter;
Navbar.End = NavbarEnd;
