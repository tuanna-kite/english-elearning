import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) return new NextResponse('Unauthorized', { status: 401 });

    const { courseId } = params;
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 });

    const { url, name } = await req.json();
    const attachment = await db.attachment.create({
      data: {
        name: name ? name : url.split('/').pop(),
        courseId,
        url,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error(error);
    return new NextResponse('An error occurred. Please try again.', { status: 500 });
  }
}
