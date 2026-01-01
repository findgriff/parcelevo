import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL required'),
  REDIS_URL: z.string().optional(),

  JWT_SECRET: z.string().min(16, 'Use a long JWT secret'),
  MAGICLINK_FROM: z.string().email().or(z.string().min(1)),
  MAGICLINK_SMTP_URL: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),

  PUBLIC_BASE_URL: z.string().url(),
  UPLOAD_DIR: z.string().default('/app/uploads'),

  CORS_ALLOWLIST: z.string().default('http://localhost:3000'),
  SEED_OPS_EMAIL: z.string().email().default('ops@parcelevo.com'),
});

export type Env = z.infer<typeof EnvSchema>;

export const loadEnv = (): Env => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = JSON.stringify(parsed.error.format(), null, 2);
    throw new Error(`Invalid environment: ${details}`);
  }
  return parsed.data;
};
