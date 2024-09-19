import { Controller, Post, Body, Res, HttpStatus, Get, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrtographyDto, ProsConsDiscusserDto, TextoToAudioDto, TranslateDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('audioFile',{
      limits: {
        files: 1, // un solo fichero
      },
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${ new Date().getTime() }.${ fileExtension }`; // tambien se puede utilizar el uid para tener un nombre unico para no sobreecribir el fichero
          return callback(null, fileName);
        },
      })
    })
  )
  async audioToText(
    @Body() audioToTextDto: AudioToTextDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'El fichero es mayor de 5MB' }),
          new FileTypeValidator({fileType: 'audio/*'}),
        ]
      })
    ) file: Express.Multer.File
  ){
    const { prompt } = audioToTextDto;
    return this.gptService.audioToText(file, prompt);
  }

  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto
  ){
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:idImage')
  async getGeneratedImage(
    @Param('idImage') idImage:string,
    @Res() res: Response,
  ){
    const filePath = this.gptService.getGeneratedImage(idImage);
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile( filePath );
  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto
  ){
    return await this.gptService.imageVariation(imageVariationDto);
  }

}
