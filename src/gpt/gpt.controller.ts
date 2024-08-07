import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrtographyDto } from './dtos';

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

}
