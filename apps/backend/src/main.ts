import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  await app.listen(3001);
  console.log('StellarID backend listening on http://localhost:3001');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
