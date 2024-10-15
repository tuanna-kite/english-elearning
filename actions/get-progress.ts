import { db } from '@/lib/db';

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const completedChapters = await db.userProgress.findMany({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage = Math.round(
      (completedChapters.length / publishedChapters.length) * 100
    );
    return progressPercentage;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
