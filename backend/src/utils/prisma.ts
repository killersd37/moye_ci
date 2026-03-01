import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

const isDev = process.env.NODE_ENV === 'development';

// Singleton Prisma pour éviter plusieurs connexions en dev (HMR)
export const prisma =
    global.__prisma ??
    new PrismaClient({
        log: isDev
            ? ['query', 'error', 'warn']
            : ['error'],
    });

if (isDev) {
    global.__prisma = prisma;
}
