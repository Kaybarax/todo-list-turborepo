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
var todo_controller_1 = require("./todo.controller");
var todo_service_1 = require("./todo.service");
describe('TodoController', function () {
    var controller;
    var todoService;
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
    var mockPaginatedTodos = {
        todos: [mockTodo],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
    };
    var mockStats = {
        total: 10,
        completed: 5,
        active: 5,
        overdue: 2,
        byPriority: { high: 3, medium: 4, low: 3 },
        byBlockchainNetwork: { polygon: 2, solana: 1 },
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockTodoService, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockTodoService = {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        getStats: jest.fn(),
                        toggleComplete: jest.fn(),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            controllers: [todo_controller_1.TodoController],
                            providers: [
                                {
                                    provide: todo_service_1.TodoService,
                                    useValue: mockTodoService,
                                },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    controller = module.get(todo_controller_1.TodoController);
                    todoService = module.get(todo_service_1.TodoService);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('create', function () {
        it('should create a todo successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createTodoDto, result;
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
                        todoService.create.mockResolvedValue(mockTodo);
                        return [4 /*yield*/, controller.create(createTodoDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.create).toHaveBeenCalledWith(createTodoDto, mockUser.id);
                        expect(result).toEqual(mockTodo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle create with minimal data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createTodoDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createTodoDto = {
                            title: 'Simple Todo',
                        };
                        todoService.create.mockResolvedValue(mockTodo);
                        return [4 /*yield*/, controller.create(createTodoDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.create).toHaveBeenCalledWith(createTodoDto, mockUser.id);
                        expect(result).toEqual(mockTodo);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAll', function () {
        it('should return paginated todos with default query', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = {};
                        todoService.findAll.mockResolvedValue(mockPaginatedTodos);
                        return [4 /*yield*/, controller.findAll(queryDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.findAll).toHaveBeenCalledWith(queryDto, mockUser.id);
                        expect(result).toEqual(mockPaginatedTodos);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return paginated todos with filters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = {
                            page: 2,
                            limit: 5,
                            completed: true,
                            priority: 'high',
                            search: 'important',
                            tag: 'work',
                            sortBy: 'dueDate',
                            sortOrder: 'asc',
                        };
                        todoService.findAll.mockResolvedValue(mockPaginatedTodos);
                        return [4 /*yield*/, controller.findAll(queryDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.findAll).toHaveBeenCalledWith(queryDto, mockUser.id);
                        expect(result).toEqual(mockPaginatedTodos);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle blockchain network filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = {
                            blockchainNetwork: 'solana',
                        };
                        todoService.findAll.mockResolvedValue(mockPaginatedTodos);
                        return [4 /*yield*/, controller.findAll(queryDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.findAll).toHaveBeenCalledWith(queryDto, mockUser.id);
                        expect(result).toEqual(mockPaginatedTodos);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getStats', function () {
        it('should return todo statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoService.getStats.mockResolvedValue(mockStats);
                        return [4 /*yield*/, controller.getStats(mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.getStats).toHaveBeenCalledWith(mockUser.id);
                        expect(result).toEqual(mockStats);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findOne', function () {
        it('should return a todo by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        todoService.findOne.mockResolvedValue(mockTodo);
                        return [4 /*yield*/, controller.findOne(todoId, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.findOne).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(result).toEqual(mockTodo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle non-existent todo ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'nonexistent';
                        todoService.findOne.mockRejectedValue(new Error('Todo not found'));
                        return [4 /*yield*/, expect(controller.findOne(todoId, mockUser)).rejects.toThrow('Todo not found')];
                    case 1:
                        _a.sent();
                        expect(todoService.findOne).toHaveBeenCalledWith(todoId, mockUser.id);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update a todo successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, updateTodoDto, updatedTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        updateTodoDto = {
                            title: 'Updated Todo',
                            completed: true,
                            priority: 'low',
                        };
                        updatedTodo = __assign(__assign({}, mockTodo), updateTodoDto);
                        todoService.update.mockResolvedValue(updatedTodo);
                        return [4 /*yield*/, controller.update(todoId, updateTodoDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.update).toHaveBeenCalledWith(todoId, updateTodoDto, mockUser.id);
                        expect(result).toEqual(updatedTodo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle partial updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, updateTodoDto, updatedTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        updateTodoDto = {
                            completed: true,
                        };
                        updatedTodo = __assign(__assign({}, mockTodo), { completed: true });
                        todoService.update.mockResolvedValue(updatedTodo);
                        return [4 /*yield*/, controller.update(todoId, updateTodoDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.update).toHaveBeenCalledWith(todoId, updateTodoDto, mockUser.id);
                        expect(result).toEqual(updatedTodo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle blockchain-related updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, updateTodoDto, updatedTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        updateTodoDto = {
                            blockchainNetwork: 'solana',
                            transactionHash: '0xabc123',
                        };
                        updatedTodo = __assign(__assign({}, mockTodo), updateTodoDto);
                        todoService.update.mockResolvedValue(updatedTodo);
                        return [4 /*yield*/, controller.update(todoId, updateTodoDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.update).toHaveBeenCalledWith(todoId, updateTodoDto, mockUser.id);
                        expect(result).toEqual(updatedTodo);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('toggleComplete', function () {
        it('should toggle todo completion status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, toggledTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        toggledTodo = __assign(__assign({}, mockTodo), { completed: true });
                        todoService.toggleComplete.mockResolvedValue(toggledTodo);
                        return [4 /*yield*/, controller.toggleComplete(todoId, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.toggleComplete).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(result).toEqual(toggledTodo);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle toggle from completed to incomplete', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, completedTodo, toggledTodo, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        completedTodo = __assign(__assign({}, mockTodo), { completed: true });
                        toggledTodo = __assign(__assign({}, mockTodo), { completed: false });
                        todoService.toggleComplete.mockResolvedValue(toggledTodo);
                        return [4 /*yield*/, controller.toggleComplete(todoId, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.toggleComplete).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(result).toEqual(toggledTodo);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('remove', function () {
        it('should remove a todo successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'todo123';
                        todoService.remove.mockResolvedValue(undefined);
                        return [4 /*yield*/, controller.remove(todoId, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.remove).toHaveBeenCalledWith(todoId, mockUser.id);
                        expect(result).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle removal of non-existent todo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var todoId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todoId = 'nonexistent';
                        todoService.remove.mockRejectedValue(new Error('Todo not found'));
                        return [4 /*yield*/, expect(controller.remove(todoId, mockUser)).rejects.toThrow('Todo not found')];
                    case 1:
                        _a.sent();
                        expect(todoService.remove).toHaveBeenCalledWith(todoId, mockUser.id);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('error handling', function () {
        it('should propagate service errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createTodoDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createTodoDto = {
                            title: 'Test Todo',
                        };
                        todoService.create.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(controller.create(createTodoDto, mockUser)).rejects.toThrow('Database error')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle authentication errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = {};
                        todoService.findAll.mockRejectedValue(new Error('Unauthorized'));
                        return [4 /*yield*/, expect(controller.findAll(queryDto, mockUser)).rejects.toThrow('Unauthorized')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('input validation', function () {
        it('should handle empty query parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queryDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryDto = {};
                        todoService.findAll.mockResolvedValue(mockPaginatedTodos);
                        return [4 /*yield*/, controller.findAll(queryDto, mockUser)];
                    case 1:
                        result = _a.sent();
                        expect(todoService.findAll).toHaveBeenCalledWith({}, mockUser.id);
                        expect(result).toEqual(mockPaginatedTodos);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid user context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createTodoDto, invalidUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createTodoDto = {
                            title: 'Test Todo',
                        };
                        invalidUser = { id: '' };
                        todoService.create.mockRejectedValue(new Error('Invalid user'));
                        return [4 /*yield*/, expect(controller.create(createTodoDto, invalidUser)).rejects.toThrow('Invalid user')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
