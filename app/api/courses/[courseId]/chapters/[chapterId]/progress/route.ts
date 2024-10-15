import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return redirect('/');
    }

    const { isCompleted } = await req.json();

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          chapterId: params.chapterId,
          userId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        isCompleted,
        chapterId: params.chapterId,
        userId,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
