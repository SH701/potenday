import { PrismaClient } from "@prisma/client";

<<<<<<< HEAD
declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  global.prisma ||
=======
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
>>>>>>> 55c74ae (Refactor: 폴더 구조 정리)
  new PrismaClient({
    log: ["error", "warn"],
  });

<<<<<<< HEAD
if (process.env.NODE_ENV !== "production") global.prisma = db;
=======
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
>>>>>>> 55c74ae (Refactor: 폴더 구조 정리)
