import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  await app.register(helmet);
  await app.register(cors, {
    origin: (process.env.CORS_ALLOWLIST || 'http://localhost:3000').split(','),
    credentials: true,
  });

  app.setGlobalPrefix('v1');
  const port = Number(process.env.PORT || 5050);
  const host = '127.0.0.1';
  await app.listen({ port, host });
}

bootstrap().catch((error) => {
  console.error('Application bootstrap failed', error);
  process.exit(1);
});
