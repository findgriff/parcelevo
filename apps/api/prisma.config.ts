import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/panel',
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
