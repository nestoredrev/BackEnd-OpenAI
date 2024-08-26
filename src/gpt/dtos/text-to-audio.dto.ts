import { IsOptional, IsString } from "class-validator";

export class TextoToAudioDto{
   
    @IsString()
    prompt: string;
    
    @IsString()
    @IsOptional()
    voice: string;
}