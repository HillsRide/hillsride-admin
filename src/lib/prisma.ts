import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  }).$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        const startTime = Date.now();
        try {
          return await query(args);
        } finally {
          const duration = Date.now() - startTime;
          if (duration > 1000) {
            console.warn(`Slow query detected (${duration}ms) in ${process.env.NODE_ENV}:`, {
              operation,
              args
            });
          }
        }
      }
    }
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Cleanup connections
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;