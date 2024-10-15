import React from 'react';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface CourseProgressProps {
  value: number;
  variant?: 'default' | 'success';
  size?: 'default' | 'sm';
}

const colorByVariant = {
  default: 'text-sky-700',
  success: 'text-emerald-700',
};

const sizeByVariant = {
  default: 'text-sm',
  sm: 'text-xs',
};

const CourseProgress = ({
  value,
  variant = 'default',
  size = 'default',
}: CourseProgressProps) => {
  return (
    <div className='space-y-1'>
      <Progress className='h-2' value={value} variant={variant} />
      <p
        className={cn(
          'font-semibold text-sky-700',
          colorByVariant[variant],
          sizeByVariant[size]
        )}
      >
        {Math.round(value)}% complete
      </p>
    </div>
  );
};

export default CourseProgress;
