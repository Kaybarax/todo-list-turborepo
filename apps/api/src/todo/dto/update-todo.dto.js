"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.UpdateTodoDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var swagger_2 = require("@nestjs/swagger");
var create_todo_dto_1 = require("./create-todo.dto");
var UpdateTodoDto = exports.UpdateTodoDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _completed_decorators;
    var _completed_initializers = [];
    var _blockchainNetwork_decorators;
    var _blockchainNetwork_initializers = [];
    var _transactionHash_decorators;
    var _transactionHash_initializers = [];
    var _blockchainAddress_decorators;
    var _blockchainAddress_initializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(UpdateTodoDto, _super);
            function UpdateTodoDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.completed = (__runInitializers(_this, _instanceExtraInitializers), __runInitializers(_this, _completed_initializers, void 0));
                _this.blockchainNetwork = __runInitializers(_this, _blockchainNetwork_initializers, void 0);
                _this.transactionHash = __runInitializers(_this, _transactionHash_initializers, void 0);
                _this.blockchainAddress = __runInitializers(_this, _blockchainAddress_initializers, void 0);
                return _this;
            }
            return UpdateTodoDto;
        }((0, swagger_1.PartialType)(create_todo_dto_1.CreateTodoDto))),
        (function () {
            _completed_decorators = [(0, swagger_2.ApiProperty)({ description: 'Todo completion status', example: false, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _blockchainNetwork_decorators = [(0, swagger_2.ApiProperty)({ description: 'Blockchain network where todo is stored', enum: ['solana', 'polkadot', 'polygon'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['solana', 'polkadot', 'polygon'], { message: 'Blockchain network must be solana, polkadot, or polygon' })];
            _transactionHash_decorators = [(0, swagger_2.ApiProperty)({ description: 'Blockchain transaction hash', example: '0x1234567890abcdef', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _blockchainAddress_decorators = [(0, swagger_2.ApiProperty)({ description: 'Blockchain address', example: 'solana-address-123', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: function (obj) { return "completed" in obj; }, get: function (obj) { return obj.completed; }, set: function (obj, value) { obj.completed = value; } } }, _completed_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _blockchainNetwork_decorators, { kind: "field", name: "blockchainNetwork", static: false, private: false, access: { has: function (obj) { return "blockchainNetwork" in obj; }, get: function (obj) { return obj.blockchainNetwork; }, set: function (obj, value) { obj.blockchainNetwork = value; } } }, _blockchainNetwork_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _transactionHash_decorators, { kind: "field", name: "transactionHash", static: false, private: false, access: { has: function (obj) { return "transactionHash" in obj; }, get: function (obj) { return obj.transactionHash; }, set: function (obj, value) { obj.transactionHash = value; } } }, _transactionHash_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _blockchainAddress_decorators, { kind: "field", name: "blockchainAddress", static: false, private: false, access: { has: function (obj) { return "blockchainAddress" in obj; }, get: function (obj) { return obj.blockchainAddress; }, set: function (obj, value) { obj.blockchainAddress = value; } } }, _blockchainAddress_initializers, _instanceExtraInitializers);
        })(),
        _a;
}();
