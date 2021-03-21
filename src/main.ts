import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Transport } from '@nestjs/microservices';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from '../config';

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
    origin: config.CORSORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    preflightContinue: true,
  });
  app.use(helmet());
  app.startAllMicroservices();
  await app.listen(config.PORT);
  Logger.log(`Server start on ${config.HOST}:${config.PORT}`, 'Bootstrap', true);
}
bootstrap();
