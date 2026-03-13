import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Res, UseGuards } from "@nestjs/common";\
import type { Request } from "express";
import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { rescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { UserRole } from "../users/schemas/user.schema";
import { AppointmentStatus } from "./schemas/appointment.schema";

@Controller('appointment')
@UseGuards (JwtAuthGuard)
export class AppointmentController{
    constructor (private appointmentService: AppointmentService){}

    @Post()
    async create (@Body() dto:CreateAppointmentDto, @Req() req: Request){
        return this.appointmentService.create(dto, req.user!['email'])
    }

    @Get('my')
    async getMyAppointments (@Req() req:Request){
        return this.appointmentService.findMyAppointments(req.user!['email'])
    }

    @Patch(':id/reschedule')
    async reschedule(
        @Param('id') id:string,
        @Body() dto: rescheduleAppointmentDto,
        @Req() req:Request,
    ){
        return this.appointmentService.reschedule(id, dto, req.user!['email'], req.user!['role'])
    }

    @Delete('id')
    async cancel (@Param('id') id:string, @Req() req:Request){
        return this.appointmentService.cancel(id, req.user!['email'], req.user!['role'])
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)

    async findAll(){
        return this.appointmentService.findAll()
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    
    async updateStatus(
        @Param('id') id: string,
        @Body() status: AppointmentStatus,
    ){
        return this.appointmentService.updateStatus(id, status)
    }

    
}