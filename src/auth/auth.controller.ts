import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        try {
            const userId = await this.authService.register(
                registerUserDto.name,
                registerUserDto.email,
                registerUserDto.password,
            );
            return { message: "Register success", userId };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        try {
            const token = await this.authService.login(
                loginUserDto.email,
                loginUserDto.password,
            );
            return { message: 'Login success', token };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
    }

     @Get('user/:id')
    async getUserById(@Param('id') id: string) {
        const user = await this.authService.getUserById(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const { passwordHash, ...userSafe } = user;
        return userSafe;
    }
}