import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import { createMessageUseCase, createRunUseCase, createThreadUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  async createThread() {
    return await createThreadUseCase( this.openai );
  }

  async userQuestion( questionDto: QuestionDto ){
    
    const { threadId } = questionDto;

    /**
     * Una vez creado el Thread se le añaden los mensajes como si fuera una caja.
     */
    const message = await createMessageUseCase( this.openai, questionDto );

    /**
     * Ese Theread es ejecutado y cuando llegue al estado de completo devuelve los mensajes
     * como se puede observar en el UseCase.
     */
    const complitedRun = await createRunUseCase(this.openai, { threadId });
    return complitedRun;
  }

}
