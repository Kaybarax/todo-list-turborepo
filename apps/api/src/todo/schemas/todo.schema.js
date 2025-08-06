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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoSchema = exports.Todo = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var swagger_1 = require("@nestjs/swagger");
var Todo = exports.Todo = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _completed_decorators;
    var _completed_initializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _dueDate_decorators;
    var _dueDate_initializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _blockchainNetwork_decorators;
    var _blockchainNetwork_initializers = [];
    var _transactionHash_decorators;
    var _transactionHash_initializers = [];
    var _blockchainAddress_decorators;
    var _blockchainAddress_initializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var Todo = _classThis = /** @class */ (function () {
        function Todo_1() {
            this.title = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = __runInitializers(this, _description_initializers, void 0);
            this.completed = __runInitializers(this, _completed_initializers, void 0);
            this.priority = __runInitializers(this, _priority_initializers, void 0);
            this.dueDate = __runInitializers(this, _dueDate_initializers, void 0);
            this.tags = __runInitializers(this, _tags_initializers, void 0);
            this.userId = __runInitializers(this, _userId_initializers, void 0);
            this.blockchainNetwork = __runInitializers(this, _blockchainNetwork_initializers, void 0);
            this.transactionHash = __runInitializers(this, _transactionHash_initializers, void 0);
            this.blockchainAddress = __runInitializers(this, _blockchainAddress_initializers, void 0);
            this.createdAt = __runInitializers(this, _createdAt_initializers, void 0);
            this.updatedAt = __runInitializers(this, _updatedAt_initializers, void 0);
        }
        return Todo_1;
    }());
    __setFunctionName(_classThis, "Todo");
    (function () {
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo title', example: 'Complete project documentation' }), (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 200 })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo description', example: 'Write comprehensive documentation for the todo application', required: false }), (0, mongoose_1.Prop)({ trim: true, maxlength: 1000 })];
        _completed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo completion status', example: false }), (0, mongoose_1.Prop)({ default: false })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo priority level', enum: ['low', 'medium', 'high'], example: 'medium' }), (0, mongoose_1.Prop)({ enum: ['low', 'medium', 'high'], default: 'medium' })];
        _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo due date', example: '2024-01-15T00:00:00.000Z', required: false }), (0, mongoose_1.Prop)({ type: Date })];
        _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo tags', example: ['work', 'documentation'], type: [String] }), (0, mongoose_1.Prop)({ type: [String], default: [] })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID who owns this todo', example: 'user123' }), (0, mongoose_1.Prop)({ required: true })];
        _blockchainNetwork_decorators = [(0, swagger_1.ApiProperty)({ description: 'Blockchain network where todo is stored', enum: ['solana', 'polkadot', 'polygon'], required: false }), (0, mongoose_1.Prop)({ enum: ['solana', 'polkadot', 'polygon'] })];
        _transactionHash_decorators = [(0, swagger_1.ApiProperty)({ description: 'Blockchain transaction hash', example: '0x1234567890abcdef', required: false }), (0, mongoose_1.Prop)()];
        _blockchainAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Blockchain address', example: 'solana-address-123', required: false }), (0, mongoose_1.Prop)()];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } } }, _description_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: function (obj) { return "completed" in obj; }, get: function (obj) { return obj.completed; }, set: function (obj, value) { obj.completed = value; } } }, _completed_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } } }, _priority_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: function (obj) { return "dueDate" in obj; }, get: function (obj) { return obj.dueDate; }, set: function (obj, value) { obj.dueDate = value; } } }, _dueDate_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } } }, _tags_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } } }, _userId_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _blockchainNetwork_decorators, { kind: "field", name: "blockchainNetwork", static: false, private: false, access: { has: function (obj) { return "blockchainNetwork" in obj; }, get: function (obj) { return obj.blockchainNetwork; }, set: function (obj, value) { obj.blockchainNetwork = value; } } }, _blockchainNetwork_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _transactionHash_decorators, { kind: "field", name: "transactionHash", static: false, private: false, access: { has: function (obj) { return "transactionHash" in obj; }, get: function (obj) { return obj.transactionHash; }, set: function (obj, value) { obj.transactionHash = value; } } }, _transactionHash_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _blockchainAddress_decorators, { kind: "field", name: "blockchainAddress", static: false, private: false, access: { has: function (obj) { return "blockchainAddress" in obj; }, get: function (obj) { return obj.blockchainAddress; }, set: function (obj, value) { obj.blockchainAddress = value; } } }, _blockchainAddress_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } } }, _createdAt_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } } }, _updatedAt_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        Todo = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Todo = _classThis;
}();
exports.TodoSchema = mongoose_1.SchemaFactory.createForClass(Todo);
// Add indexes for better query performance
exports.TodoSchema.index({ userId: 1, createdAt: -1 });
exports.TodoSchema.index({ userId: 1, completed: 1 });
exports.TodoSchema.index({ userId: 1, priority: 1 });
exports.TodoSchema.index({ userId: 1, dueDate: 1 });
exports.TodoSchema.index({ userId: 1, tags: 1 });
