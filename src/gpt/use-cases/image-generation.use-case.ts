import * as fs from 'fs';
import * as path from 'path';
import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";

interface Options{
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async ( openai: OpenAI, options: Options ) => {
    
    const { prompt, originalImage, maskImage } = options;
    
    // TODO: verificar imagen original
    //originalImage es la imagen principal
    //maskImage es la imagen con el contorno borrado para que AI genere en ese hueco el contenido
    // https://platform.openai.com/docs/guides/images/introduction?context=node&lang=node.js
    if( !originalImage || !maskImage ){

        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1, // numero de imagenes a generar de momento dall-e-3 solamente permite 1 imagen
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        });
    
        //Descargar la imagen generada por AI y guardarla en fisicamente 
        const fileName = await downloadImageAsPng( response.data[0].url );
        const url = `${ process.env.SERVER_URL }/gpt/image-generation/${ fileName }`;
    
        return {
            url: url,
            openAIUrl: response.data[0].url,
            revised_prompt: response.data[0].revised_prompt // lo que le llega a dall-e (prompt detallado en ingles)
        }
    }

    //originalImage=localhost:3000/gpt/image-generation/1725972327697
    //maskImage=base64;DASDASDasdasdasAVCDVCDLÑKDFGJDTRE
    const pngImagePath = await downloadImageAsPng( originalImage, true );
    const maskImagePath = await downloadBase64ImageAsPng( maskImage, true );

    const response = await openai.images.edit({
        model: 'dall-e-3',
        prompt: prompt,
        image: fs.createReadStream( pngImagePath ),
        mask: fs.createReadStream( maskImagePath ),
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    });



    const fileName = await downloadImageAsPng( response.data[0].url );
    const url = `${ process.env.SERVER_URL }/gpt/image-generation/${ fileName }`;

    return {
        url: url,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt // lo que le llega a dall-e (prompt detallado en ingles)
    }


}