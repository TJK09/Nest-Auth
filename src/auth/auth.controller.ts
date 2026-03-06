import { Controller, Post, Body, Res, Req, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { refreshAuthGuard } from "./guards/jwt-refresh.guard";

@Controller('auth')

export class AuthController{
    constructor(private authservice: AuthService){}

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({passthrough: true}) res: Response){
        const tokens = await this.authservice.register(dto);
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
        return { message : "Register Successfully"}
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login (@Body() dto:LoginDto, @Res({passthrough:true}) res: Response){
        const tokens = await this.authservice.login(dto);
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
        return { message : "logged in Successfully"}
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout (@Req() req: Request, @Res({passthrough:true}) res:Response){
        const user =  req.user as { email: string};
        await this.authservice.logout(user.email);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return { message : "Logged out Successfully "}
    }

    @Post("refresh")
    @UseGuards(refreshAuthGuard)
    @HttpCode(HttpStatus.OK)
    async refresh (@Req() req: Request, @Res({passthrough: true}) res:Response){
        const {email, refreshToken } = req.user as { email: string, refreshToken: string};
        const tokens = await this.authservice.refreshToken(email, refreshToken)
        this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
        return { message: "Tokens Accessed Refreshed"}
    }

    private setTokenCookies(res: Response, accessToken: string, refreshToken: string){
        res.cookie('accessToken', accessToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })
    }
}