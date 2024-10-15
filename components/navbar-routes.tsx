'use client';

import SearchInput from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { isTeacher } from '@/lib/teacher';
import { useAuth, UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname.startsWith('/teacher');
  const isCoursePage = pathname.includes('/courses');

  return (
    <>
      <div className='hidden md:block'>
        <SearchInput />
      </div>
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href='/'>
            <Button size='sm' variant='ghost'>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : (userId && isTeacher(userId)) ? (
          <Link href='/dashboard/teacher/courses'>
            <Button size='sm' variant='ghost'>
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        {userId ? (
          <UserButton />
        ) : (
          <div className='space-x-4'>
            <Link href='/sign-in'>
              <Button variant='ghost'>Sign In</Button>
            </Link>
            <Link href='/sign-up'>
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default NavbarRoutes;
