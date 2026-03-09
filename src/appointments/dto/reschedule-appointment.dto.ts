import { IsString, IsDateString } from "class-validator";

export class rescheduleAppointmentDto{
    
    @IsDateString()
    date: string
}