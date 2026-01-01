export type UserRole = 'customer' | 'driver' | 'ops';
export type AccessTokenPayload = {
    sub: string;
    role: UserRole;
};
type MagicLinkPayload = {
    email: string;
    type: 'magic';
};
export declare const issueAccessToken: (payload: AccessTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => AccessTokenPayload;
export declare const issueMagicLinkToken: (email: string) => string;
export declare const verifyMagicLinkToken: (token: string) => MagicLinkPayload;
export {};
