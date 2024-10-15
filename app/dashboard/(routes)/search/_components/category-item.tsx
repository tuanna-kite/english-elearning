'use client';
import { cn } from '@/lib/utils';
import qs from 'query-string';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconType } from 'react-icons';

interface CategoryItemProps {
  label: string;
  icon?: IconType;
  value: string;
}

const CategoryItem = ({ label, value }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');
  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: isSelected ? null : value,
          title: currentTitle,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      type='button'
      className={cn(
        'px-3 py-2 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition',
        isSelected && 'border-sky-700 bg-sky-200/20 text-sky-800'
      )}
      onClick={onClick}
    >
      <span>{label}</span>
    </button>
  );
};

export default CategoryItem;
