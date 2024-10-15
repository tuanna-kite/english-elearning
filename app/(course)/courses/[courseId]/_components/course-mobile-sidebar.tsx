import { Menu } from 'lucide-react';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CourseSideBar from './course-sidebar';

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
}

const CourseMobileSidebar = ({ course, progressCount }: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        <CourseSideBar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
