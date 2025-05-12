import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    name: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}
