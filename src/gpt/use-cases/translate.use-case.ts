// Aqui se realizara la conexion a la API o peticiones a la BBDD
// y hay que pasarle exactamente las entradas necesarias ni mas ni menos

import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options ) => {

    const { prompt, lang } = options;
    
    const completion = await openai.chat.completions.create({
        messages: [
            {   
                role: "system", 
                content: `
                    Traduce el siguiente texto al idioma ${ lang }:${ prompt }
                `
            }
        ],
        model: "gpt-4o-mini",
        temperature: 0.2, // cuanto mas pequeña es la cuata mas enfocada y determina sera la respuesta
        max_tokens: 150,  // maximo de consumo de la cuota o salgo al utilizar openAI
      });
      
      return { message: completion.choices[0].message.content };
}