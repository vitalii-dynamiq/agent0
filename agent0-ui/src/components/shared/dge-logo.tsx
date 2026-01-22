import { cn } from '@/lib/utils';

interface DgeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark';
}

const fullSizeClasses: Record<NonNullable<DgeLogoProps['size']>, string> = {
  sm: 'h-4',
  md: 'h-5',
  lg: 'h-6',
  xl: 'h-12',
};

const markSizeClasses: Record<NonNullable<DgeLogoProps['size']>, string> = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
};

export function DgeLogo({ className, size = 'sm', variant = 'full' }: DgeLogoProps) {
  if (variant === 'mark') {
    return (
      <span className={cn('inline-flex items-center overflow-hidden rounded-md', markSizeClasses[size], className)}>
        <img
          src="/dge-logo.svg"
          alt="Department of Government Enablement"
          className="h-full w-full object-cover object-right dark:hidden"
        />
        <img
          src="/dge-logo-dark.svg"
          alt="Department of Government Enablement"
          className="h-full w-full object-cover object-right hidden dark:block"
        />
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center text-foreground', className)}>
      <img
        src="/dge-logo.svg"
        alt="Department of Government Enablement"
        className={cn(fullSizeClasses[size], 'w-auto dark:hidden')}
      />
      <img
        src="/dge-logo-dark.svg"
        alt="Department of Government Enablement"
        className={cn(fullSizeClasses[size], 'w-auto hidden dark:block')}
      />
    </span>
  );
}
