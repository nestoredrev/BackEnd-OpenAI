import * as path from "path";
import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, ortographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { ImageGenerationDto, OrtographyDto, ProsConsDiscusserDto, TextoToAudioDto, TranslateDto } from './dtos';
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

  async textToAudio( textoToAudioDto: TextoToAudioDto ){
    return await textToAudioUseCase(this.openai,{
      prompt: textoToAudioDto.prompt,
      voice: textoToAudioDto.voice
    })
  }

  getTextToAudio( idFile:string ){

    const filePath = path.resolve( __dirname,'../../generated/audios', `${idFile}.mp3` );

    const wasFound = fs.existsSync( filePath );

    if( !wasFound ) throw new NotFoundException(`Archivo con id: ${idFile} no fue encontrado`);

    return filePath;
  }

  async audioToText( audioFile: Express.Multer.File, prompt?:string ){
    return await audioToTextUseCase(this.openai,{
      audioFile: audioFile,
      prompt: prompt
    })
  }

  async imageGeneration( imageGenerationDto: ImageGenerationDto ){
    return await imageGenerationUseCase(this.openai, {
      prompt: imageGenerationDto.prompt,
      originalImage: imageGenerationDto.originalImage,
      maskImage: imageGenerationDto.maskImage
    })
  }

  getGeneratedImage( idImage:string ){

    const filePath = path.resolve( __dirname,'../../generated/images', `${idImage}.png` );

    const wasFound = fs.existsSync( filePath );

    if( !wasFound ) throw new NotFoundException(`Archivo con id: ${idImage} no fue encontrado`);

    return filePath;
  }

}
