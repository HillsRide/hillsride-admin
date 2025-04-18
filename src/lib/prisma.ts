import { PrismaClient } from '@prisma/client';
import { env } from '@/env.mjs';

// Custom Prisma client options
const prismaClientOptions = {
  log: env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn']
    : ['error'],
  errorFormat: 'pretty'
};

// Singleton pattern with connection management
class PrismaService {
  private static instance: PrismaClient;
  private static isConnected = false;
  private static isShutdown = false;

  public static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient(prismaClientOptions);
      this.setupConnectionHandling();
    }
    return this.instance;
  }

  private static async connect() {
    if (!this.isConnected && !this.isShutdown) {
      try {
        await this.instance.$connect();
        this.isConnected = true;
        console.log('Database connected successfully');
      } catch (error) {
        console.error('Failed to connect to database:', error);
        throw error;
      }
    }
  }

  private static setupConnectionHandling() {
    // Graceful shutdown
    const cleanup = async () => {
      if (this.isConnected && !this.isShutdown) {
        this.isShutdown = true;
        console.log('Closing database connection...');
        await this.instance.$disconnect();
        console.log('Database connection closed');
      }
    };

    // Handle various shutdown signals
    process.on('beforeExit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGUSR2', cleanup); // For nodemon restarts

    // Monitor connection status
    this.instance.$on('query', (e: any) => {
      if (env.NODE_ENV === 'development') {
        console.log('Query:', e.query, e.params);
        // Log slow queries (over 1s)
        if (e.duration > 1000) {
          console.warn(`Slow query detected (${e.duration}ms):`, e.query);
        }
      }
    });
  }

  // Helper method for transactions with retry logic
  public static async transaction<T>(
    fn: (tx: PrismaClient) => Promise<T>,
    attempts = 3
  ): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await this.instance.$transaction(fn as any);
      } catch (error: any) {
        if (i === attempts - 1) throw error;
        if (error.code === 'P2024') { // Connection error
          await new Promise(resolve => setTimeout(resolve, 1000 * i));
          continue;
        }
        throw error;
      }
    }
    throw new Error('Transaction failed after multiple attempts');
  }
}

// Export singleton instance
const prisma = PrismaService.getInstance();
export default prisma;

// Export helper types
export type Prisma = PrismaClient;
export type Transaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;