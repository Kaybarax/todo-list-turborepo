"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var jwt_1 = require("@nestjs/jwt");
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var auth_service_1 = require("./auth.service");
var user_service_1 = require("../user/user.service");
// Mock bcrypt
jest.mock('bcrypt');
var mockedBcrypt = bcrypt;
describe('AuthService', function () {
    var service;
    var userService;
    var jwtService;
    var mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        walletAddress: '0x123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockUserService, mockJwtService, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockUserService = {
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                        findByWalletAddress: jest.fn(),
                    };
                    mockJwtService = {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                auth_service_1.AuthService,
                                {
                                    provide: user_service_1.UserService,
                                    useValue: mockUserService,
                                },
                                {
                                    provide: jwt_1.JwtService,
                                    useValue: mockJwtService,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(auth_service_1.AuthService);
                    userService = module.get(user_service_1.UserService);
                    jwtService = module.get(jwt_1.JwtService);
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
                        userService.findByEmail.mockResolvedValue(null);
                        mockedBcrypt.hash.mockResolvedValue('hashedPassword');
                        userService.create.mockResolvedValue(mockUser);
                        jwtService.sign.mockReturnValue('jwt-token');
                        return [4 /*yield*/, service.register(registerDto)];
                    case 1:
                        result = _a.sent();
                        expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
                        expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
                        expect(userService.create).toHaveBeenCalledWith(__assign(__assign({}, registerDto), { password: 'hashedPassword' }));
                        expect(jwtService.sign).toHaveBeenCalledWith({
                            sub: mockUser._id,
                            email: mockUser.email,
                        });
                        expect(result).toEqual({
                            access_token: 'jwt-token',
                            user: {
                                id: mockUser._id,
                                email: mockUser.email,
                                name: mockUser.name,
                                walletAddress: mockUser.walletAddress,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw ConflictException if user already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'existing@example.com',
                            password: 'password123',
                            name: 'Existing User',
                        };
                        userService.findByEmail.mockResolvedValue(mockUser);
                        return [4 /*yield*/, expect(service.register(registerDto)).rejects.toThrow(new common_1.ConflictException('User with this email already exists'))];
                    case 1:
                        _a.sent();
                        expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
                        expect(mockedBcrypt.hash).not.toHaveBeenCalled();
                        expect(userService.create).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle registration with wallet address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'newuser@example.com',
                            password: 'password123',
                            name: 'New User',
                            walletAddress: '0x456',
                        };
                        userService.findByEmail.mockResolvedValue(null);
                        mockedBcrypt.hash.mockResolvedValue('hashedPassword');
                        userService.create.mockResolvedValue(__assign(__assign({}, mockUser), { walletAddress: '0x456' }));
                        jwtService.sign.mockReturnValue('jwt-token');
                        return [4 /*yield*/, service.register(registerDto)];
                    case 1:
                        result = _a.sent();
                        expect(userService.create).toHaveBeenCalledWith(__assign(__assign({}, registerDto), { password: 'hashedPassword' }));
                        expect(result.user.walletAddress).toBe('0x456');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('login', function () {
        it('should login user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'password123',
                        };
                        userService.findByEmail.mockResolvedValue(mockUser);
                        mockedBcrypt.compare.mockResolvedValue(true);
                        jwtService.sign.mockReturnValue('jwt-token');
                        return [4 /*yield*/, service.login(loginDto)];
                    case 1:
                        result = _a.sent();
                        expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
                        expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
                        expect(jwtService.sign).toHaveBeenCalledWith({
                            sub: mockUser._id,
                            email: mockUser.email,
                        });
                        expect(result).toEqual({
                            access_token: 'jwt-token',
                            user: {
                                id: mockUser._id,
                                email: mockUser.email,
                                name: mockUser.name,
                                walletAddress: mockUser.walletAddress,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw UnauthorizedException if user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'nonexistent@example.com',
                            password: 'password123',
                        };
                        userService.findByEmail.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.login(loginDto)).rejects.toThrow(new common_1.UnauthorizedException('Invalid credentials'))];
                    case 1:
                        _a.sent();
                        expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
                        expect(mockedBcrypt.compare).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw UnauthorizedException if password is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'wrongpassword',
                        };
                        userService.findByEmail.mockResolvedValue(mockUser);
                        mockedBcrypt.compare.mockResolvedValue(false);
                        return [4 /*yield*/, expect(service.login(loginDto)).rejects.toThrow(new common_1.UnauthorizedException('Invalid credentials'))];
                    case 1:
                        _a.sent();
                        expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
                        expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('loginWithWallet', function () {
        it('should login with wallet address successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletAddress, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletAddress = '0x123';
                        userService.findByWalletAddress.mockResolvedValue(mockUser);
                        jwtService.sign.mockReturnValue('jwt-token');
                        return [4 /*yield*/, service.loginWithWallet(walletAddress)];
                    case 1:
                        result = _a.sent();
                        expect(userService.findByWalletAddress).toHaveBeenCalledWith(walletAddress);
                        expect(jwtService.sign).toHaveBeenCalledWith({
                            sub: mockUser._id,
                            email: mockUser.email,
                        });
                        expect(result).toEqual({
                            access_token: 'jwt-token',
                            user: {
                                id: mockUser._id,
                                email: mockUser.email,
                                name: mockUser.name,
                                walletAddress: mockUser.walletAddress,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw UnauthorizedException if wallet address not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletAddress = '0x456';
                        userService.findByWalletAddress.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.loginWithWallet(walletAddress)).rejects.toThrow(new common_1.UnauthorizedException('Wallet address not registered'))];
                    case 1:
                        _a.sent();
                        expect(userService.findByWalletAddress).toHaveBeenCalledWith(walletAddress);
                        expect(jwtService.sign).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('validateUser', function () {
        it('should validate user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = { sub: mockUser._id, email: mockUser.email };
                        userService.findByEmail.mockResolvedValue(mockUser);
                        return [4 /*yield*/, service.validateUser(payload)];
                    case 1:
                        result = _a.sent();
                        expect(userService.findByEmail).toHaveBeenCalledWith(payload.email);
                        expect(result).toEqual({
                            id: mockUser._id,
                            email: mockUser.email,
                            name: mockUser.name,
                            walletAddress: mockUser.walletAddress,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if user not found during validation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = { sub: 'nonexistent', email: 'nonexistent@example.com' };
                        userService.findByEmail.mockResolvedValue(null);
                        return [4 /*yield*/, service.validateUser(payload)];
                    case 1:
                        result = _a.sent();
                        expect(userService.findByEmail).toHaveBeenCalledWith(payload.email);
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('refreshToken', function () {
        it('should refresh token successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var oldToken, payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldToken = 'old-jwt-token';
                        payload = { sub: mockUser._id, email: mockUser.email };
                        jwtService.verify.mockReturnValue(payload);
                        userService.findByEmail.mockResolvedValue(mockUser);
                        jwtService.sign.mockReturnValue('new-jwt-token');
                        return [4 /*yield*/, service.refreshToken(oldToken)];
                    case 1:
                        result = _a.sent();
                        expect(jwtService.verify).toHaveBeenCalledWith(oldToken);
                        expect(userService.findByEmail).toHaveBeenCalledWith(payload.email);
                        expect(jwtService.sign).toHaveBeenCalledWith({
                            sub: mockUser._id,
                            email: mockUser.email,
                        });
                        expect(result).toEqual({
                            access_token: 'new-jwt-token',
                            user: {
                                id: mockUser._id,
                                email: mockUser.email,
                                name: mockUser.name,
                                walletAddress: mockUser.walletAddress,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw UnauthorizedException for invalid token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidToken = 'invalid-token';
                        jwtService.verify.mockImplementation(function () {
                            throw new Error('Invalid token');
                        });
                        return [4 /*yield*/, expect(service.refreshToken(invalidToken)).rejects.toThrow(new common_1.UnauthorizedException('Invalid token'))];
                    case 1:
                        _a.sent();
                        expect(jwtService.verify).toHaveBeenCalledWith(invalidToken);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw UnauthorizedException if user not found during refresh', function () { return __awaiter(void 0, void 0, void 0, function () {
            var oldToken, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldToken = 'old-jwt-token';
                        payload = { sub: 'nonexistent', email: 'nonexistent@example.com' };
                        jwtService.verify.mockReturnValue(payload);
                        userService.findByEmail.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.refreshToken(oldToken)).rejects.toThrow(new common_1.UnauthorizedException('User not found'))];
                    case 1:
                        _a.sent();
                        expect(jwtService.verify).toHaveBeenCalledWith(oldToken);
                        expect(userService.findByEmail).toHaveBeenCalledWith(payload.email);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('error handling', function () {
        it('should handle database errors during registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'test@example.com',
                            password: 'password123',
                            name: 'Test User',
                        };
                        userService.findByEmail.mockResolvedValue(null);
                        mockedBcrypt.hash.mockResolvedValue('hashedPassword');
                        userService.create.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(service.register(registerDto)).rejects.toThrow('Database error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle bcrypt errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var registerDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        registerDto = {
                            email: 'test@example.com',
                            password: 'password123',
                            name: 'Test User',
                        };
                        userService.findByEmail.mockResolvedValue(null);
                        mockedBcrypt.hash.mockRejectedValue(new Error('Bcrypt error'));
                        return [4 /*yield*/, expect(service.register(registerDto)).rejects.toThrow('Bcrypt error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle JWT signing errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginDto = {
                            email: 'test@example.com',
                            password: 'password123',
                        };
                        userService.findByEmail.mockResolvedValue(mockUser);
                        mockedBcrypt.compare.mockResolvedValue(true);
                        jwtService.sign.mockImplementation(function () {
                            throw new Error('JWT error');
                        });
                        return [4 /*yield*/, expect(service.login(loginDto)).rejects.toThrow('JWT error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
