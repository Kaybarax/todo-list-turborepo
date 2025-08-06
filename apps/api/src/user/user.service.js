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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var trace_decorator_1 = require("../telemetry/decorators/trace.decorator");
var UserService = exports.UserService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findById_decorators;
    var _findByEmail_decorators;
    var _findByWalletAddress_decorators;
    var _updateById_decorators;
    var _deleteById_decorators;
    var _findAll_decorators;
    var UserService = _classThis = /** @class */ (function () {
        function UserService_1(userModel) {
            this.userModel = (__runInitializers(this, _instanceExtraInitializers), userModel);
        }
        UserService_1.prototype.create = function (registerDto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findByEmail(registerDto.email)];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ConflictException('User with this email already exists');
                            }
                            user = new this.userModel(__assign(__assign({}, registerDto), { settings: {
                                    theme: 'light',
                                    notifications: true,
                                    defaultPriority: 'medium',
                                } }));
                            return [2 /*return*/, user.save()];
                    }
                });
            });
        };
        UserService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userModel.findById(id).exec()];
                });
            });
        };
        UserService_1.prototype.findByEmail = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userModel.findOne({ email: email.toLowerCase() }).exec()];
                });
            });
        };
        UserService_1.prototype.findByWalletAddress = function (walletAddress) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userModel.findOne({ walletAddress: walletAddress }).exec()];
                });
            });
        };
        UserService_1.prototype.updateById = function (id, updateData) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userModel.findByIdAndUpdate(id, __assign(__assign({}, updateData), { updatedAt: new Date() }), { new: true }).exec()];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        UserService_1.prototype.updateLastLogin = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() }).exec()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserService_1.prototype.deactivateUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateById(id, { isActive: false })];
                });
            });
        };
        UserService_1.prototype.activateUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateById(id, { isActive: true })];
                });
            });
        };
        UserService_1.prototype.verifyUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateById(id, { isVerified: true })];
                });
            });
        };
        UserService_1.prototype.deleteById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userModel.findByIdAndDelete(id).exec()];
                        case 1:
                            result = _a.sent();
                            if (!result) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserService_1.prototype.findAll = function (query) {
            if (query === void 0) { query = {}; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userModel.find(query).exec()];
                });
            });
        };
        UserService_1.prototype.getUserStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, total, verified, active, recentSignups;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.userModel.countDocuments().exec(),
                                this.userModel.countDocuments({ isVerified: true }).exec(),
                                this.userModel.countDocuments({ isActive: true }).exec(),
                                this.userModel.countDocuments({
                                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                                }).exec(),
                            ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], verified = _a[1], active = _a[2], recentSignups = _a[3];
                            return [2 /*return*/, {
                                    total: total,
                                    verified: verified,
                                    active: active,
                                    recentSignups: recentSignups,
                                }];
                    }
                });
            });
        };
        return UserService_1;
    }());
    __setFunctionName(_classThis, "UserService");
    (function () {
        _create_decorators = [(0, trace_decorator_1.Trace)('UserService.create')];
        _findById_decorators = [(0, trace_decorator_1.Trace)('UserService.findById')];
        _findByEmail_decorators = [(0, trace_decorator_1.Trace)('UserService.findByEmail')];
        _findByWalletAddress_decorators = [(0, trace_decorator_1.Trace)('UserService.findByWalletAddress')];
        _updateById_decorators = [(0, trace_decorator_1.Trace)('UserService.updateById')];
        _deleteById_decorators = [(0, trace_decorator_1.Trace)('UserService.deleteById')];
        _findAll_decorators = [(0, trace_decorator_1.Trace)('UserService.findAll')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findById_decorators, { kind: "method", name: "findById", static: false, private: false, access: { has: function (obj) { return "findById" in obj; }, get: function (obj) { return obj.findById; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByEmail_decorators, { kind: "method", name: "findByEmail", static: false, private: false, access: { has: function (obj) { return "findByEmail" in obj; }, get: function (obj) { return obj.findByEmail; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByWalletAddress_decorators, { kind: "method", name: "findByWalletAddress", static: false, private: false, access: { has: function (obj) { return "findByWalletAddress" in obj; }, get: function (obj) { return obj.findByWalletAddress; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateById_decorators, { kind: "method", name: "updateById", static: false, private: false, access: { has: function (obj) { return "updateById" in obj; }, get: function (obj) { return obj.updateById; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteById_decorators, { kind: "method", name: "deleteById", static: false, private: false, access: { has: function (obj) { return "deleteById" in obj; }, get: function (obj) { return obj.deleteById; } } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
}();
