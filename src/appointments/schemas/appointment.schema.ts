import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose'
import { User } from '../../users/schemas/user.schema';

export enum AppointmentStatus {
    CANCELLED = 'cancelled',
    CONFIRMED = 'confirmed',
    PENDING = 'pending'
}

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment{

    @Prop({required: true })
    title!: string

    @Prop({required:true })
    date!: Date

    @Prop({ type: mongoose.Schema.Types.String, default: null})
    description!: string

    @Prop({ type: mongoose.Schema.Types.String, enum:AppointmentStatus, default:AppointmentStatus.PENDING})
    status!: AppointmentStatus

    @Prop({type : Types.ObjectId, ref: 'User', required: true})
    createdBy!: Types.ObjectId

}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);