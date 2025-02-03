import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        jwtToken: string;
    }>;
    signup(body: AuthDto): Promise<{
        jwtToken: string;
    }>;
}
