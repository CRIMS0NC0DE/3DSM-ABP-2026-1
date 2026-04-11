import jwt, { type SignOptions } from "jsonwebtoken";

import { AppError } from "../../errors/AppError";
import type { GeneratedToken, JwtPayload, TokenService } from "./TokenService";

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export class JwtTokenService implements TokenService {
  generate(input: { userId: number; email: string; role: JwtPayload["role"] }): GeneratedToken {
    const expiresIn = this.getJwtExpiresIn();
    const token = jwt.sign(
      {
        email: input.email,
        role: input.role,
      },
      this.getJwtSecret(),
      {
        subject: String(input.userId),
        expiresIn,
      },
    );

    return {
      token,
      expiresIn: String(expiresIn),
    };
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, this.getJwtSecret()) as JwtPayload;
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT_SECRET nao configurado no ambiente.", 500);
    }

    return secret;
  }

  private getJwtExpiresIn(): JwtExpiresIn {
    return (process.env.JWT_EXPIRES_IN || "8h") as JwtExpiresIn;
  }
}

