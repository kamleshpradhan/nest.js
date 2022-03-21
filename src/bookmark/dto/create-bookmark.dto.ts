import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBookmarksDto{
    @IsString()
    @IsNotEmpty()
    title:string

    @IsString()
    @IsOptional()
    desccription?: string


    @IsString()
    @IsNotEmpty()
    link:string
}