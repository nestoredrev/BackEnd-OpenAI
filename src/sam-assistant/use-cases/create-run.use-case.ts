import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
}

export const createRunUseCase = async ( openai: OpenAI, options: Options ) => {

    const { threadId, assistantId = 'asst_nrvfFIaU0zeUkILouUyOjIJW' } = options;
 
    const run = await openai.beta.threads.runs.createAndPoll( threadId,{
        assistant_id: assistantId // es el asistente creado en https://platform.openai.com/
    });

    if (run.status === 'completed') {
        const messagesList = await openai.beta.threads.messages.list(
            threadId
        );
        const messages = messagesList.data.map( message => ({
            role: message.role,
            content: message.content.map( contenct => ( contenct as any ).text.value )
        }))

        messages.reverse(); // el primer mensaje es el ultimo

        return messages;
    }
}