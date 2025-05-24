import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) { }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async validatePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    async generateToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async register(name: string, email: string, password: string): Promise<any> {
        const userExists = await this.authRepository.findUserByEmail(email);
        if (userExists) {
            throw new Error('User already exists');
        }
        const hashedPassword = await this.hashPassword(password);
        const user = await this.authRepository.saveUser(name, email, hashedPassword);
        return user;
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User not exists');
        }

        const isPasswordValid = await this.validatePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken({ email: user.email, sub: user.id, role: user.role });
        return token;
    }
}
