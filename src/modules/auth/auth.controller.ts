import { Controller, Post, Body, HttpCode, Get } from '@nestjs/common';

import { Auth } from './decorators';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './enums';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'User logged in', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('login')
  @HttpCode(200)
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('revalidate')
  @Auth(ValidRoles.USER)
  revalidateToken(@GetUser() user: User) {
    return this.authService.revalidateToken(user);
  }

  @Get('private')
  @Auth(ValidRoles.USER)
  getPrivate(@GetUser() user: User) {
    return {
      user,
    };
  }
}
