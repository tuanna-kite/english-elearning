import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { PropsWithChildren } from 'react';

const TeacherLayout = ({ children }: PropsWithChildren) => {
  const { userId } = auth();

  if (!isTeacher(userId)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default TeacherLayout;
