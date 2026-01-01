"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("./jwt");
var AuthGuard = /** @class */ (function () {
    function AuthGuard() {
    }
    AuthGuard.prototype.canActivate = function (context) {
        var _a;
        var request = context.switchToHttp().getRequest();
        var authHeader = (_a = request.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!authHeader || typeof authHeader !== 'string') {
            throw new common_1.UnauthorizedException('Missing Authorization header');
        }
        var _b = authHeader.split(' '), scheme = _b[0], token = _b[1];
        if (scheme !== 'Bearer' || !token) {
            throw new common_1.UnauthorizedException('Invalid Authorization header');
        }
        try {
            var payload = (0, jwt_1.verifyAccessToken)(token);
            request.user = payload;
            return true;
        }
        catch (_c) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    };
    AuthGuard = __decorate([
        (0, common_1.Injectable)()
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
