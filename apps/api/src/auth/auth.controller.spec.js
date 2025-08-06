"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@nestjs/testing");
var common_1 = require("@nestjs/common");
var auth_controller_1 = require("./auth.controller");
var auth_service_1 = require("./auth.service");
describe('AuthController', function () {
    var controller;
    var authService;
    var mockUser = {
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
        walletAddress: '0x123456789',
        preferredNetwork: 'polygon',
    };
    var mockAuthResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
        expiresIn: 900,
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockAuthService, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockAuthService = {
                        register: jest.fn(),
                        login: jest.fn(),
                        refreshToken: jest.fn(),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            controllers: [auth_controller_1.AuthController],
                            providers: [
                                {
                                    provide: auth_service_1.AuthService,
                                    useValue: mockAuthService,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    controller = module.get(auth_controller_1.AuthController);
                    authService = module.get(auth_service_1.AuthService);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('register', function () {
        it('should register a new user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'newuser@example.com',
                            password: 'password123',
                            name: 'New User',
                        };
                        authService.register.mockResolvedValue(mockAuthResponse);
                        return [4 /*yield*/, controller.register(registerDto)];
                    case 1:
                        result = _a.sent();
                        expect(authService.register).toHaveBeenCalledWith(registerDto);
                        expect(result).toEqual(mockAuthResponse);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle registration with optional fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'user@example.com',
                            password: 'password123',
                            name: 'User',
                            walletAddress: '0xabcdef',
                            preferredNetwork: 'solana',
                        };
                        authService.register.mockResolvedValue(mockAuthResponse);
                        return [4 /*yield*/, controller.register(registerDto)];
                    case 1:
                        result = _a.sent();
                        expect(authService.register).toHaveBeenCalledWith(registerDto);
                        expect(result).toEqual(mockAuthResponse);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw ConflictException when user already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'existing@example.com',
                            password: 'password123',
                            name: 'Existing User',
                        };
                        authService.register.mockRejectedValue(new common_1.ConflictException('User already exists'));
                        return [4 /*yield*/, expect(controller.register(registerDto)).rejects.toThrow(common_1.ConflictException)];
                    case 1:
                        _a.sent();
                        expect(authService.register).toHaveBeenCalledWith(registerDto);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle service errors during registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'test@example.com',
                            password: 'password123',
                            name: 'Test User',
                        };
                        authService.register.mockRejectedValue(new Error('Service error'));
                        return [4 /*yield*/, expect(controller.register(registerDto)).rejects.toThrow('Service error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('login', function () {
        it('should login user successfully with valid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'password123',
                        };
                        authService.login.mockResolvedValue(mockAuthResponse);
                        return [4 /*yield*/, controller.login(loginDto)];
                    case 1:
                        result = _a.sent();
                        expect(authService.login).toHaveBeenCalledWith(loginDto);
                        expect(result).toEqual(mockAuthResponse);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw UnauthorizedException for invalid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'wrongpassword',
                        };
                        authService.login.mockRejectedValue(new common_1.UnauthorizedException('Invalid credentials'));
                        return [4 /*yield*/, expect(controller.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException)];
                    case 1:
                        _a.sent();
                        expect(authService.login).toHaveBeenCalledWith(loginDto);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle login with different email formats', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'TEST@EXAMPLE.COM',
                            password: 'password123',
                        };
                        authService.login.mockResolvedValue(mockAuthResponse);
                        return [4 /*yield*/, controller.login(loginDto)];
                    case 1:
                        result = _a.sent();
                        expect(authService.login).toHaveBeenCalledWith(loginDto);
                        expect(result).toEqual(mockAuthResponse);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle service errors during login', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'password123',
                        };
                        authService.login.mockRejectedValue(new Error('Database connection failed'));
                        return [4 /*yield*/, expect(controller.login(loginDto)).rejects.toThrow('Database connection failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('refresh', function () {
        it('should refresh token successfully for authenticated user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = { id: 'user123' };
                        authService.refreshToken.mockResolvedValue(mockAuthResponse);
                        return [4 /*yield*/, controller.refresh(user)];
                    case 1:
                        result = _a.sent();
                        expect(authService.refreshToken).toHaveBeenCalledWith(user.id);
                        expect(result).toEqual(mockAuthResponse);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw UnauthorizedException for invalid user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = { id: 'invalid-user' };
                        authService.refreshToken.mockRejectedValue(new common_1.UnauthorizedException('Invalid user'));
                        return [4 /*yield*/, expect(controller.refresh(user)).rejects.toThrow(common_1.UnauthorizedException)];
                    case 1:
                        _a.sent();
                        expect(authService.refreshToken).toHaveBeenCalledWith(user.id);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle missing user context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = { id: '' };
                        authService.refreshToken.mockRejectedValue(new common_1.UnauthorizedException('Invalid user'));
                        return [4 /*yield*/, expect(controller.refresh(user)).rejects.toThrow(common_1.UnauthorizedException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle service errors during token refresh', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = { id: 'user123' };
                        authService.refreshToken.mockRejectedValue(new Error('Token generation failed'));
                        return [4 /*yield*/, expect(controller.refresh(user)).rejects.toThrow('Token generation failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getProfile', function () {
        it('should return user profile for authenticated user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = {
                            id: 'user123',
                            email: 'test@example.com',
                            name: 'Test User',
                            walletAddress: '0x123456789',
                            preferredNetwork: 'polygon',
                        };
                        return [4 /*yield*/, controller.getProfile(user)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            walletAddress: user.walletAddress,
                            preferredNetwork: user.preferredNetwork,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return profile with minimal user data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = {
                            id: 'user123',
                            email: 'test@example.com',
                            name: 'Test User',
                            walletAddress: undefined,
                            preferredNetwork: undefined,
                        };
                        return [4 /*yield*/, controller.getProfile(user)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            walletAddress: undefined,
                            preferredNetwork: undefined,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle user with blockchain-related fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = {
                            id: 'user123',
                            email: 'crypto@example.com',
                            name: 'Crypto User',
                            walletAddress: '0xabcdef123456789',
                            preferredNetwork: 'solana',
                        };
                        return [4 /*yield*/, controller.getProfile(user)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            walletAddress: user.walletAddress,
                            preferredNetwork: user.preferredNetwork,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('error handling', function () {
        it('should propagate authentication errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'password123',
                        };
                        authService.login.mockRejectedValue(new common_1.UnauthorizedException('Authentication failed'));
                        return [4 /*yield*/, expect(controller.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle unexpected service errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'test@example.com',
                            password: 'password123',
                            name: 'Test User',
                        };
                        authService.register.mockRejectedValue(new Error('Unexpected error'));
                        return [4 /*yield*/, expect(controller.register(registerDto)).rejects.toThrow('Unexpected error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle null or undefined user context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, controller.getProfile(null)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: undefined,
                            email: undefined,
                            name: undefined,
                            walletAddress: undefined,
                            preferredNetwork: undefined,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('input validation', function () {
        it('should handle empty login credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: '',
                            password: '',
                        };
                        authService.login.mockRejectedValue(new common_1.UnauthorizedException('Invalid credentials'));
                        return [4 /*yield*/, expect(controller.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle malformed email in registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'invalid-email',
                            password: 'password123',
                            name: 'Test User',
                        };
                        authService.register.mockRejectedValue(new Error('Invalid email format'));
                        return [4 /*yield*/, expect(controller.register(registerDto)).rejects.toThrow('Invalid email format')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle weak password in registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'test@example.com',
                            password: '123',
                            name: 'Test User',
                        };
                        authService.register.mockRejectedValue(new Error('Password too weak'));
                        return [4 /*yield*/, expect(controller.register(registerDto)).rejects.toThrow('Password too weak')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('security considerations', function () {
        it('should not expose sensitive information in responses', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'test@example.com',
                            password: 'password123',
                            name: 'Test User',
                        };
                        authService.register.mockResolvedValue(mockAuthResponse);
                        return [4 /*yield*/, controller.register(registerDto)];
                    case 1:
                        result = _a.sent();
                        expect(result).not.toHaveProperty('password');
                        expect(result.user).not.toHaveProperty('password');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle concurrent login attempts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto, promises, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'password123',
                        };
                        authService.login.mockResolvedValue(mockAuthResponse);
                        promises = Array(5).fill(null).map(function () { return controller.login(loginDto); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        results = _a.sent();
                        expect(authService.login).toHaveBeenCalledTimes(5);
                        results.forEach(function (result) {
                            expect(result).toEqual(mockAuthResponse);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
