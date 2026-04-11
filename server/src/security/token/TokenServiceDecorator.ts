import type { GeneratedToken, JwtPayload, TokenService } from "./TokenService";

export abstract class TokenServiceDecorator implements TokenService {
  constructor(protected readonly tokenService: TokenService) {}

  generate(input: { userId: number; email: string; role: JwtPayload["role"] }): GeneratedToken {
    return this.tokenService.generate(input);
  }

  verify(token: string): JwtPayload {
    return this.tokenService.verify(token);
  }
}

