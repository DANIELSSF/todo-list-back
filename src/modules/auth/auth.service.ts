import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const user = this.buildNewUser(createUserDto);

    try {
      await this.userRepository.save(user);
      delete user.password;
      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const userEmail = email.toLowerCase().trim();

    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      select: { email: true, password: true, fullName: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    delete user.password;

    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  async revalidateToken(user: User): Promise<any> {
    const { id, fullName, email } = user;
    return { id, fullName, email, token: this.getJwtToken({ id: user.id }) };
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private buildNewUser(createUserDto: CreateUserDto): User {
    const { password, fullName, email } = createUserDto;
    const saltOrRounds: number = 10;

    return this.userRepository.create({
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      password: bcrypt.hashSync(password, saltOrRounds),
    });
  }

  private handleDatabaseErrors(error: any): never {
    const NOT_NULL_VIOLATION = '23502';
    const UNIQUE_VIOLATION = '23505';

    if (error.code === NOT_NULL_VIOLATION)
      throw new BadRequestException(error.message);

    if (error.code === UNIQUE_VIOLATION)
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
