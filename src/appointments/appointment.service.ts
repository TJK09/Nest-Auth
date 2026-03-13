import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Appointment, AppointmentDocument, AppointmentStatus } from "./schemas/appointment.schema";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { rescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { UserRole } from "../users/schemas/user.schema";


@Injectable()

export class AppointmentService{
    constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,){}

    async create (dto: CreateAppointmentDto, userEmail: string): Promise<AppointmentDocument>{
        return this.appointmentModel.create({
            ...dto,
            createdBy: userEmail,
            status: AppointmentStatus.PENDING,
        });
    }

    async findMyAppointments(userEmail: string):Promise<AppointmentDocument[]>{
        return this.appointmentModel.find({createdBy: userEmail}).sort({ date: 1})
    }

    async findAll(): Promise<AppointmentDocument[]>{
        return this.appointmentModel.find().sort({date:1})
    }

    async reschedule (id: string, dto: rescheduleAppointmentDto, userEmail: string, userRole: string,): Promise<AppointmentDocument>{
        const appointment =  await this.appointmentModel.findById(id)
        if(!appointment) throw new NotFoundException('Appointment Not Found')
        
        const isOwner = appointment.createdBy.toString() === userEmail;
        const isAdmin = userRole === UserRole.ADMIN;
        if(!isOwner && !isAdmin) throw new ForbiddenException("Access Denied")

        appointment.date = new Date (dto.date)
        appointment.status =  AppointmentStatus.PENDING
        return appointment.save();
    }

    async cancel (id:string, userEmail: string, userRole: string) : Promise<AppointmentDocument>{
        const appointment = await this.appointmentModel.findById(id)
        if(!appointment) throw new NotFoundException("appointment not found")
        
        const isOwner = appointment.createdBy.toString() === userEmail
        const isAdmin = userRole === UserRole.ADMIN
        if(!isAdmin && !isOwner) throw new ForbiddenException("Access Denied")

        appointment.status = AppointmentStatus.CANCELLED
        return appointment.save();
    }

    async updateStatus(id:string, status:AppointmentStatus): Promise<AppointmentDocument>{
        const appointment = await this.appointmentModel.findById(id)
        if(!appointment) throw new NotFoundException("Appointment Not found")

        appointment.status = status
        return appointment.save()
    }
}