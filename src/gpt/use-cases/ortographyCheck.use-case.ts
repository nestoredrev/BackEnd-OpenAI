// Aqui se realizara la conexion a la API o peticiones a la BBDD
// y hay que pasarle exactamente las entradas necesarias ni mas ni menos

import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const ortographyCheckUseCase = async (openai: OpenAI, options: Options ) => {

    const { prompt } = options;
    
    const completion = await openai.chat.completions.create({
        messages: [
            {   
                role: "system", 
                content: `
                    Seras un especialista de la RAE(Real Academia Española) y te seran proveídos textos en español
                    con posibles errores ortograficos y gramaticales.
                    Las palabras usadas deben de existir en el diccionario de la Real Academia Española (RAE).
                    Debe de responder en formato JSON.
                    Tu area es corregir y retornar informacion solucionada, tambien debes de dar por porcentaje
                    de acierto por el usuario.

                    Si no hay errores, debes de retornar un mensaje de felicitacion. 

                    Ejemplo de salida:
                    {
                        userScore: number,
                        errors: string[], // ['error -> solución']
                        message: string, // Usa emojis y texto para felicitar al usuario
                    }
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-4o-mini",
        temperature: 0.3, // cuanto mas pequeña es la cuata mas enfocada y determina sera la respuesta
        max_tokens: 150,  // maximo de consumo de la cuota o salgo al utilizar openAI,
        response_format: {
            type: 'json_object'
        }
      });
    
      const jsonResponse = JSON.parse( completion.choices[0].message.content );
      return jsonResponse;
}