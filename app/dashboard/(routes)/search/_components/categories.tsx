'use client';

import { Category } from '@prisma/client';
import { FcMusic, FcOldTimeCamera, FcSportsMode } from 'react-icons/fc';
import { IconType } from 'react-icons';
import CategoryItem from './category-item';

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category['name'], IconType> = {
  Algebra: FcMusic,
  Geometry: FcOldTimeCamera,
  Calculus: FcSportsMode,
  'Probability & Statistic': FcSportsMode,
  SAT: FcSportsMode,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={iconMap[category.name]}
          value={category.id}
        />
      ))}
    </div>
  );
};

export default Categories;
