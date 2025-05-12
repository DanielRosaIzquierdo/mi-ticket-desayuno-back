import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt-strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'ticket-desayuno-pi',
      signOptions: { expiresIn: '3600s' },

    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy]
})
export class AuthModule { }
