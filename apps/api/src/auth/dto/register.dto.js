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
exports.RegisterDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var RegisterDto = exports.RegisterDto = function () {
    var _a;
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
    return _a = /** @class */ (function () {
            function RegisterDto() {
                this.email = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.password = __runInitializers(this, _password_initializers, void 0);
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.walletAddress = __runInitializers(this, _walletAddress_initializers, void 0);
                this.preferredNetwork = __runInitializers(this, _preferredNetwork_initializers, void 0);
            }
            return RegisterDto;
        }()),
        (function () {
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'User email address', example: 'user@example.com' }), (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return value === null || value === void 0 ? void 0 : value.toLowerCase().trim();
                })];
            _password_decorators = [(0, swagger_1.ApiProperty)({ description: 'User password', example: 'SecurePassword123!', minLength: 6 }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'User display name', example: 'John Doe', maxLength: 100 }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(1, { message: 'Name is required' }), (0, class_validator_1.MaxLength)(100, { message: 'Name must not exceed 100 characters' }), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return value === null || value === void 0 ? void 0 : value.trim();
                })];
            _walletAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'User wallet address', example: '0x1234567890abcdef', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return value === null || value === void 0 ? void 0 : value.trim();
                })];
            _preferredNetwork_decorators = [(0, swagger_1.ApiProperty)({ description: 'Preferred blockchain network', enum: ['solana', 'polkadot', 'polygon'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['solana', 'polkadot', 'polygon'], { message: 'Preferred network must be solana, polkadot, or polygon' })];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } } }, _email_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } } }, _password_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _walletAddress_decorators, { kind: "field", name: "walletAddress", static: false, private: false, access: { has: function (obj) { return "walletAddress" in obj; }, get: function (obj) { return obj.walletAddress; }, set: function (obj, value) { obj.walletAddress = value; } } }, _walletAddress_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _preferredNetwork_decorators, { kind: "field", name: "preferredNetwork", static: false, private: false, access: { has: function (obj) { return "preferredNetwork" in obj; }, get: function (obj) { return obj.preferredNetwork; }, set: function (obj, value) { obj.preferredNetwork = value; } } }, _preferredNetwork_initializers, _instanceExtraInitializers);
        })(),
        _a;
}();
