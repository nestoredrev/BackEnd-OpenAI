import OpenAI from "openai";
import { downloadImageAsPng } from "src/helpers";

interface Options{
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async ( openai: OpenAI, options: Options ) => {
    
    const { prompt, originalImage, maskImage } = options;
    
    // TODO: verificar imagen original

    const response = await openai.images.generate({
        prompt: prompt,
        model: 'dall-e-3',
        n: 1, // numero de imagenes a generar de momento dall-e-3 solamente permite 1 imagen
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
    });

    //Descargar la imagen generada por AI y guardarla en fisicamente 
    downloadImageAsPng( response.data[0].url );

    return {
        url: response.data[0].url,
        localPath: '',
        revised_prompt: response.data[0].revised_prompt // lo que le llega a dall-e (prompt detallado en ingles)
    }
}