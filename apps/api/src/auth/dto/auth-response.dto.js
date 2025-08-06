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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var AuthResponseDto = exports.AuthResponseDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _accessToken_decorators;
    var _accessToken_initializers = [];
    var _refreshToken_decorators;
    var _refreshToken_initializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _expiresIn_decorators;
    var _expiresIn_initializers = [];
    return _a = /** @class */ (function () {
            function AuthResponseDto() {
                this.accessToken = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _accessToken_initializers, void 0));
                this.refreshToken = __runInitializers(this, _refreshToken_initializers, void 0);
                this.user = __runInitializers(this, _user_initializers, void 0);
                this.expiresIn = __runInitializers(this, _expiresIn_initializers, void 0);
            }
            return AuthResponseDto;
        }()),
        (function () {
            _accessToken_decorators = [(0, swagger_1.ApiProperty)({ description: 'JWT access token' })];
            _refreshToken_decorators = [(0, swagger_1.ApiProperty)({ description: 'JWT refresh token' })];
            _user_decorators = [(0, swagger_1.ApiProperty)({ description: 'User information' })];
            _expiresIn_decorators = [(0, swagger_1.ApiProperty)({ description: 'Token expiration time in seconds' })];
            __esDecorate(null, null, _accessToken_decorators, { kind: "field", name: "accessToken", static: false, private: false, access: { has: function (obj) { return "accessToken" in obj; }, get: function (obj) { return obj.accessToken; }, set: function (obj, value) { obj.accessToken = value; } } }, _accessToken_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _refreshToken_decorators, { kind: "field", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; }, set: function (obj, value) { obj.refreshToken = value; } } }, _refreshToken_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } } }, _user_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _expiresIn_decorators, { kind: "field", name: "expiresIn", static: false, private: false, access: { has: function (obj) { return "expiresIn" in obj; }, get: function (obj) { return obj.expiresIn; }, set: function (obj, value) { obj.expiresIn = value; } } }, _expiresIn_initializers, _instanceExtraInitializers);
        })(),
        _a;
}();
