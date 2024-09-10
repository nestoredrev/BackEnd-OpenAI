import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const downloadImageAsPng = async( url:string ) => {

    const response = await fetch( url );

    if(!response.ok) throw new InternalServerErrorException('Download image fail');

    const folderPath = path.resolve('./','./generated/images/');
    fs.mkdirSync(folderPath, {recursive: true}); // asegurar de que siempre exista la ruta, es decir si no existe la crea

    const imageName = `${ new Date().getTime() }.png`; // lo suyo es tener un uuid para nombre unico de los ficheros
    const buffer = Buffer.from( await response.arrayBuffer() );

    fs.writeFileSync(`${ folderPath }/${ imageName }`, buffer);
}