import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { SamAssistantModule } from './sam-assistant/sam-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // necesarios para la utilizacion de las varianes de entrono; npm i @nestjs/config
    GptModule,
    SamAssistantModule
  ]
})
export class AppModule {}
