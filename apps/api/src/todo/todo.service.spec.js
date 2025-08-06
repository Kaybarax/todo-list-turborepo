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
var common_1 = require("@nestjs/common");
var todo_service_1 = require("./todo.service");
var todo_repository_1 = require("./repositories/todo.repository");
var cache_service_1 = require("../cache/cache.service");
describe('TodoService', function () {
    var service;
    var todoRepository;
    var cacheService;
    var mockTodo = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        dueDate: new Date('2024-12-31'),
        tags: ['test'],
        userId: 'user123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        blockchainNetwork: 'polygon',
        transactionHash: '0x123',
    };
    var mockUser = { id: 'user123' };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockTodoRepository, mockCacheService, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockTodoRepository = {
                        create: jest.fn(),
                        findMany: jest.fn(),
                        count: jest.fn(),
                        findByIdAndUserId: jest.fn(),
                        deleteById: jest.fn(),
                        aggregate: jest.fn(),
                    };
                    mockCacheService = {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                        delPattern: jest.fn(),
                        generateUserTodosKey: jest.fn(),
                        generateTodoKey: jest.fn(),
                        generateUserStatsKey: jest.fn(),
                        generateUserPattern: jest.fn(),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                todo_service_1.TodoService,
                                {
                                    provide: todo_repository_1.TodoRepository,
                                    useValue: mockTodoRepository,
                                },
                                {
                                    provide: cache_service_1.CacheService,
                                    useValue: mockCacheService,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(todo_service_1.TodoService);
                    todoRepository = module.get(todo_repository_1.TodoRepository);
                    cacheService = module.get(cache_service_1.CacheService);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('create', function () {
        it('should create a todo successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createTodoDto, expectedTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createTodoDto = {
                            title: 'New Todo',
                            description: 'New Description',
                            priority: 'high',
                            dueDate: '2024-12-31',
                            tags: ['new'],
                        };
                        expectedTodo = __assign(__assign({}, mockTodo), createTodoDto);
                        todoRepository.create.mockResolvedValue(expectedTodo);
                        cacheService.delPattern.mockResolvedValue(undefined);
                        cacheService.del.mockResolvedValue(undefined);
                        cacheService.generateUserPattern.mockReturnValue('user:user123:*');
                        cacheService.generateUserStatsKey.mockReturnValue('user:user123:stats');
                        return [4 /*yield*/, service.create(createTodoDto, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(todoRepository.create).toHaveBeenCalledWith(__assign(__assign({}, createTodoDto), { userId: mockUser.id, dueDate: new Date(createTodoDto.dueDate) }));
                        expect(result).toEqual(expectedTodo);
                        expect(cacheService.delPattern).toHaveBeenCalled();
                        expect(cacheService.del).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle todo creation without due date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createTodoDto, expectedTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createTodoDto = {
                            title: 'New Todo',
                            description: 'New Description',
                            priority: 'medium',
                        };
                        expectedTodo = __assign(__assign({}, mockTodo), createTodoDto);
                        todoRepository.create.mockResolvedValue(expectedTodo);
                        cacheService.delPattern.mockResolvedValue(undefined);
                        cacheService.del.mockResolvedValue(undefined);
                        cacheService.generateUserPattern.mockReturnValue('user:user123:*');
                        cacheService.generateUserStatsKey.mockReturnValue('user:user123:stats');
                        return [4 /*yield*/, service.create(createTodoDto, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(todoRepository.create).toHaveBeenCalledWith(__assign(__assign({}, createTodoDto), { userId: mockUser.id, dueDate: undefined }));
                        expect(result).toEqual(expectedTodo);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAll', function () {
        it('should return cached todos if available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto, cachedResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = { page: 1, limit: 10 };
                        cachedResult = {
                            todos: [mockTodo],
                            total: 1,
                            page: 1,
                            limit: 10,
                            totalPages: 1,
                        };
                        cacheService.generateUserTodosKey.mockReturnValue('cache-key');
                        cacheService.get.mockResolvedValue(cachedResult);
                        return [4 /*yield*/, service.findAll(queryDto, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(cacheService.get).toHaveBeenCalledWith('cache-key');
                        expect(result).toEqual(cachedResult);
                        expect(todoRepository.findMany).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fetch todos from database when not cached', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = {
                            page: 1,
                            limit: 10,
                            completed: false,
                            priority: 'high',
                            search: 'test',
                            sortBy: 'createdAt',
                            sortOrder: 'desc'
                        };
                        cacheService.generateUserTodosKey.mockReturnValue('cache-key');
                        cacheService.get.mockResolvedValue(null);
                        todoRepository.findMany.mockResolvedValue([mockTodo]);
                        todoRepository.count.mockResolvedValue(1);
                        cacheService.set.mockResolvedValue(undefined);
                        return [4 /*yield*/, service.findAll(queryDto, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(todoRepository.findMany).toHaveBeenCalledWith({
                            userId: mockUser.id,
                            completed: false,
                            priority: 'high',
                            $or: [
                                { title: { $regex: 'test', $options: 'i' } },
                                { description: { $regex: 'test', $options: 'i' } },
                            ],
                        }, {
                            sort: { createdAt: -1 },
                            skip: 0,
                            limit: 10,
                        });
                        expect(todoRepository.count).toHaveBeenCalled();
                        expect(cacheService.set).toHaveBeenCalled();
                        expect(result).toEqual({
                            todos: [mockTodo],
                            total: 1,
                            page: 1,
                            limit: 10,
                            totalPages: 1,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle priority sorting correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = {
                            page: 1,
                            limit: 10,
                            sortBy: 'priority',
                            sortOrder: 'asc'
                        };
                        cacheService.generateUserTodosKey.mockReturnValue('cache-key');
                        cacheService.get.mockResolvedValue(null);
                        todoRepository.findMany.mockResolvedValue([mockTodo]);
                        todoRepository.count.mockResolvedValue(1);
                        cacheService.set.mockResolvedValue(undefined);
                        return [4 /*yield*/, service.findAll(queryDto, mockUser.id)];
                    case 1:
                        _a.sent();
                        expect(todoRepository.findMany).toHaveBeenCalledWith({ userId: mockUser.id }, {
                            sort: { priority: 1 },
                            skip: 0,
                            limit: 10,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findOne', function () {
        it('should return cached todo if available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.get.mockResolvedValue(mockTodo);
                        return [4 /*yield*/, service.findOne(todoId, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(cacheService.get).toHaveBeenCalledWith('todo-cache-key');
                        expect(result).toEqual(mockTodo);
                        expect(todoRepository.findByIdAndUserId).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fetch todo from database when not cached', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.get.mockResolvedValue(null);
                        todoRepository.findByIdAndUserId.mockResolvedValue(mockTodo);
                        cacheService.set.mockResolvedValue(undefined);
                        return [4 /*yield*/, service.findOne(todoId, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(todoRepository.findByIdAndUserId).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(cacheService.set).toHaveBeenCalledWith('todo-cache-key', mockTodo, 300);
                        expect(result).toEqual(mockTodo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException when todo not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'nonexistent';
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.get.mockResolvedValue(null);
                        todoRepository.findByIdAndUserId.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.findOne(todoId, mockUser.id)).rejects.toThrow(new common_1.NotFoundException("Todo with ID ".concat(todoId, " not found or access denied")))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not return cached todo for different user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, differentUserTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        differentUserTodo = __assign(__assign({}, mockTodo), { userId: 'different-user' });
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.get.mockResolvedValue(differentUserTodo);
                        todoRepository.findByIdAndUserId.mockResolvedValue(mockTodo);
                        cacheService.set.mockResolvedValue(undefined);
                        return [4 /*yield*/, service.findOne(todoId, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(todoRepository.findByIdAndUserId).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(result).toEqual(mockTodo);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update todo successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, updateTodoDto, mockTodoDocument, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        updateTodoDto = {
                            title: 'Updated Todo',
                            completed: true,
                        };
                        mockTodoDocument = __assign(__assign({}, mockTodo), { save: jest.fn().mockResolvedValue(__assign(__assign({}, mockTodo), updateTodoDto)) });
                        // Mock findOne method
                        jest.spyOn(service, 'findOne').mockResolvedValue(mockTodoDocument);
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.set.mockResolvedValue(undefined);
                        cacheService.delPattern.mockResolvedValue(undefined);
                        cacheService.del.mockResolvedValue(undefined);
                        cacheService.generateUserPattern.mockReturnValue('user:user123:*');
                        cacheService.generateUserStatsKey.mockReturnValue('user:user123:stats');
                        return [4 /*yield*/, service.update(todoId, updateTodoDto, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(service.findOne).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(mockTodoDocument.save).toHaveBeenCalled();
                        expect(cacheService.set).toHaveBeenCalled();
                        expect(cacheService.delPattern).toHaveBeenCalled();
                        expect(result).toEqual(__assign(__assign({}, mockTodo), updateTodoDto));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle due date update', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, updateTodoDto, mockTodoDocument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        updateTodoDto = {
                            dueDate: '2024-12-31',
                        };
                        mockTodoDocument = __assign(__assign({}, mockTodo), { save: jest.fn().mockResolvedValue(__assign(__assign({}, mockTodo), { dueDate: new Date(updateTodoDto.dueDate) })) });
                        jest.spyOn(service, 'findOne').mockResolvedValue(mockTodoDocument);
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.set.mockResolvedValue(undefined);
                        cacheService.delPattern.mockResolvedValue(undefined);
                        cacheService.del.mockResolvedValue(undefined);
                        cacheService.generateUserPattern.mockReturnValue('user:user123:*');
                        cacheService.generateUserStatsKey.mockReturnValue('user:user123:stats');
                        return [4 /*yield*/, service.update(todoId, updateTodoDto, mockUser.id)];
                    case 1:
                        _a.sent();
                        expect(Object.assign).toHaveBeenCalledWith(mockTodoDocument, {
                            dueDate: new Date(updateTodoDto.dueDate),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('remove', function () {
        it('should remove todo successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        jest.spyOn(service, 'findOne').mockResolvedValue(mockTodo);
                        todoRepository.deleteById.mockResolvedValue(true);
                        cacheService.del.mockResolvedValue(undefined);
                        cacheService.delPattern.mockResolvedValue(undefined);
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.generateUserPattern.mockReturnValue('user:user123:*');
                        cacheService.generateUserStatsKey.mockReturnValue('user:user123:stats');
                        return [4 /*yield*/, service.remove(todoId, mockUser.id)];
                    case 1:
                        _a.sent();
                        expect(service.findOne).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(todoRepository.deleteById).toHaveBeenCalledWith(todoId);
                        expect(cacheService.del).toHaveBeenCalledWith('todo-cache-key');
                        expect(cacheService.delPattern).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException when todo cannot be deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        jest.spyOn(service, 'findOne').mockResolvedValue(mockTodo);
                        todoRepository.deleteById.mockResolvedValue(false);
                        return [4 /*yield*/, expect(service.remove(todoId, mockUser.id)).rejects.toThrow(new common_1.NotFoundException("Todo with ID ".concat(todoId, " not found")))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getStats', function () {
        it('should return cached stats if available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockStats, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockStats = {
                            total: 10,
                            completed: 5,
                            active: 5,
                            overdue: 2,
                            byPriority: { high: 3, medium: 4, low: 3 },
                            byBlockchainNetwork: { polygon: 2, solana: 1 },
                        };
                        cacheService.generateUserStatsKey.mockReturnValue('stats-cache-key');
                        cacheService.get.mockResolvedValue(mockStats);
                        return [4 /*yield*/, service.getStats(mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(cacheService.get).toHaveBeenCalledWith('stats-cache-key');
                        expect(result).toEqual(mockStats);
                        expect(todoRepository.count).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should calculate stats from database when not cached', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheService.generateUserStatsKey.mockReturnValue('stats-cache-key');
                        cacheService.get.mockResolvedValue(null);
                        // Mock repository calls
                        todoRepository.count
                            .mockResolvedValueOnce(10) // total
                            .mockResolvedValueOnce(5) // completed
                            .mockResolvedValueOnce(2); // overdue
                        todoRepository.aggregate
                            .mockResolvedValueOnce([
                            { _id: 'high', count: 3 },
                            { _id: 'medium', count: 4 },
                            { _id: 'low', count: 3 },
                        ]) // priority stats
                            .mockResolvedValueOnce([
                            { _id: 'polygon', count: 2 },
                            { _id: 'solana', count: 1 },
                        ]); // blockchain stats
                        cacheService.set.mockResolvedValue(undefined);
                        return [4 /*yield*/, service.getStats(mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(todoRepository.count).toHaveBeenCalledTimes(3);
                        expect(todoRepository.aggregate).toHaveBeenCalledTimes(2);
                        expect(cacheService.set).toHaveBeenCalledWith('stats-cache-key', result, 60);
                        expect(result).toEqual({
                            total: 10,
                            completed: 5,
                            active: 5,
                            overdue: 2,
                            byPriority: { high: 3, medium: 4, low: 3 },
                            byBlockchainNetwork: { polygon: 2, solana: 1 },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('toggleComplete', function () {
        it('should toggle todo completion status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, mockTodoDocument, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        mockTodoDocument = __assign(__assign({}, mockTodo), { completed: false, save: jest.fn().mockResolvedValue(__assign(__assign({}, mockTodo), { completed: true })) });
                        jest.spyOn(service, 'findOne').mockResolvedValue(mockTodoDocument);
                        cacheService.generateTodoKey.mockReturnValue('todo-cache-key');
                        cacheService.set.mockResolvedValue(undefined);
                        cacheService.delPattern.mockResolvedValue(undefined);
                        cacheService.del.mockResolvedValue(undefined);
                        cacheService.generateUserPattern.mockReturnValue('user:user123:*');
                        cacheService.generateUserStatsKey.mockReturnValue('user:user123:stats');
                        return [4 /*yield*/, service.toggleComplete(todoId, mockUser.id)];
                    case 1:
                        result = _a.sent();
                        expect(service.findOne).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(mockTodoDocument.completed).toBe(true);
                        expect(mockTodoDocument.save).toHaveBeenCalled();
                        expect(cacheService.set).toHaveBeenCalled();
                        expect(cacheService.delPattern).toHaveBeenCalled();
                        expect(result).toEqual(__assign(__assign({}, mockTodo), { completed: true }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
