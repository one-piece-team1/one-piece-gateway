import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { config } from '../config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      validationError: { target: true },
      transform: true,
    }),
  );
  app.setGlobalPrefix(`${config.PREFIX}${config.API_EXPLORER_PATH}`);
  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.startAllMicroservices();
  await app.listen(config.PORT);
  Logger.log(`Server start on ${config.HOST}:${config.PORT}`, 'Bootstrap', true);
}
bootstrap();
