// Aqui se realizara la conexion a la API o peticiones a la BBDD
// y hay que pasarle exactamente las entradas necesarias ni mas ni menos

import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDicusserUseCase = async (openai: OpenAI, options: Options ) => {

    const { prompt } = options;
    
    const completion = await openai.chat.completions.create({
        messages: [
            {   
                role: "system", 
                content: `
                    Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras.
                    La respuesta debe de ser en formato markdown.
                    Los pros y contras deben de estar en una lista.
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-4o-mini",
        temperature: 0.8, // cuanto mas pequeña es la cuata mas enfocada y determina sera la respuesta
        max_tokens: 1500,  // maximo de consumo de la cuota o salgo al utilizar openAI
      });
    
      return completion.choices[0].message;
}