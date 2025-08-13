import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    walletAddress: '0x123456789',
    preferredNetwork: 'polygon',
  };

  const mockAuthResponse: AuthResponseDto = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
    expiresIn: 900,
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      authService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle registration with optional fields', async () => {
      const registerDto: RegisterDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'User',
        walletAddress: '0xabcdef',
        preferredNetwork: 'solana',
      };

      authService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw ConflictException when user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      authService.register.mockRejectedValue(new ConflictException('User already exists'));

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle service errors during registration', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockRejectedValue(new Error('Service error'));

      await expect(controller.register(registerDto)).rejects.toThrow('Service error');
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      authService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle login with different email formats', async () => {
      const loginDto: LoginDto = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      };

      authService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle service errors during login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.login.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.login(loginDto)).rejects.toThrow('Database connection failed');
    });
  });

  describe('refresh', () => {
    it('should refresh token successfully for authenticated user', async () => {
      const user = { id: 'user123' };

      authService.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await controller.refresh(user);

      expect(authService.refreshToken).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      const user = { id: 'invalid-user' };

      authService.refreshToken.mockRejectedValue(new UnauthorizedException('Invalid user'));

      await expect(controller.refresh(user)).rejects.toThrow(UnauthorizedException);
      expect(authService.refreshToken).toHaveBeenCalledWith(user.id);
    });

    it('should handle missing user context', async () => {
      const user = { id: '' };

      authService.refreshToken.mockRejectedValue(new UnauthorizedException('Invalid user'));

      await expect(controller.refresh(user)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle service errors during token refresh', async () => {
      const user = { id: 'user123' };

      authService.refreshToken.mockRejectedValue(new Error('Token generation failed'));

      await expect(controller.refresh(user)).rejects.toThrow('Token generation failed');
    });
  });

  describe('getProfile', () => {
    it('should return user profile for authenticated user', async () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        walletAddress: '0x123456789',
        preferredNetwork: 'polygon',
      };

      const result = await controller.getProfile(user);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress,
        preferredNetwork: user.preferredNetwork,
      });
    });

    it('should return profile with minimal user data', async () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        walletAddress: undefined,
        preferredNetwork: undefined,
      };

      const result = await controller.getProfile(user);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        walletAddress: undefined,
        preferredNetwork: undefined,
      });
    });

    it('should handle user with blockchain-related fields', async () => {
      const user = {
        id: 'user123',
        email: 'crypto@example.com',
        name: 'Crypto User',
        walletAddress: '0xabcdef123456789',
        preferredNetwork: 'solana',
      };

      const result = await controller.getProfile(user);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress,
        preferredNetwork: user.preferredNetwork,
      });
    });
  });

  describe('error handling', () => {
    it('should propagate authentication errors', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.login.mockRejectedValue(new UnauthorizedException('Authentication failed'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle unexpected service errors', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.register(registerDto)).rejects.toThrow('Unexpected error');
    });

    it('should handle null or undefined user context', async () => {
      const result = await controller.getProfile(null as any);

      expect(result).toEqual({
        id: undefined,
        email: undefined,
        name: undefined,
        walletAddress: undefined,
        preferredNetwork: undefined,
      });
    });
  });

  describe('input validation', () => {
    it('should handle empty login credentials', async () => {
      const loginDto: LoginDto = {
        email: '',
        password: '',
      };

      authService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle malformed email in registration', async () => {
      const registerDto: RegisterDto = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockRejectedValue(new Error('Invalid email format'));

      await expect(controller.register(registerDto)).rejects.toThrow('Invalid email format');
    });

    it('should handle weak password in registration', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      };

      authService.register.mockRejectedValue(new Error('Password too weak'));

      await expect(controller.register(registerDto)).rejects.toThrow('Password too weak');
    });
  });

  describe('security considerations', () => {
    it('should not expose sensitive information in responses', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(result).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should handle concurrent login attempts', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.login.mockResolvedValue(mockAuthResponse);

      const promises = Array(5)
        .fill(null)
        .map(() => controller.login(loginDto));
      const results = await Promise.all(promises);

      expect(authService.login).toHaveBeenCalledTimes(5);
      results.forEach(result => {
        expect(result).toEqual(mockAuthResponse);
      });
    });
  });
});
