import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { list } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const ownCourse = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    for (const item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }
    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('An error occurred. Please try again.', { status: 500 });
  }
}
