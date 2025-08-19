import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Trace } from '../telemetry/decorators/trace.decorator';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly userService: UserService,
    // eslint-disable-next-line no-unused-vars
    private readonly jwtService: JwtService,
  ) {}

  @Trace('AuthService.register')
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.create(registerDto);
      this.logger.log(`New user registered: ${user.email}`);

      return this.generateTokenResponse(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Registration failed:', error);
      throw new ConflictException('Registration failed');
    }
  }

  @Trace('AuthService.login')
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userService.updateLastLogin(user._id.toString());

    this.logger.log(`User logged in: ${user.email}`);
    return this.generateTokenResponse(user);
  }

  @Trace('AuthService.validateUser')
  async validateUser(userId: string): Promise<UserDocument | null> {
    const user = await this.userService.findById(userId);

    if (!user?.isActive) {
      return null;
    }

    return user;
  }

  @Trace('AuthService.refreshToken')
  async refreshToken(userId: string): Promise<AuthResponseDto> {
    const user = await this.validateUser(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return this.generateTokenResponse(user);
  }

  private generateTokenResponse(user: UserDocument): AuthResponseDto {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: user.toJSON() as Omit<User, 'password'>,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  @Trace('AuthService.verifyToken')
  verifyToken(token: string): { sub: string; email: string; name: string } {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
