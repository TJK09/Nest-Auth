import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/user.service';    
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ){}

    async register(registerDto: RegisterDto){
        const existing = await this.userService.findByEmail(registerDto.email);
        if (existing) throw new ConflictException('Email already in use');

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.createUser(registerDto.username, registerDto.email, hashedPassword);

        const tokens = await this.generateTokens(user.email, user.role);
        // await this.userService.updateRefreshToken(user.email, tokens.refreshToken);

        return tokens;
    }

    async login(loginDto: LoginDto){
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException('Invalid Credentials');


        const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
        if(!passwordMatch) throw new UnauthorizedException('Incorrect Passowrd')
        
        const tokens = await this.generateTokens(user.email, user.role);
        await this.userService.updateRefreshToken(user.email, tokens.refreshToken);
        
        return tokens;
    }

    async logout(email: string){
        await this.userService.updateRefreshToken(email,null);
    }

    async refreshToken (email: string, refreshToken: string){
        const user = await this.userService.findByEmail(email);
        if (!user || !user.refreshToken ) throw new UnauthorizedException("Invalid RefreshToken")
        
        const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!tokenMatch) throw new UnauthorizedException("Invalid Token")
        
        const tokens = await this.generateTokens(user.email, user.role);
        await this.userService.updateRefreshToken(user.email, tokens.refreshToken);
        return tokens;

    }
    
    private async generateTokens(email: string, role:UserRole){
        const payload = { sub: email, role};

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload,{
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(payload,{
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);


        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateRefreshToken(email, hashedRefresh)

        return { accessToken, refreshToken }
    }
}
