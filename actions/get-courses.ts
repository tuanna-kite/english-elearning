import { Category, Course } from '@prisma/client';
import { getProgress } from './get-progress';
import { db } from '@/lib/db';

export type CourseWithProgress = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

export type GetCourses = {
  userId: string | null;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgress[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          search: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: userId
          ? {
              where: {
                userId,
              },
            }
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!userId) {
      return courses.map((course) => ({
        ...course,
        progress: null,
      }));
    }
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }
        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          progress,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log('[GET_COURSES_ERROR]', error);
    return [];
  }
};
