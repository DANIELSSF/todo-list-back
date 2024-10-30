import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from './entities/user.entity';
import { authEnvs } from './config/authEnvs';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: authEnvs.jwtSecret,
          signOptions: { expiresIn: authEnvs.jwtExpiresIn },
        };
      },
    }),
  ],
  exports: [JwtStrategy, JwtModule, PassportModule, AuthService, TypeOrmModule],
})
export class AuthModule {}
