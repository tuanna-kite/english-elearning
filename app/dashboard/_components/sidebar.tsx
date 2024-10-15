import React, { PropsWithChildren } from 'react';
import Logo from './logo';
import SidebarRoutes from './sidebar-routes';
import Link from 'next/link';

const Sidebar = ({ children = <SidebarRoutes /> }: PropsWithChildren) => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
      <div className='p-6'>
        <Link href='/'>
          <Logo />
        </Link>
      </div>
      <div className='flex flex-col w-full'>{children}</div>
    </div>
  );
};

export default Sidebar;
