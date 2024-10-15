import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId } = params;
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }
    const hasPublishedChapters = course.chapters.some(
      (chapter) => chapter.isPublished
    );
    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !hasPublishedChapters ||
      !course.categoryId
    ) {
      return new NextResponse('Course is incomplete', { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: true },
    });
    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log('[Course_ID] PUBLISH:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
