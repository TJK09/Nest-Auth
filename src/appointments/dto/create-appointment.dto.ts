import { IsString, IsOptional, IsDateString } from "class-validator";

export class CreateAppointmentDto {

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string

    @IsDateString()
    date : string 
}