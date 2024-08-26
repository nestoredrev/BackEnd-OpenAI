// Aqui se realizara la conexion a la API o peticiones a la BBDD
// y hay que pasarle exactamente las entradas necesarias ni mas ni menos

import * as path from "path";
import * as fs from "fs";
import OpenAI from "openai";

interface Options {
    prompt: string;
    voice: string;
}

export const textToAudioUseCase = async (openai: OpenAI, options: Options ) => {

    const { prompt, voice } = options;

    const voices = {
        'nova': 'nova',
        'alloy': 'alloy',
        'onyx': 'onyx',
        'echo': 'echo',
        'fable': 'fable',
        'shimmer': 'shimmer'
    }

    // asegurar una voz por defecto por si la entrada voice no es correcta
    const selectedVoice = voices[voice] ?? 'nova';

    const folderPath = path.resolve( __dirname,'../../../generated/audios' );
    const speachFile = path.resolve ( `${folderPath}/${new Date().getTime()}.mp3` );

    // recursive true crea de manera recursiva los directorios que no existen en folderPath
    fs.mkdirSync( folderPath, { recursive: true } );

    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: selectedVoice,
        input: prompt,
        // speed: 0.9,
        response_format: 'mp3'
    })

    const buffer = Buffer.from( await mp3.arrayBuffer() );
    fs.writeFileSync( speachFile, buffer );    

    return speachFile;
}