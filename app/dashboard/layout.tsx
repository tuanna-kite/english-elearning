import { PropsWithChildren } from 'react';
import Sidebar from './_components/sidebar';
import NavBar from './_components/navbar';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-full'>
      <nav className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
        <NavBar />
      </nav>
      <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='md:pl-56 pt-[80px] h-full'>{children}</main>
    </div>
  );
};

export default DashboardLayout;
