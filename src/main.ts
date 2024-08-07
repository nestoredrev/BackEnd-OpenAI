import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Necesario para verificar y validar cada uno de los End-Points
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );

  // Configurar el blackList o/y whiteList en Corse
  app.enableCors({});

  await app.listen(3000);
}
bootstrap();
