import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorators";
import { UserRole } from "../../users/schemas/user.schema";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    
}