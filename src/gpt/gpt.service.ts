import { Injectable } from '@nestjs/common';
import { ortographyCheckUseCase } from './use-cases';
import { OrtographyDto } from './dtos';
import OpenAI from "openai";

@Injectable()
export class GptService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Solo va a llamar los casos de uso para el tema de mantenimiento y reutilizacion en otras tecnologias (nodejs Exrepss)
  async ortographyCheck(ortographyDto: OrtographyDto){
    return await ortographyCheckUseCase(this.openai,{
      prompt: ortographyDto.prompt
    });
  }

}
