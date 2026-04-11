import type { GeneratedToken, JwtPayload } from "./TokenService";
import { TokenServiceDecorator } from "./TokenServiceDecorator";

export class TokenAuditDecorator extends TokenServiceDecorator {
  generate(input: { userId: number; email: string; role: JwtPayload["role"] }): GeneratedToken {
    const generatedToken = super.generate(input);

    console.info(`[auth][jwt] token gerado para userId=${input.userId} role=${input.role}`);

    return generatedToken;
  }

  verify(token: string): JwtPayload {
    const payload = super.verify(token);

    console.info(`[auth][jwt] token validado para sub=${payload.sub} role=${payload.role}`);

    return payload;
  }
}

