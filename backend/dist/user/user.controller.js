"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(service) {
        this.service = service;
    }
    getUserBudgeting(user) {
        return this.service.getUserInfo(user.id);
    }
    async AddExpenses(user) {
        return this.service.addExpenses(user.id);
    }
    async DeleteUser(user) {
        return this.service.deleteUser(user.id);
    }
    async UpdateInformation(user, body) {
        return this.service.updateInformation(user.id, body);
    }
    async UpdateSettings(user, body) {
        if (body.newItems) {
            await this.service.updateBudget(user.id, body.newItems);
        }
        if (body.expectedDatePaycheck) {
            await this.service.updatePaycheck(user.id, body.expectedDatePaycheck);
        }
        const updatedUser = await this.service.getSettings(user.id);
        return {
            items: updatedUser.defaultBudget,
            paycheck: updatedUser.expectedDatePaycheck,
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_2.Get)('me'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserBudgeting", null);
__decorate([
    (0, common_2.Post)('expense'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "AddExpenses", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "DeleteUser", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UpdateInformation", null);
__decorate([
    (0, common_1.Put)('settings'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UpdateSettings", null);
exports.UserController = UserController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map