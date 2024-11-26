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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const library_1 = require("@prisma/client/runtime/library");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    getHello() {
        return 'Hello World!';
    }
    async signup(body) {
        const hash = await argon.hash(body.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: body.email,
                    password: hash,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    monthlyExpenses: {
                        create: body.monthlyExpenses?.map((expense) => ({
                            type: expense.name,
                            amount: expense.amount,
                        })) || [],
                    },
                    months: {
                        create: [],
                    },
                    expectedDatePaycheck: body.dateOfPaycheck,
                    defaultBudget: {
                        create: {
                            budgetItems: {
                                create: [],
                            },
                        },
                    },
                },
                include: {
                    monthlyExpenses: true,
                    months: true,
                    defaultBudget: {
                        include: {
                            budgetItems: true,
                        },
                    },
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException(`Email ${body.email} already exists`);
                }
            }
            throw error;
        }
    }
    async login(body) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: body.email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    firstName: true,
                    lastName: true,
                },
            });
            if (!user) {
                throw new common_1.ForbiddenException(`Email ${body.email} does not exist`);
            }
            const passwordMatches = await argon.verify(user.password, body.password);
            if (!passwordMatches) {
                throw new common_1.ForbiddenException('Password is incorrect');
            }
            return this.signJwt(user.id, user.email, user.firstName, user.lastName);
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2021') {
                    throw new common_1.ForbiddenException('User not found');
                }
            }
            throw error;
        }
    }
    signJwt(userId, email, firstName, lastName) {
        const payload = {
            sub: userId,
            email: email,
            firstName: firstName,
            lastName: lastName,
        };
        return {
            jwtToken: this.jwtService.sign(payload, {
                expiresIn: '1d',
                secret: this.configService.get('JWT_SECRET'),
            }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map