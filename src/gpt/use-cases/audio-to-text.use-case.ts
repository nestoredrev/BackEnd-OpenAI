// Aqui se realizara la conexion a la API o peticiones a la BBDD
// y hay que pasarle exactamente las entradas necesarias ni mas ni menos

import * as fs from "fs";
import OpenAI from "openai";

interface Options {
    audioFile: Express.Multer.File;
    prompt?: string;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options ) => {

    const { audioFile, prompt } = options;
    console.log("🚀 ~ audioToTextUseCase ~ options:", options)
    const response = openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream( audioFile.path ),
        prompt: prompt, // !mismo idioma que el audio! https://platform.openai.com/docs/guides/speech-to-text/prompting.
        language: 'es',
        response_format: 'verbose_json' // informacion mas completa
        // response_format: 'vtt', // subs mas completos que srt
    })
    
    return response;
}