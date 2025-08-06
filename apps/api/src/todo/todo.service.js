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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
var common_1 = require("@nestjs/common");
var trace_decorator_1 = require("../telemetry/decorators/trace.decorator");
var TodoService = exports.TodoService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _update_decorators;
    var _remove_decorators;
    var _getStats_decorators;
    var _toggleComplete_decorators;
    var TodoService = _classThis = /** @class */ (function () {
        function TodoService_1(todoRepository, cacheService) {
            this.todoRepository = (__runInitializers(this, _instanceExtraInitializers), todoRepository);
            this.cacheService = cacheService;
            this.logger = new common_1.Logger(TodoService.name);
            this.CACHE_TTL = 300; // 5 minutes
        }
        TodoService_1.prototype.create = function (createTodoDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var todoData, todo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            todoData = __assign(__assign({}, createTodoDto), { userId: userId, dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : undefined });
                            return [4 /*yield*/, this.todoRepository.create(todoData)];
                        case 1:
                            todo = _a.sent();
                            // Invalidate user's cached data
                            return [4 /*yield*/, this.invalidateUserCache(userId)];
                        case 2:
                            // Invalidate user's cached data
                            _a.sent();
                            return [2 /*return*/, todo];
                    }
                });
            });
        };
        TodoService_1.prototype.findAll = function (queryDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, completed, priority, blockchainNetwork, search, tag, sortBy, sortOrder, filterString, cacheKey, cachedResult, filter, sort, priorityOrder, _a, todos, total, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            page = queryDto.page, limit = queryDto.limit, completed = queryDto.completed, priority = queryDto.priority, blockchainNetwork = queryDto.blockchainNetwork, search = queryDto.search, tag = queryDto.tag, sortBy = queryDto.sortBy, sortOrder = queryDto.sortOrder;
                            filterString = JSON.stringify({ completed: completed, priority: priority, blockchainNetwork: blockchainNetwork, search: search, tag: tag, sortBy: sortBy, sortOrder: sortOrder });
                            cacheKey = this.cacheService.generateUserTodosKey(userId, page, filterString);
                            return [4 /*yield*/, this.cacheService.get(cacheKey)];
                        case 1:
                            cachedResult = _b.sent();
                            if (cachedResult) {
                                this.logger.debug("Cache hit for user ".concat(userId, " todos page ").concat(page));
                                return [2 /*return*/, cachedResult];
                            }
                            filter = { userId: userId };
                            if (completed !== undefined) {
                                filter.completed = completed;
                            }
                            if (priority) {
                                filter.priority = priority;
                            }
                            if (blockchainNetwork) {
                                filter.blockchainNetwork = blockchainNetwork;
                            }
                            if (search) {
                                filter.$or = [
                                    { title: { $regex: search, $options: 'i' } },
                                    { description: { $regex: search, $options: 'i' } },
                                ];
                            }
                            if (tag) {
                                filter.tags = { $in: [tag] };
                            }
                            sort = {};
                            if (sortBy === 'priority') {
                                priorityOrder = { high: 3, medium: 2, low: 1 };
                                sort.priority = sortOrder === 'asc' ? 1 : -1;
                            }
                            else {
                                sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.todoRepository.findMany(filter, {
                                        sort: sort,
                                        skip: (page - 1) * limit,
                                        limit: limit,
                                    }),
                                    this.todoRepository.count(filter),
                                ])];
                        case 2:
                            _a = _b.sent(), todos = _a[0], total = _a[1];
                            result = {
                                todos: todos,
                                total: total,
                                page: page,
                                limit: limit,
                                totalPages: Math.ceil(total / limit),
                            };
                            // Cache the result
                            return [4 /*yield*/, this.cacheService.set(cacheKey, result, this.CACHE_TTL)];
                        case 3:
                            // Cache the result
                            _b.sent();
                            this.logger.debug("Cache set for user ".concat(userId, " todos page ").concat(page));
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        TodoService_1.prototype.findOne = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cachedTodo, todo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.cacheService.generateTodoKey(id);
                            return [4 /*yield*/, this.cacheService.get(cacheKey)];
                        case 1:
                            cachedTodo = _a.sent();
                            if (cachedTodo && cachedTodo.userId === userId) {
                                this.logger.debug("Cache hit for todo ".concat(id));
                                return [2 /*return*/, cachedTodo];
                            }
                            return [4 /*yield*/, this.todoRepository.findByIdAndUserId(id, userId)];
                        case 2:
                            todo = _a.sent();
                            if (!todo) {
                                throw new common_1.NotFoundException("Todo with ID ".concat(id, " not found or access denied"));
                            }
                            // Cache the todo
                            return [4 /*yield*/, this.cacheService.set(cacheKey, todo, this.CACHE_TTL)];
                        case 3:
                            // Cache the todo
                            _a.sent();
                            return [2 /*return*/, todo];
                    }
                });
            });
        };
        TodoService_1.prototype.update = function (id, updateTodoDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var updateData, updatedTodo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            updateData = __assign(__assign({}, updateTodoDto), { dueDate: updateTodoDto.dueDate ? new Date(updateTodoDto.dueDate) : undefined });
                            return [4 /*yield*/, this.todoRepository.updateById(id, updateData)];
                        case 1:
                            updatedTodo = _a.sent();
                            // Update cache and invalidate user cache
                            return [4 /*yield*/, Promise.all([
                                    this.cacheService.set(this.cacheService.generateTodoKey(id), updatedTodo, this.CACHE_TTL),
                                    this.invalidateUserCache(userId),
                                ])];
                        case 2:
                            // Update cache and invalidate user cache
                            _a.sent();
                            return [2 /*return*/, updatedTodo];
                    }
                });
            });
        };
        TodoService_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var deleted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, userId)];
                        case 1:
                            _a.sent(); // Verify ownership
                            return [4 /*yield*/, this.todoRepository.deleteById(id)];
                        case 2:
                            deleted = _a.sent();
                            if (!deleted) {
                                throw new common_1.NotFoundException("Todo with ID ".concat(id, " not found"));
                            }
                            // Remove from cache and invalidate user cache
                            return [4 /*yield*/, Promise.all([
                                    this.cacheService.del(this.cacheService.generateTodoKey(id)),
                                    this.invalidateUserCache(userId),
                                ])];
                        case 3:
                            // Remove from cache and invalidate user cache
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        TodoService_1.prototype.getStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cachedStats, _a, total, completed, overdue, priorityStats, blockchainStats, byPriority, byBlockchainNetwork, stats;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cacheKey = this.cacheService.generateUserStatsKey(userId);
                            return [4 /*yield*/, this.cacheService.get(cacheKey)];
                        case 1:
                            cachedStats = _b.sent();
                            if (cachedStats) {
                                this.logger.debug("Cache hit for user ".concat(userId, " stats"));
                                return [2 /*return*/, cachedStats];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.todoRepository.count({ userId: userId }),
                                    this.todoRepository.count({ userId: userId, completed: true }),
                                    this.todoRepository.count({
                                        userId: userId,
                                        completed: false,
                                        dueDate: { $lt: new Date() },
                                    }),
                                    this.todoRepository.aggregate([
                                        { $match: { userId: userId } },
                                        { $group: { _id: '$priority', count: { $sum: 1 } } },
                                    ]),
                                    this.todoRepository.aggregate([
                                        { $match: { userId: userId, blockchainNetwork: { $exists: true } } },
                                        { $group: { _id: '$blockchainNetwork', count: { $sum: 1 } } },
                                    ]),
                                ])];
                        case 2:
                            _a = _b.sent(), total = _a[0], completed = _a[1], overdue = _a[2], priorityStats = _a[3], blockchainStats = _a[4];
                            byPriority = priorityStats.reduce(function (acc, stat) {
                                acc[stat._id] = stat.count;
                                return acc;
                            }, {});
                            byBlockchainNetwork = blockchainStats.reduce(function (acc, stat) {
                                acc[stat._id] = stat.count;
                                return acc;
                            }, {});
                            stats = {
                                total: total,
                                completed: completed,
                                active: total - completed,
                                overdue: overdue,
                                byPriority: byPriority,
                                byBlockchainNetwork: byBlockchainNetwork,
                            };
                            // Cache the stats with shorter TTL since they change frequently
                            return [4 /*yield*/, this.cacheService.set(cacheKey, stats, 60)];
                        case 3:
                            // Cache the stats with shorter TTL since they change frequently
                            _b.sent(); // 1 minute
                            return [2 /*return*/, stats];
                    }
                });
            });
        };
        TodoService_1.prototype.toggleComplete = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var todo, updatedTodo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, userId)];
                        case 1:
                            todo = _a.sent();
                            return [4 /*yield*/, this.todoRepository.updateById(id, { completed: !todo.completed })];
                        case 2:
                            updatedTodo = _a.sent();
                            // Update cache and invalidate user cache
                            return [4 /*yield*/, Promise.all([
                                    this.cacheService.set(this.cacheService.generateTodoKey(id), updatedTodo, this.CACHE_TTL),
                                    this.invalidateUserCache(userId),
                                ])];
                        case 3:
                            // Update cache and invalidate user cache
                            _a.sent();
                            return [2 /*return*/, updatedTodo];
                    }
                });
            });
        };
        TodoService_1.prototype.invalidateUserCache = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // Invalidate all user-related cache entries
                            return [4 /*yield*/, Promise.all([
                                    this.cacheService.delPattern(this.cacheService.generateUserPattern(userId)),
                                    this.cacheService.del(this.cacheService.generateUserStatsKey(userId)),
                                ])];
                        case 1:
                            // Invalidate all user-related cache entries
                            _a.sent();
                            this.logger.debug("Cache invalidated for user ".concat(userId));
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Error invalidating cache for user ".concat(userId, ":"), error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return TodoService_1;
    }());
    __setFunctionName(_classThis, "TodoService");
    (function () {
        _update_decorators = [(0, trace_decorator_1.Trace)('TodoService.update')];
        _remove_decorators = [(0, trace_decorator_1.Trace)('TodoService.remove')];
        _getStats_decorators = [(0, trace_decorator_1.Trace)('TodoService.getStats')];
        _toggleComplete_decorators = [(0, trace_decorator_1.Trace)('TodoService.toggleComplete')];
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggleComplete_decorators, { kind: "method", name: "toggleComplete", static: false, private: false, access: { has: function (obj) { return "toggleComplete" in obj; }, get: function (obj) { return obj.toggleComplete; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        TodoService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TodoService = _classThis;
}();
