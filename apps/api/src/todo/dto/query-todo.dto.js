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
exports.QueryTodoDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var QueryTodoDto = exports.QueryTodoDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _completed_decorators;
    var _completed_initializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _blockchainNetwork_decorators;
    var _blockchainNetwork_initializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _tag_decorators;
    var _tag_initializers = [];
    var _sortBy_decorators;
    var _sortBy_initializers = [];
    var _sortOrder_decorators;
    var _sortOrder_initializers = [];
    return _a = /** @class */ (function () {
            function QueryTodoDto() {
                this.page = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = __runInitializers(this, _limit_initializers, 10);
                this.completed = __runInitializers(this, _completed_initializers, void 0);
                this.priority = __runInitializers(this, _priority_initializers, void 0);
                this.blockchainNetwork = __runInitializers(this, _blockchainNetwork_initializers, void 0);
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.tag = __runInitializers(this, _tag_initializers, void 0);
                this.sortBy = __runInitializers(this, _sortBy_initializers, 'createdAt');
                this.sortOrder = __runInitializers(this, _sortOrder_initializers, 'desc');
            }
            return QueryTodoDto;
        }()),
        (function () {
            _page_decorators = [(0, swagger_1.ApiProperty)({ description: 'Page number for pagination', example: 1, required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' })];
            _limit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of items per page', example: 10, required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }), (0, class_validator_1.Max)(100, { message: 'Limit must not exceed 100' })];
            _completed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filter by completion status', example: false, required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    if (value === 'true')
                        return true;
                    if (value === 'false')
                        return false;
                    return undefined;
                }), (0, class_validator_1.IsBoolean)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filter by priority level', enum: ['low', 'medium', 'high'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })];
            _blockchainNetwork_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filter by blockchain network', enum: ['solana', 'polkadot', 'polygon'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['solana', 'polkadot', 'polygon'], { message: 'Blockchain network must be solana, polkadot, or polygon' })];
            _search_decorators = [(0, swagger_1.ApiProperty)({ description: 'Search in title and description', example: 'documentation', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return value === null || value === void 0 ? void 0 : value.trim();
                })];
            _tag_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filter by tag', example: 'work', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return value === null || value === void 0 ? void 0 : value.trim();
                })];
            _sortBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sort field', enum: ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'], { message: 'Invalid sort field' })];
            _sortOrder_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sort order', enum: ['asc', 'desc'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['asc', 'desc'], { message: 'Sort order must be asc or desc' })];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } } }, _page_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } } }, _limit_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: function (obj) { return "completed" in obj; }, get: function (obj) { return obj.completed; }, set: function (obj, value) { obj.completed = value; } } }, _completed_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } } }, _priority_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _blockchainNetwork_decorators, { kind: "field", name: "blockchainNetwork", static: false, private: false, access: { has: function (obj) { return "blockchainNetwork" in obj; }, get: function (obj) { return obj.blockchainNetwork; }, set: function (obj, value) { obj.blockchainNetwork = value; } } }, _blockchainNetwork_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } } }, _search_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _tag_decorators, { kind: "field", name: "tag", static: false, private: false, access: { has: function (obj) { return "tag" in obj; }, get: function (obj) { return obj.tag; }, set: function (obj, value) { obj.tag = value; } } }, _tag_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: function (obj) { return "sortBy" in obj; }, get: function (obj) { return obj.sortBy; }, set: function (obj, value) { obj.sortBy = value; } } }, _sortBy_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: function (obj) { return "sortOrder" in obj; }, get: function (obj) { return obj.sortOrder; }, set: function (obj, value) { obj.sortOrder = value; } } }, _sortOrder_initializers, _instanceExtraInitializers);
        })(),
        _a;
}();
