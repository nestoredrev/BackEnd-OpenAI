import { Injectable } from '@nestjs/common';
import { ortographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, translateUseCase } from './use-cases';
import { OrtographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import OpenAI from "openai";

@Injectable()
export class GptService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Solo va a llamar los casos de uso para el tema de mantenimiento y reutilizacion en otras tecnologias (nodejs Exrepss)
  async ortographyCheck( ortographyDto: OrtographyDto ){
    return await ortographyCheckUseCase(this.openai,{
      prompt: ortographyDto.prompt
    });
  }

  async prosConsDicusser( prosConsDiscusserDto: ProsConsDiscusserDto ){
    return await prosConsDicusserUseCase(this.openai,{
      prompt: prosConsDiscusserDto.prompt
    });
  }

  async prosConsDicusserStream( prosConsDiscusserDto: ProsConsDiscusserDto ){
    return await prosConsDicusserStreamUseCase(this.openai,{
      prompt: prosConsDiscusserDto.prompt
    });
  }

  async translate( translateDto: TranslateDto ){
    return await translateUseCase(this.openai,{
      prompt: translateDto.prompt,
      lang: translateDto.lang
    })
  }

}
