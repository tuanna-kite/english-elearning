import React from 'react';
import { db } from '@/lib/db';
import Categories from './_components/categories';
import SearchInput from '@/components/search-input';
import { auth } from '@clerk/nextjs/server';
import { getCourses } from '@/actions/get-courses';
import CoursesList from './_components/courses-list';
import Sidebar from '../dashboard/_components/sidebar';
import NavBar from '../dashboard/_components/navbar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <div className='h-screen overflow-auto'>
      <nav className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
        <NavBar>
          <Sheet>
            <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
              <Menu />
            </SheetTrigger>
            <SheetContent side='left' className='p-0 bg-white'>
              <Sidebar>
                <Categories items={categories} />
              </Sidebar>
            </SheetContent>
          </Sheet>
        </NavBar>
      </nav>
      <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
        <Sidebar>
          <Categories items={categories} />
        </Sidebar>
      </div>
      <div className='md:pl-56 pt-[80px] h-full'>
        <div className='px-6 pt-6 block md:hidden'>
          <SearchInput />
        </div>
        <div className='p-6 space-y-4'>
          <CoursesList items={courses} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
