import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    sendMagicLink(email: string): Promise<void>;
    exchangeMagicLink(token: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
}
