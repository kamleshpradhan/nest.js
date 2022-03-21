import { IsNotEmpty, IsOptional, IsPort, IsString } from "class-validator"

export class EditBookmarksDto{
    @IsString()
    @IsOptional()
    title:string

    @IsString()
    @IsOptional()
    description?: string


    @IsString()
    @IsOptional()
    link:string
}