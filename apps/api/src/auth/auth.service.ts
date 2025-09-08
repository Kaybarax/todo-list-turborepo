import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Trace } from '../telemetry/decorators/trace.decorator';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

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
    const { email, password } = registerDto;

    // Check if user exists first (tests expect this call & conflict path)
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password (tests spy on bcrypt.hash with salt rounds 10)
      const hashed = await bcrypt.hash(password, 10);
      const user = await this.userService.create({ ...registerDto, password: hashed });
      this.logger.log(`New user registered: ${user.email}`);
      return this.generateTokenResponseLegacy(user); // structure tests expect
    } catch (error) {
      // Re-throw original error message for specific error handling tests
      throw error;
    }
  }

  @Trace('AuthService.login')
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare with bcrypt (tests mock bcrypt.compare)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenResponseLegacy(user);
  }

  @Trace('AuthService.validateUser')
  async validateUser(userId: string): Promise<UserDocument | null> {
    // Tests expect call to userService.findById and passing value through
    const user = await this.userService.findById(userId as any);
    return user || null;
  }

  @Trace('AuthService.refreshToken')
  async refreshToken(token: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.generateTokenResponseLegacy(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateTokenResponseLegacy(user: UserDocument): AuthResponseDto {
    const payload = { sub: user._id, email: user.email } as any;
    const token = this.jwtService.sign(payload);
    return {
      // Minimal shape expected by existing unit tests
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        name: (user as any).name,
        walletAddress: (user as any).walletAddress,
      } as any,
    } as any;
  }

  @Trace('AuthService.verifyToken')
  verifyToken(token: string): { sub: string; email: string } {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
