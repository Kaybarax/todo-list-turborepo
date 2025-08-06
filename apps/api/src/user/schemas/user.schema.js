"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.UserSchema = exports.User = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var swagger_1 = require("@nestjs/swagger");
var bcrypt = require("bcrypt");
var User = exports.User = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _walletAddress_decorators;
    var _walletAddress_initializers = [];
    var _preferredNetwork_decorators;
    var _preferredNetwork_initializers = [];
    var _settings_decorators;
    var _settings_initializers = [];
    var _isVerified_decorators;
    var _isVerified_initializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _lastLoginAt_decorators;
    var _lastLoginAt_initializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var User = _classThis = /** @class */ (function () {
        function User_1() {
            this.email = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.password = __runInitializers(this, _password_initializers, void 0);
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.walletAddress = __runInitializers(this, _walletAddress_initializers, void 0);
            this.preferredNetwork = __runInitializers(this, _preferredNetwork_initializers, void 0);
            this.settings = __runInitializers(this, _settings_initializers, void 0);
            this.isVerified = __runInitializers(this, _isVerified_initializers, void 0);
            this.isActive = __runInitializers(this, _isActive_initializers, void 0);
            this.lastLoginAt = __runInitializers(this, _lastLoginAt_initializers, void 0);
            this.createdAt = __runInitializers(this, _createdAt_initializers, void 0);
            this.updatedAt = __runInitializers(this, _updatedAt_initializers, void 0);
        }
        return User_1;
    }());
    __setFunctionName(_classThis, "User");
    (function () {
        _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'User email address', example: 'user@example.com' }), (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true })];
        _password_decorators = [(0, mongoose_1.Prop)({ required: true, minlength: 6 })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'User display name', example: 'John Doe' }), (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 100 })];
        _walletAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'User wallet address', example: '0x1234567890abcdef', required: false }), (0, mongoose_1.Prop)({ sparse: true })];
        _preferredNetwork_decorators = [(0, swagger_1.ApiProperty)({ description: 'Preferred blockchain network', enum: ['solana', 'polkadot', 'polygon'], required: false }), (0, mongoose_1.Prop)({ enum: ['solana', 'polkadot', 'polygon'] })];
        _settings_decorators = [(0, swagger_1.ApiProperty)({ description: 'User settings' }), (0, mongoose_1.Prop)({
                type: {
                    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
                    notifications: { type: Boolean, default: true },
                    defaultPriority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
                },
                default: {},
            })];
        _isVerified_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account verification status' }), (0, mongoose_1.Prop)({ default: false })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account active status' }), (0, mongoose_1.Prop)({ default: true })];
        _lastLoginAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last login timestamp' }), (0, mongoose_1.Prop)({ type: Date })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } } }, _email_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } } }, _password_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _walletAddress_decorators, { kind: "field", name: "walletAddress", static: false, private: false, access: { has: function (obj) { return "walletAddress" in obj; }, get: function (obj) { return obj.walletAddress; }, set: function (obj, value) { obj.walletAddress = value; } } }, _walletAddress_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _preferredNetwork_decorators, { kind: "field", name: "preferredNetwork", static: false, private: false, access: { has: function (obj) { return "preferredNetwork" in obj; }, get: function (obj) { return obj.preferredNetwork; }, set: function (obj, value) { obj.preferredNetwork = value; } } }, _preferredNetwork_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: function (obj) { return "settings" in obj; }, get: function (obj) { return obj.settings; }, set: function (obj, value) { obj.settings = value; } } }, _settings_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: function (obj) { return "isVerified" in obj; }, get: function (obj) { return obj.isVerified; }, set: function (obj, value) { obj.isVerified = value; } } }, _isVerified_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } } }, _isActive_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lastLoginAt_decorators, { kind: "field", name: "lastLoginAt", static: false, private: false, access: { has: function (obj) { return "lastLoginAt" in obj; }, get: function (obj) { return obj.lastLoginAt; }, set: function (obj, value) { obj.lastLoginAt = value; } } }, _lastLoginAt_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } } }, _createdAt_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } } }, _updatedAt_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
}();
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
// Pre-save middleware to hash password
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!this.isModified('password'))
                        return [2 /*return*/, next()];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, bcrypt.genSalt(12)];
                case 2:
                    salt = _b.sent();
                    _a = this;
                    return [4 /*yield*/, bcrypt.hash(this.password, salt)];
                case 3:
                    _a.password = _b.sent();
                    next();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    next(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
// Instance method to compare passwords
exports.UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, bcrypt.compare(candidatePassword, this.password)];
        });
    });
};
// Remove password from JSON output
exports.UserSchema.methods.toJSON = function () {
    var userObject = this.toObject();
    delete userObject.password;
    return userObject;
};
// Add indexes
exports.UserSchema.index({ email: 1 });
exports.UserSchema.index({ walletAddress: 1 }, { sparse: true });
exports.UserSchema.index({ createdAt: -1 });
