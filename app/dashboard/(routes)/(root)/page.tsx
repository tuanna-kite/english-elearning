import { getDashboardCourses } from '@/actions/get-dashboard-courses';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { CheckCircle, Clock } from 'lucide-react';
import InfoCard from './_components/info-card';
import CoursesList from '../search/_components/courses-list';

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InfoCard
          icon={Clock}
          label='In progress'
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          variant='success'
          label='Completed'
          numberOfItems={completedCourses.length}
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
