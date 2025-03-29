import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password/password.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // validate the password
    if (!this.passwordService.validatePassword(registerDto.password)) {
      return {
        error: 'Password is not strong enough',
      };
    }

    // check if the email is already in use
    const user = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (user) {
      return {
        error: 'Email is already in use',
      };
    }

    try {
      // hash the password
      const hashedPassword = await this.passwordService.hashPassword(
        registerDto.password,
      );
      // create the user
      const user = await this.prisma.user.create({
        data: {
          full_name: registerDto.fullName,
          email: registerDto.email,
          password_hash: hashedPassword,
        },
      });

      const { password_hash, ...result } = user;
      const payload = { email: user.email, id: user.id };
      const token = this.jwtService.sign(payload);

      return {
        token,
        user: result,
      };
    } catch (error) {
      return {
        error: 'Error creating user. Please try again.',
      };
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        error: 'Invalid email or password',
      };
    }

    const validPassword = await this.passwordService.comparePassword(
      password,
      user.password_hash,
    );

    if (!validPassword) {
      return {
        error: 'Invalid email or password',
      };
    }

    const { password_hash, ...result } = user;
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: result,
    };
  }

  async getUserById(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      });
    } catch (error) {
      return {
        error: 'An error occurred while fetching user.',
      };
    }
  }
}
