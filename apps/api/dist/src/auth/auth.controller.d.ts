import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import type { AccessTokenPayload } from './jwt';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    magicLink(body: unknown): Promise<void>;
    callback(token?: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
}
export declare class MeController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    me(user?: AccessTokenPayload): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    } | {
        id: string;
        email: null;
        role: import("./jwt").UserRole;
    }>;
}
