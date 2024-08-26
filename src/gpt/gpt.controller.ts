import { Controller, Post, Body, Res, HttpStatus, Get, Param } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrtographyDto, ProsConsDiscusserDto, TextoToAudioDto, TranslateDto } from './dtos';
import type { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  /*Aqui van los nombres de los End-Points con los metodos CRUD necesarios recibiendo las entrdas y devolviendo unicamente la salida
  y tambien se va validar la informacion de entrada antes de llamar el servicio*/

  // Decorador
  @Post('ortography-check')
  ortographyCheck(
    @Body() ortographyDto: OrtographyDto,
  ){
    return this.gptService.ortographyCheck(ortographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ){
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ){
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);
    res.setHeader('Content-Type','application/json');
    res.status(HttpStatus.OK);

    for await( const chunk of stream ){
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translateText(
    @Body() translateDto: TranslateDto
  ){
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textoToAudioDto: TextoToAudioDto,
    @Res() res: Response,
  ){
    const filePath = await this.gptService.textToAudio(textoToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile( filePath );
  }

  @Get('text-to-audio/:idFile')
  async getTextToAudio(
    @Param('idFile') idFile:string,
    @Res() res: Response,
  ){
    const filePath = await this.gptService.getTextToAudio(idFile);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile( filePath );
  }

}
