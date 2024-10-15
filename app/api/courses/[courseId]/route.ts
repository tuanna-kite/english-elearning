import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Mux from '@mux/mux-node';
import { isTeacher } from '@/lib/teacher';

const { video: MuxVideo } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// PATCH /api/courses/[courseId]
export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId } = params;
    const data = await req.json();
    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...data },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[Course_ID] PATCH:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await MuxVideo.assets.delete(chapter.muxData.assetId);
      }
    }

    const deleted = await db.course.delete({ where: { id: courseId, userId } });

    return NextResponse.json(deleted);
  } catch (error) {
    console.log('[Course_ID] DELETE:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
