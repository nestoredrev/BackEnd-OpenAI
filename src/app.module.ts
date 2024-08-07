import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    GptModule,
    ConfigModule.forRoot() // necesarios para la utilizacion de las varianes de entrono; npm i @nestjs/config
  ]
})
export class AppModule {}
