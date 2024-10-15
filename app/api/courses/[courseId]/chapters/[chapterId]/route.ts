import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Mux from '@mux/mux-node';
import { isTeacher } from '@/lib/teacher';

const MuxVideo = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const data = await req.json();

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

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...data,
        isPublished: false,
      },
    });

    // TODO: Handle Video Upload
    if (data.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });
      if (existingMuxData) {
        await MuxVideo.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
      const asset = await MuxVideo.video.assets.create({
        input: data.videoUrl,
        playback_policy: ['public'],
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error(error);
    return new NextResponse('An error occurred. Please try again.', {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;

    if (!userId || !isTeacher(userId)) {
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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });
    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    if (chapter.videoUrl) {
      const muxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });
      if (muxData) {
        await MuxVideo.video.assets.delete(muxData.assetId);
        await db.muxData.delete({
          where: {
            id: muxData.id,
          },
        });
      }
    }

    const deleted = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });
    if (publishedChapters.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deleted);
  } catch (error) {
    console.error(error);
    return new NextResponse('An error occurred. Please try again.', {
      status: 500,
    });
  }
}
