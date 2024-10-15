import IconBadge from '@/components/icon-badge';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: 'default' | 'success';
}

const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant = 'default',
}: InfoCardProps) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className='font-semibold'>{label}</p>
        <p className='text-gray-500'>
          {numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
