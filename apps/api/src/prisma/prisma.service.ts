import { Injectable, INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const skipConnect =
  !databaseUrl || process.env.PRISMA_SKIP_CONNECT === '1';
let adapter: PrismaPg | undefined;
if (databaseUrl) {
  const pool = new Pool({ connectionString: databaseUrl });
  adapter = new PrismaPg(pool);
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super(adapter ? { adapter } : undefined);
  }

  async onModuleInit() {
    if (skipConnect) {
      return;
    }
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    (this.$on as any)('beforeExit', async () => {
      await app.close();
    });
  }
}
