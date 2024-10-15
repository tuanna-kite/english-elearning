import { PrismaClient } from '@prisma/client';
declare global {
  let prisma: PrismaClient | undefined;
}

export const db: PrismaClient = new PrismaClient();

// If we're not in production, let's save `db` to the global object to prevent crashes
// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = db;
// }
