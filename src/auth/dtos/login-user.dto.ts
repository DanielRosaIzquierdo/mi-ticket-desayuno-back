import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    password: string;
}
