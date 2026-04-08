import { PasswordHasherDecorator } from "./PasswordHasherDecorator";

export class PasswordHashAuditDecorator extends PasswordHasherDecorator {
  async hash(plainPassword: string): Promise<string> {
    const passwordHash = await super.hash(plainPassword);

    console.info(`[auth][hash] senha transformada em hash com tamanho=${plainPassword.length}`);

    return passwordHash;
  }

  async compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    const isMatch = await super.compare(plainPassword, passwordHash);

    console.info(`[auth][hash] comparacao de senha executada resultado=${isMatch}`);

    return isMatch;
  }
}

