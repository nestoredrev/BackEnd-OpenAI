import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp'; // conversor y tratamiento de imagenes

export const downloadImageAsPng = async( url:string, fullPath:boolean = false ) => {

    const response = await fetch( url );

    if(!response.ok) throw new InternalServerErrorException('Download image fail');

    const folderPath = path.resolve('./','./generated/images/');
    fs.mkdirSync(folderPath, {recursive: true}); // asegurar de que siempre exista la ruta, es decir si no existe la crea

    const imageName = `${ new Date().getTime() }.png`; // lo suyo es tener un uuid para nombre unico de los ficheros
    const buffer = Buffer.from( await response.arrayBuffer() );

    // fs.writeFileSync(`${ folderPath }/${ imageName }`, buffer);

    const completePath = path.join( folderPath,imageName );

    await sharp( buffer )
        .png() // transforma el baffer en PNG
        .ensureAlpha()
        .toFile( completePath );
    
    return fullPath ? completePath : imageName;

}



export const downloadBase64ImageAsPng = async ( base64Image: string , fullPath:boolean = false ) => {

    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
  
    const imageNamePng = `${ new Date().getTime() }-64.png`;
  
    const completePath = path.join( folderPath,imageNamePng );
  
    // Transformar a RGBA, png // Así lo espera OpenAI
    await sharp(imageBuffer)
      .png()
      .ensureAlpha()
      .toFile( completePath );
  
    return fullPath ? completePath : imageNamePng;
  
  }