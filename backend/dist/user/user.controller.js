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
    async Home(user) {
        const foundUser = await this.service.getUserById(user.id);
        if (foundUser) {
            return foundUser;
        }
        else {
            return { message: 'User not found' };
        }
    }
    getUserBudgeting(user) {
        return this.service.getUserInfo(user.id);
    }
    FindUser(user) {
        return this.service.getUserById(user.id);
    }
    async AddExpenses(user) {
        this.service.addExpenses(user.id);
    }
    async DeleteUser(user) {
        this.service.deleteUser(user.id);
    }
    async UpdateBudget(user, newItems) {
        return this.service.updateBudget(user.id, newItems);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_2.Get)('home'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Home", null);
__decorate([
    (0, common_2.Get)('get-user-info'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserBudgeting", null);
__decorate([
    (0, common_2.Get)('find-user'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "FindUser", null);
__decorate([
    (0, common_2.Post)('add-expenses'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "AddExpenses", null);
__decorate([
    (0, common_1.Delete)('delete-user'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "DeleteUser", null);
__decorate([
    (0, common_1.Put)('update-budget'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UpdateBudget", null);
exports.UserController = UserController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map