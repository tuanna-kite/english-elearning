import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

type Params = {
  params: {
    courseId: string;
    attachmentId: string;
  };
};

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) return new NextResponse('Unauthorized', { status: 401 });
    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });
    if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 });

    const { courseId, attachmentId } = params;
    const attachment = await db.attachment.delete({
      where: { id: attachmentId, courseId },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error(error);
    return new NextResponse('An error occurred. Please try again.', { status: 500 });
  }
}