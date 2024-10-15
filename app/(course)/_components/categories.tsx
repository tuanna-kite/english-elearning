'use client';

import { Category } from '@prisma/client';
import CategoryItem from './category-item';

interface CategoriesProps {
  items: Category[];
}

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className='flex flex-col gap-y-2 overflow-x-auto pb-2'>
      {items.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </div>
  );
};

export default Categories;
