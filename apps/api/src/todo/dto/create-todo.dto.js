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
exports.CreateTodoDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var CreateTodoDto = exports.CreateTodoDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _dueDate_decorators;
    var _dueDate_initializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    return _a = /** @class */ (function () {
            function CreateTodoDto() {
                this.title = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = __runInitializers(this, _description_initializers, void 0);
                this.priority = __runInitializers(this, _priority_initializers, void 0);
                this.dueDate = __runInitializers(this, _dueDate_initializers, void 0);
                this.tags = __runInitializers(this, _tags_initializers, void 0);
            }
            return CreateTodoDto;
        }()),
        (function () {
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo title', example: 'Complete project documentation', minLength: 1, maxLength: 200 }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(1, { message: 'Title must not be empty' }), (0, class_validator_1.MaxLength)(200, { message: 'Title must not exceed 200 characters' }), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return value === null || value === void 0 ? void 0 : value.trim();
                })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo description', example: 'Write comprehensive documentation for the todo application', required: false, maxLength: 1000 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000, { message: 'Description must not exceed 1000 characters' }), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return value === null || value === void 0 ? void 0 : value.trim();
                })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo priority level', enum: ['low', 'medium', 'high'], example: 'medium', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo due date', example: '2024-01-15T00:00:00.000Z', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)({}, { message: 'Due date must be a valid ISO date string' })];
            _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Todo tags', example: ['work', 'documentation'], type: [String], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_transformer_1.Transform)(function (_a) {
                    var value = _a.value;
                    return Array.isArray(value) ? value.map(function (tag) { return tag === null || tag === void 0 ? void 0 : tag.trim(); }).filter(Boolean) : [];
                })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } } }, _description_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } } }, _priority_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: function (obj) { return "dueDate" in obj; }, get: function (obj) { return obj.dueDate; }, set: function (obj, value) { obj.dueDate = value; } } }, _dueDate_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } } }, _tags_initializers, _instanceExtraInitializers);
        })(),
        _a;
}();
