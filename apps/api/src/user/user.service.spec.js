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
var mongoose_1 = require("@nestjs/mongoose");
var common_1 = require("@nestjs/common");
var user_service_1 = require("./user.service");
var user_schema_1 = require("./schemas/user.schema");
describe('UserService', function () {
    var service;
    var userModel;
    var mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        walletAddress: '0x123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        save: jest.fn(),
        toObject: jest.fn(),
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockUserModel, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockUserModel = {
                        findOne: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                        find: jest.fn(),
                        countDocuments: jest.fn(),
                        aggregate: jest.fn(),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                user_service_1.UserService,
                                {
                                    provide: (0, mongoose_1.getModelToken)(user_schema_1.User.name),
                                    useValue: mockUserModel,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(user_service_1.UserService);
                    userModel = module.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('create', function () {
        it('should create a new user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createUserDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createUserDto = {
                            email: 'newuser@example.com',
                            password: 'hashedPassword',
                            name: 'New User',
                        };
                        userModel.findOne.mockResolvedValue(null);
                        userModel.create.mockResolvedValue(mockUser);
                        return [4 /*yield*/, service.create(createUserDto)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
                        expect(userModel.create).toHaveBeenCalledWith(createUserDto);
                        expect(result).toEqual(mockUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw ConflictException if user already exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createUserDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createUserDto = {
                            email: 'existing@example.com',
                            password: 'hashedPassword',
                            name: 'Existing User',
                        };
                        userModel.findOne.mockResolvedValue(mockUser);
                        return [4 /*yield*/, expect(service.create(createUserDto)).rejects.toThrow(new common_1.ConflictException('User with this email already exists'))];
                    case 1:
                        _a.sent();
                        expect(userModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
                        expect(userModel.create).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should create user with wallet address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createUserDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createUserDto = {
                            email: 'newuser@example.com',
                            password: 'hashedPassword',
                            name: 'New User',
                            walletAddress: '0x456',
                        };
                        userModel.findOne.mockResolvedValue(null);
                        userModel.create.mockResolvedValue(__assign(__assign({}, mockUser), { walletAddress: '0x456' }));
                        return [4 /*yield*/, service.create(createUserDto)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.create).toHaveBeenCalledWith(createUserDto);
                        expect(result.walletAddress).toBe('0x456');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findByEmail', function () {
        it('should find user by email successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var email, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = 'test@example.com';
                        userModel.findOne.mockResolvedValue(mockUser);
                        return [4 /*yield*/, service.findByEmail(email)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findOne).toHaveBeenCalledWith({ email: email });
                        expect(result).toEqual(mockUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var email, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = 'nonexistent@example.com';
                        userModel.findOne.mockResolvedValue(null);
                        return [4 /*yield*/, service.findByEmail(email)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findOne).toHaveBeenCalledWith({ email: email });
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findByWalletAddress', function () {
        it('should find user by wallet address successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletAddress, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletAddress = '0x123';
                        userModel.findOne.mockResolvedValue(mockUser);
                        return [4 /*yield*/, service.findByWalletAddress(walletAddress)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findOne).toHaveBeenCalledWith({ walletAddress: walletAddress });
                        expect(result).toEqual(mockUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if user not found by wallet address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletAddress, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        walletAddress = '0x456';
                        userModel.findOne.mockResolvedValue(null);
                        return [4 /*yield*/, service.findByWalletAddress(walletAddress)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findOne).toHaveBeenCalledWith({ walletAddress: walletAddress });
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findById', function () {
        it('should find user by ID successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        userModel.findById.mockResolvedValue(mockUser);
                        return [4 /*yield*/, service.findById(userId)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findById).toHaveBeenCalledWith(userId);
                        expect(result).toEqual(mockUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException if user not found by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439012';
                        userModel.findById.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.findById(userId)).rejects.toThrow(new common_1.NotFoundException("User with ID ".concat(userId, " not found")))];
                    case 1:
                        _a.sent();
                        expect(userModel.findById).toHaveBeenCalledWith(userId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateById', function () {
        it('should update user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, updateData, updatedUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        updateData = {
                            name: 'Updated Name',
                            walletAddress: '0x789',
                        };
                        updatedUser = __assign(__assign({}, mockUser), updateData);
                        userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);
                        return [4 /*yield*/, service.updateById(userId, updateData)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true, runValidators: true });
                        expect(result).toEqual(updatedUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException if user not found during update', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439012';
                        updateData = { name: 'Updated Name' };
                        userModel.findByIdAndUpdate.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.updateById(userId, updateData)).rejects.toThrow(new common_1.NotFoundException("User with ID ".concat(userId, " not found")))];
                    case 1:
                        _a.sent();
                        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true, runValidators: true });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle email uniqueness during update', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        updateData = { email: 'existing@example.com' };
                        userModel.findByIdAndUpdate.mockRejectedValue({
                            code: 11000,
                            keyPattern: { email: 1 },
                        });
                        return [4 /*yield*/, expect(service.updateById(userId, updateData)).rejects.toThrow(new common_1.ConflictException('User with this email already exists'))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle wallet address uniqueness during update', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        updateData = { walletAddress: '0x456' };
                        userModel.findByIdAndUpdate.mockRejectedValue({
                            code: 11000,
                            keyPattern: { walletAddress: 1 },
                        });
                        return [4 /*yield*/, expect(service.updateById(userId, updateData)).rejects.toThrow(new common_1.ConflictException('User with this wallet address already exists'))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('deleteById', function () {
        it('should delete user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        userModel.findByIdAndDelete.mockResolvedValue(mockUser);
                        return [4 /*yield*/, service.deleteById(userId)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
                        expect(result).toEqual(mockUser);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException if user not found during deletion', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439012';
                        userModel.findByIdAndDelete.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.deleteById(userId)).rejects.toThrow(new common_1.NotFoundException("User with ID ".concat(userId, " not found")))];
                    case 1:
                        _a.sent();
                        expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAll', function () {
        it('should find all users with pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
            var users, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        users = [mockUser, __assign(__assign({}, mockUser), { _id: '507f1f77bcf86cd799439012' })];
                        query = { page: 1, limit: 10 };
                        userModel.find.mockReturnValue({
                            select: jest.fn().mockReturnValue({
                                skip: jest.fn().mockReturnValue({
                                    limit: jest.fn().mockReturnValue({
                                        sort: jest.fn().mockResolvedValue(users),
                                    }),
                                }),
                            }),
                        });
                        userModel.countDocuments.mockResolvedValue(2);
                        return [4 /*yield*/, service.findAll(query)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.find).toHaveBeenCalledWith({});
                        expect(userModel.countDocuments).toHaveBeenCalledWith({});
                        expect(result).toEqual({
                            users: users,
                            total: 2,
                            page: 1,
                            limit: 10,
                            totalPages: 1,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should find users with search filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var users, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        users = [mockUser];
                        query = { page: 1, limit: 10, search: 'test' };
                        userModel.find.mockReturnValue({
                            select: jest.fn().mockReturnValue({
                                skip: jest.fn().mockReturnValue({
                                    limit: jest.fn().mockReturnValue({
                                        sort: jest.fn().mockResolvedValue(users),
                                    }),
                                }),
                            }),
                        });
                        userModel.countDocuments.mockResolvedValue(1);
                        return [4 /*yield*/, service.findAll(query)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.find).toHaveBeenCalledWith({
                            $or: [
                                { name: { $regex: 'test', $options: 'i' } },
                                { email: { $regex: 'test', $options: 'i' } },
                            ],
                        });
                        expect(result).toEqual(users);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty results', function () { return __awaiter(void 0, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { page: 1, limit: 10 };
                        userModel.find.mockReturnValue({
                            select: jest.fn().mockReturnValue({
                                skip: jest.fn().mockReturnValue({
                                    limit: jest.fn().mockReturnValue({
                                        sort: jest.fn().mockResolvedValue([]),
                                    }),
                                }),
                            }),
                        });
                        userModel.countDocuments.mockResolvedValue(0);
                        return [4 /*yield*/, service.findAll(query)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            users: [],
                            total: 0,
                            page: 1,
                            limit: 10,
                            totalPages: 0,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUserStats', function () {
        it('should get user statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, mockStats, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        mockStats = [
                            {
                                totalTodos: 10,
                                completedTodos: 5,
                                activeTodos: 5,
                                overdueTodos: 2,
                            },
                        ];
                        userModel.aggregate.mockResolvedValue(mockStats);
                        return [4 /*yield*/, service.getUserStats(userId)];
                    case 1:
                        result = _a.sent();
                        expect(userModel.aggregate).toHaveBeenCalled();
                        expect(result).toEqual(mockStats[0]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle user with no todos', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        userModel.aggregate.mockResolvedValue([]);
                        return [4 /*yield*/, service.getUserStats(userId)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            totalTodos: 0,
                            completedTodos: 0,
                            activeTodos: 0,
                            overdueTodos: 0,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('error handling', function () {
        it('should handle database connection errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var email;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = 'test@example.com';
                        userModel.findOne.mockRejectedValue(new Error('Database connection failed'));
                        return [4 /*yield*/, expect(service.findByEmail(email)).rejects.toThrow('Database connection failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle validation errors during creation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createUserDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createUserDto = {
                            email: 'invalid-email',
                            password: 'hashedPassword',
                            name: 'Test User',
                        };
                        userModel.findOne.mockResolvedValue(null);
                        userModel.create.mockRejectedValue({
                            name: 'ValidationError',
                            errors: {
                                email: { message: 'Invalid email format' },
                            },
                        });
                        return [4 /*yield*/, expect(service.create(createUserDto)).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle duplicate key errors with unknown field', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '507f1f77bcf86cd799439011';
                        updateData = { name: 'Updated Name' };
                        userModel.findByIdAndUpdate.mockRejectedValue({
                            code: 11000,
                            keyPattern: { unknownField: 1 },
                        });
                        return [4 /*yield*/, expect(service.updateById(userId, updateData)).rejects.toThrow(new common_1.ConflictException('Duplicate key error'))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
