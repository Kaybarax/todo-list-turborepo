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
var jwt_1 = require("@nestjs/jwt");
var request = require("supertest");
var mongodb_memory_server_1 = require("mongodb-memory-server");
var app_module_1 = require("../src/app.module");
describe('Todo Integration Tests', function () {
    var app;
    var mongoServer;
    var authToken;
    var userId;
    var todoId;
    var testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
    };
    var testTodo = {
        title: 'Integration Test Todo',
        description: 'Testing todo creation via API',
        priority: 'high',
        dueDate: '2024-12-31',
        tags: ['integration', 'test'],
    };
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mongoUri, moduleFixture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongodb_memory_server_1.MongoMemoryServer.create()];
                case 1:
                    // Start in-memory MongoDB
                    mongoServer = _a.sent();
                    mongoUri = mongoServer.getUri();
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            imports: [
                                mongoose_1.MongooseModule.forRoot(mongoUri),
                                jwt_1.JwtModule.register({
                                    secret: 'test-secret',
                                    signOptions: { expiresIn: '1h' },
                                }),
                                app_module_1.AppModule,
                            ],
                        }).compile()];
                case 2:
                    moduleFixture = _a.sent();
                    app = moduleFixture.createNestApplication();
                    return [4 /*yield*/, app.init()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, app.close()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mongoServer.stop()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Authentication Flow', function () {
        it('should register a new user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/auth/register')
                            .send(testUser)
                            .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('access_token');
                        expect(response.body.user).toHaveProperty('id');
                        expect(response.body.user.email).toBe(testUser.email);
                        expect(response.body.user.name).toBe(testUser.name);
                        authToken = response.body.access_token;
                        userId = response.body.user.id;
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not register user with duplicate email', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/auth/register')
                            .send(testUser)
                            .expect(409)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should login with valid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/auth/login')
                            .send({
                            email: testUser.email,
                            password: testUser.password,
                        })
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('access_token');
                        expect(response.body.user.email).toBe(testUser.email);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not login with invalid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/auth/login')
                            .send({
                            email: testUser.email,
                            password: 'wrongpassword',
                        })
                            .expect(401)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Todo CRUD Operations', function () {
        it('should create a new todo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send(testTodo)
                            .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('_id');
                        expect(response.body.title).toBe(testTodo.title);
                        expect(response.body.description).toBe(testTodo.description);
                        expect(response.body.priority).toBe(testTodo.priority);
                        expect(response.body.completed).toBe(false);
                        expect(response.body.userId).toBe(userId);
                        expect(response.body.tags).toEqual(testTodo.tags);
                        todoId = response.body._id;
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not create todo without authentication', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .send(testTodo)
                            .expect(401)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not create todo with invalid data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send({
                            title: '',
                            description: testTodo.description,
                        })
                            .expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get all todos for authenticated user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('todos');
                        expect(response.body).toHaveProperty('total');
                        expect(response.body).toHaveProperty('page');
                        expect(response.body).toHaveProperty('limit');
                        expect(response.body).toHaveProperty('totalPages');
                        expect(response.body.todos).toHaveLength(1);
                        expect(response.body.todos[0]._id).toBe(todoId);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get todos with pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 1;
                        _a.label = 1;
                    case 1:
                        if (!(i <= 5)) return [3 /*break*/, 4];
                        return [4 /*yield*/, request(app.getHttpServer())
                                .post('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(__assign(__assign({}, testTodo), { title: "Todo ".concat(i) }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos?page=1&limit=3')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 5:
                        response = _a.sent();
                        expect(response.body.todos).toHaveLength(3);
                        expect(response.body.total).toBe(6); // Original + 5 new
                        expect(response.body.page).toBe(1);
                        expect(response.body.limit).toBe(3);
                        expect(response.body.totalPages).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter todos by completion status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos?completed=false')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.todos.every(function (todo) { return !todo.completed; })).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter todos by priority', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos?priority=high')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.todos.every(function (todo) { return todo.priority === 'high'; })).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search todos by title and description', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos?search=Integration')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.todos.length).toBeGreaterThan(0);
                        expect(response.body.todos.some(function (todo) {
                            return todo.title.includes('Integration') || todo.description.includes('Integration');
                        })).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get todo by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get("/todos/".concat(todoId))
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body._id).toBe(todoId);
                        expect(response.body.title).toBe(testTodo.title);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not get todo that does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            var nonExistentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonExistentId = '507f1f77bcf86cd799439011';
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get("/todos/".concat(nonExistentId))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(404)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not get todo from another user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var anotherUser, registerResponse, anotherToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        anotherUser = {
                            email: 'another@example.com',
                            password: 'password123',
                            name: 'Another User',
                        };
                        return [4 /*yield*/, request(app.getHttpServer())
                                .post('/auth/register')
                                .send(anotherUser)];
                    case 1:
                        registerResponse = _a.sent();
                        anotherToken = registerResponse.body.access_token;
                        // Try to access the first user's todo
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get("/todos/".concat(todoId))
                                .set('Authorization', "Bearer ".concat(anotherToken))
                                .expect(404)];
                    case 2:
                        // Try to access the first user's todo
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update todo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            title: 'Updated Integration Test Todo',
                            description: 'Updated description',
                            priority: 'medium',
                            completed: true,
                        };
                        return [4 /*yield*/, request(app.getHttpServer())
                                .put("/todos/".concat(todoId))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(updateData)
                                .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.title).toBe(updateData.title);
                        expect(response.body.description).toBe(updateData.description);
                        expect(response.body.priority).toBe(updateData.priority);
                        expect(response.body.completed).toBe(updateData.completed);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should toggle todo completion', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getResponse, currentStatus, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get("/todos/".concat(todoId))
                            .set('Authorization', "Bearer ".concat(authToken))];
                    case 1:
                        getResponse = _a.sent();
                        currentStatus = getResponse.body.completed;
                        return [4 /*yield*/, request(app.getHttpServer())
                                .patch("/todos/".concat(todoId, "/toggle"))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(200)];
                    case 2:
                        response = _a.sent();
                        expect(response.body.completed).toBe(!currentStatus);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should delete todo', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .delete("/todos/".concat(todoId))
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        _a.sent();
                        // Verify todo is deleted
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get("/todos/".concat(todoId))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(404)];
                    case 2:
                        // Verify todo is deleted
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Todo Statistics', function () {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var todos, _i, todos_1, todo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        todos = [
                            __assign(__assign({}, testTodo), { title: 'Todo 1', completed: false, priority: 'high' }),
                            __assign(__assign({}, testTodo), { title: 'Todo 2', completed: true, priority: 'medium' }),
                            __assign(__assign({}, testTodo), { title: 'Todo 3', completed: false, priority: 'low' }),
                            __assign(__assign({}, testTodo), { title: 'Todo 4', completed: true, priority: 'high' }),
                            __assign(__assign({}, testTodo), { title: 'Overdue Todo', completed: false, priority: 'medium', dueDate: '2023-01-01' }),
                        ];
                        _i = 0, todos_1 = todos;
                        _a.label = 1;
                    case 1:
                        if (!(_i < todos_1.length)) return [3 /*break*/, 4];
                        todo = todos_1[_i];
                        return [4 /*yield*/, request(app.getHttpServer())
                                .post('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(todo)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should get todo statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos/stats')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body).toHaveProperty('total');
                        expect(response.body).toHaveProperty('completed');
                        expect(response.body).toHaveProperty('active');
                        expect(response.body).toHaveProperty('overdue');
                        expect(response.body).toHaveProperty('byPriority');
                        expect(response.body).toHaveProperty('byBlockchainNetwork');
                        expect(response.body.total).toBeGreaterThan(0);
                        expect(response.body.completed).toBeGreaterThan(0);
                        expect(response.body.active).toBeGreaterThan(0);
                        expect(response.body.overdue).toBeGreaterThan(0);
                        expect(response.body.byPriority).toHaveProperty('high');
                        expect(response.body.byPriority).toHaveProperty('medium');
                        expect(response.body.byPriority).toHaveProperty('low');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Error Handling', function () {
        it('should handle invalid JWT token', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos')
                            .set('Authorization', 'Bearer invalid-token')
                            .expect(401)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle expired JWT token', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // This would require mocking time or using a very short expiration
                    // For now, we'll test with a malformed token
                    return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos')
                            .set('Authorization', 'Bearer expired.token.here')
                            .expect(401)];
                    case 1:
                        // This would require mocking time or using a very short expiration
                        // For now, we'll test with a malformed token
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle malformed request data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send('invalid json')
                            .expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid ObjectId format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos/invalid-id')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Caching Integration', function () {
        var testTodoId;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send(testTodo)];
                    case 1:
                        response = _a.sent();
                        testTodoId = response.body._id;
                        return [2 /*return*/];
                }
            });
        }); });
        it('should cache todo list results', function () { return __awaiter(void 0, void 0, void 0, function () {
            var start1, time1, start2, time2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start1 = Date.now();
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(200)];
                    case 1:
                        _a.sent();
                        time1 = Date.now() - start1;
                        start2 = Date.now();
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(200)];
                    case 2:
                        _a.sent();
                        time2 = Date.now() - start2;
                        // Cache should be faster (though this is not always reliable in tests)
                        expect(time2).toBeLessThanOrEqual(time1 + 50); // Allow some variance
                        return [2 /*return*/];
                }
            });
        }); });
        it('should invalidate cache on todo creation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response1, initialCount, response2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .get('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))];
                    case 1:
                        response1 = _a.sent();
                        initialCount = response1.body.total;
                        // Create new todo
                        return [4 /*yield*/, request(app.getHttpServer())
                                .post('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(__assign(__assign({}, testTodo), { title: 'Cache Test Todo' }))];
                    case 2:
                        // Create new todo
                        _a.sent();
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))];
                    case 3:
                        response2 = _a.sent();
                        expect(response2.body.total).toBe(initialCount + 1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should invalidate cache on todo update', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Update todo
                    return [4 /*yield*/, request(app.getHttpServer())
                            .put("/todos/".concat(testTodoId))
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send({ title: 'Updated Cache Test Todo' })];
                    case 1:
                        // Update todo
                        _a.sent();
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get("/todos/".concat(testTodoId))
                                .set('Authorization', "Bearer ".concat(authToken))];
                    case 2:
                        response = _a.sent();
                        expect(response.body.title).toBe('Updated Cache Test Todo');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Concurrent Operations', function () {
        it('should handle concurrent todo creation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var promises, responses, listResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = Array.from({ length: 10 }, function (_, i) {
                            return request(app.getHttpServer())
                                .post('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(__assign(__assign({}, testTodo), { title: "Concurrent Todo ".concat(i) }));
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        responses = _a.sent();
                        // All requests should succeed
                        responses.forEach(function (response) {
                            expect(response.status).toBe(201);
                            expect(response.body).toHaveProperty('_id');
                        });
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))];
                    case 2:
                        listResponse = _a.sent();
                        expect(listResponse.body.total).toBeGreaterThanOrEqual(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle concurrent todo updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createResponse, todoId, promises, responses, getResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send(testTodo)];
                    case 1:
                        createResponse = _a.sent();
                        todoId = createResponse.body._id;
                        promises = Array.from({ length: 5 }, function (_, i) {
                            return request(app.getHttpServer())
                                .put("/todos/".concat(todoId))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send({
                                title: "Updated Title ".concat(i),
                                description: "Updated Description ".concat(i),
                            });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        responses = _a.sent();
                        // All requests should succeed (last one wins)
                        responses.forEach(function (response) {
                            expect(response.status).toBe(200);
                        });
                        return [4 /*yield*/, request(app.getHttpServer())
                                .get("/todos/".concat(todoId))
                                .set('Authorization', "Bearer ".concat(authToken))];
                    case 3:
                        getResponse = _a.sent();
                        expect(getResponse.body.title).toMatch(/Updated Title \d/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Data Validation Integration', function () {
        it('should validate todo title length', function () { return __awaiter(void 0, void 0, void 0, function () {
            var longTitle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        longTitle = 'a'.repeat(256);
                        return [4 /*yield*/, request(app.getHttpServer())
                                .post('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(__assign(__assign({}, testTodo), { title: longTitle }))
                                .expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate priority values', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send(__assign(__assign({}, testTodo), { priority: 'invalid-priority' }))
                            .expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate due date format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app.getHttpServer())
                            .post('/todos')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .send(__assign(__assign({}, testTodo), { dueDate: 'invalid-date' }))
                            .expect(400)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sanitize input data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maliciousInput, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maliciousInput = {
                            title: '<script>alert("xss")</script>Clean Title',
                            description: '<img src="x" onerror="alert(1)">Clean Description',
                        };
                        return [4 /*yield*/, request(app.getHttpServer())
                                .post('/todos')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(__assign(__assign({}, testTodo), maliciousInput))
                                .expect(201)];
                    case 1:
                        response = _a.sent();
                        // Should strip malicious content
                        expect(response.body.title).not.toContain('<script>');
                        expect(response.body.description).not.toContain('<img');
                        expect(response.body.title).toContain('Clean Title');
                        expect(response.body.description).toContain('Clean Description');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
