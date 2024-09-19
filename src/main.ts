import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

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
  
  // tamaño maximo de un ficero para subir al servidor
  app.use( bodyParser.json({ limit: '10mb'}) );
  app.use( bodyParser.urlencoded({ limit: '10mb', extended:true }) );

  await app.listen(3000);
}
bootstrap();
