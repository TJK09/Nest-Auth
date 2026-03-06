import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";


@Injectable()

export class UserService{
    constructor(@InjectModel(User.name) private UserModel: Model <UserDocument>){}

    async createUser(username: string, email:string, password:string) : Promise<UserDocument> {
        return this.UserModel.create({username, email, password: hashPassword(password)});
    }

    async findByEmail(email:string): Promise<UserDocument | null> {
        return this.UserModel.findOne({ email });
    }

    async findById(id: string):Promise<UserDocument | null> {
        return this.UserModel.findById(id);
    }

}