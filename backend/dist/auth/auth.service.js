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
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signup(body) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: body.email }
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hash = await argon.hash(body.password);
        const user = await this.prisma.user.create({
            data: {
                email: body.email,
                hash,
                firstName: body.firstName,
                lastName: body.lastName,
            },
        });
        return this.signJwt(user.id, user.email, user.firstName, user.lastName);
    }
    async login(body) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email,
            },
            select: {
                id: true,
                email: true,
                hash: true,
                firstName: true,
                lastName: true,
            },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        const passwordMatches = await argon.verify(user.hash, body.password);
        if (!passwordMatches) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        return this.signJwt(user.id, user.email, user.firstName, user.lastName);
    }
    async signJwt(userId, email, firstName, lastName) {
        const payload = {
            sub: userId,
            email,
            firstName,
            lastName,
        };
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: this.configService.get('JWT_SECRET'),
        });
        return {
            access_token: token,
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