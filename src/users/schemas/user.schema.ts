import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export type UserDocument = User & Document;

@Schema({timestamps: true})

export class User {
    @Prop({ required: true, unique: true })
    username!: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email!: string;

    @Prop({ required: true, })
    password!: string;

    @Prop({ type: mongoose.Schema.Types.String, enum:UserRole ,default: UserRole.USER})
    role!: UserRole;

    @Prop ({ type: mongoose.Schema.Types.String ,default: null })
    refreshToken!: string | null;

}

export const UserSchema = SchemaFactory.createForClass(User);