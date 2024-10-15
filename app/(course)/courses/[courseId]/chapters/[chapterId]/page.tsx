import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import getChapter from '@/actions/get-chapter';
import Banner from '@/components/banner';
import CourseEnrollButton from './_components/course-enroll-button';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';
import { File } from 'lucide-react';
import CourseProgressButton from './_components/course-progress-button';

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const { chapter, course, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      userId,
      courseId: params.courseId,
      chapterId: params.chapterId,
    });

  if (!chapter || !course) {
    return redirect('/not-found');
  }

  const isLocked = !chapter.isFree && !purchase;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant='success' label='You already completed this chapter.' />
      )}
      {isLocked && (
        <Banner
          variant='warning'
          label='You need purchase this course to watch this chapter.'
        />
      )}

      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4 w-full aspect-video'>
          <iframe
            width='100%'
            height='100%'
            src={chapter.videoUrl!}
            title={chapter.title}
          ></iframe>
        </div>
        <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
          <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
          {purchase || course.price === 0 ? (
            <CourseProgressButton
              courseId={params.courseId}
              chapterId={chapter.id}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price}
            />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description!} />
        </div>
        {!!attachments.length && (
          <>
            <Separator />
            <div className='p-4 space-y-2'>
              <h3 className='font-semibold text-xl'>Attachments</h3>
              {attachments.map((attachment) => (
                <a
                  className='flex items-center p-3 w-full bg-sky-200/25 border text-sky-700 rounded-md hover:underline space-x-2'
                  key={attachment.id}
                  href={attachment.url}
                >
                  <File />
                  <span>{attachment.name}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
