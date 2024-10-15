import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
      return new Response('Unauthorized', { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) {
      return new Response('Unauthorized', { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: 'desc' },
    });

    const position = lastChapter ? lastChapter.position + 1 : 1;
    const { title } = await req.json();
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position,
      },
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.error(error);
    return new Response('An error occurred. Please try again.', { status: 500 });
  }
}
