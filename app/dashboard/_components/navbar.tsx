import NavbarRoutes from '@/components/navbar-routes';
import MobileSidebar from './mobile-sidebar';
import { PropsWithChildren } from 'react';

const NavBar = ({ children = <MobileSidebar /> }: PropsWithChildren) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      {children}
      <NavbarRoutes />
    </div>
  );
};

export default NavBar;
