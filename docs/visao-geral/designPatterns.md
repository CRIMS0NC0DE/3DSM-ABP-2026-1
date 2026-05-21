# Padrões de Projeto GoF Utilizados

Este documento descreve os padrões de projeto GoF (*Gang of Four*) aplicados no projeto **1000 Valle Multimarcas**, indicando onde aparecem no código, qual problema resolvem e como contribuem para a arquitetura.

## Visão Geral

O projeto utiliza padrões GoF principalmente no backend, onde há maior concentração de regras de negócio, segurança, autenticação e integração com banco de dados.

Padrões GoF identificados no código:

| Padrão GoF | Tipo | Onde é usado |
|---|---|---|
| Singleton | Criacional | Instância única do Prisma Client |
| Factory Method | Criacional | Criação de usuário conforme perfil/RBAC |
| Decorator | Estrutural | Auditoria sobre hash de senha e token JWT |

Além deles, o projeto também usa padrões arquiteturais como Repository Pattern, Service Layer e Controllers finos. Esses padrões são importantes para a organização do sistema, mas não fazem parte oficialmente dos 23 padrões GoF.

---

## 1. Singleton

### Objetivo

Garantir que exista uma única instância compartilhada de um recurso durante a execução da aplicação.

No projeto, o Singleton é usado para centralizar a criação e reutilização do `PrismaClient`, evitando múltiplas conexões desnecessárias com o banco PostgreSQL.

### Localização

Arquivo:

```txt
server/src/config/db.ts
```

### Implementação

O arquivo define uma classe `Database` com:

- atributo estático `instance`;
- construtor privado;
- método estático `getInstance()`;
- exportação de uma instância pronta para uso.

Trecho representativo:

```ts
class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const adapter = new PrismaPg(pool);

      Database.instance = new PrismaClient({
        adapter,
        log: ["query", "error", "warn"],
      });
    }

    return Database.instance;
  }
}

const prisma = Database.getInstance();

export default prisma;
```

### Problema Resolvido

Sem esse padrão, diferentes arquivos poderiam criar múltiplas instâncias do Prisma Client, aumentando o número de conexões abertas e dificultando o controle do ciclo de vida do acesso ao banco.

### Benefícios

- Evita múltiplas conexões desnecessárias.
- Centraliza a configuração do banco.
- Facilita reutilização do Prisma em repositories e services.
- Reduz acoplamento entre módulos e configuração de infraestrutura.

### Uso no Projeto

O `prisma` exportado é usado por repositories e rotas que precisam acessar o banco:

```txt
server/src/repositories/PrismaUserRepository.ts
server/src/repositories/PrismaLeadRepository.ts
server/src/repositories/PrismaTeamRepository.ts
server/src/routes/rbacRoutes.ts
```

---

## 2. Factory Method

### Objetivo

Delegar a criação de objetos para subclasses ou classes especializadas, permitindo escolher a implementação concreta sem espalhar condicionais pelo sistema.

No projeto, o Factory Method é usado para criar entidades de usuário com base no perfil/RBAC.

### Localização

Arquivos:

```txt
server/src/domain/factories/UserFactory.ts
server/src/domain/factories/RoleBasedUserFactory.ts
```

### Implementação

`UserFactory` define o contrato base:

```ts
export abstract class UserFactory {
  abstract canCreate(input: UserCreationInput): boolean;

  create(input: UserCreationInput): User {
    return this.factoryMethod(input);
  }

  protected abstract factoryMethod(input: UserCreationInput): User;
}
```

Cada factory concreta implementa:

- `canCreate`: regra para decidir se aquela factory atende o input.
- `factoryMethod`: criação efetiva do objeto `User`.

Factories concretas:

```txt
ExplicitRoleUserFactory
GeneralManagerUserFactory
ManagerUserFactory
AttendantUserFactory
DefaultUserFactory
```

`RoleBasedUserFactory` escolhe qual factory concreta deve criar o usuário:

```ts
export class RoleBasedUserFactory {
  private readonly factories: UserFactory[];

  constructor(
    factories: UserFactory[] = [
      new ExplicitRoleUserFactory(),
      new GeneralManagerUserFactory(),
      new ManagerUserFactory(),
      new AttendantUserFactory(),
    ],
  ) {
    this.factories = [...factories, new DefaultUserFactory()];
  }

  create(input: UserCreationInput): User {
    const selectedFactory = this.factories.find((factory) => factory.canCreate(input));

    if (!selectedFactory) {
      throw new Error("Nenhum método de criação de usuário foi encontrado para o perfil informado.");
    }

    return selectedFactory.create(input);
  }
}
```

### Problema Resolvido

A criação de usuários depende de informações de perfil, como:

- perfil explícito recebido do banco;
- gerente geral;
- gerente;
- atendente;
- perfil padrão.

Sem uma factory, essa lógica tenderia a ficar espalhada em repositories, services ou controllers. Com Factory Method, a responsabilidade fica centralizada e extensível.

### Benefícios

- Centraliza a criação de usuários por perfil.
- Facilita evolução do RBAC.
- Reduz condicionais espalhadas.
- Permite adicionar novos perfis com menor impacto.
- Mantém services/repositories menos acoplados à lógica de criação.

### Uso no Projeto

O principal consumidor é o repository de usuários:

```txt
server/src/repositories/PrismaUserRepository.ts
```

Fluxo simplificado:

```txt
PrismaUserRepository
  -> RoleBasedUserFactory.create(input)
  -> UserFactory concreta
  -> User
```

### Exemplo de Cenário

Se o usuário possui role explícita `GERENTE`, a `ExplicitRoleUserFactory` cria o objeto de domínio com esse perfil.

Se futuramente houver outro perfil, como `SUPERVISOR`, basta adicionar:

- novo valor no tipo de role;
- nova factory concreta, se necessário;
- nova regra de seleção.

---

## 3. Decorator

### Objetivo

Adicionar comportamento a um objeto sem alterar sua implementação original.

No projeto, o Decorator é usado para adicionar auditoria/logs às operações de:

- hash e comparação de senha;
- geração e validação de tokens JWT.

### Localização

Arquivos relacionados a senha:

```txt
server/src/security/password/PasswordHasher.ts
server/src/security/password/BcryptPasswordHasher.ts
server/src/security/password/PasswordHasherDecorator.ts
server/src/security/password/PasswordHashAuditDecorator.ts
```

Arquivos relacionados a token:

```txt
server/src/security/token/TokenService.ts
server/src/security/token/JwtTokenService.ts
server/src/security/token/TokenServiceDecorator.ts
server/src/security/token/TokenAuditDecorator.ts
```

Instanciação:

```txt
server/src/routes/index.ts
```

### Decorator de Senha

`BcryptPasswordHasher` implementa o comportamento principal:

```ts
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  async compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
```

`PasswordHasherDecorator` encapsula outro `PasswordHasher`:

```ts
export abstract class PasswordHasherDecorator implements PasswordHasher {
  constructor(protected readonly passwordHasher: PasswordHasher) {}

  hash(plainPassword: string): Promise<string> {
    return this.passwordHasher.hash(plainPassword);
  }

  compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return this.passwordHasher.compare(plainPassword, passwordHash);
  }
}
```

`PasswordHashAuditDecorator` adiciona logs:

```ts
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
```

### Decorator de Token

`JwtTokenService` implementa geração e verificação de JWT.

`TokenServiceDecorator` encapsula outro `TokenService`.

`TokenAuditDecorator` adiciona logs de geração e validação:

```ts
export class TokenAuditDecorator extends TokenServiceDecorator {
  generate(input: { userId: string; email: string; role: JwtPayload["role"] }): GeneratedToken {
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
```

### Instanciação no Projeto

Arquivo:

```txt
server/src/routes/index.ts
```

```ts
const passwordHasher = new PasswordHashAuditDecorator(new BcryptPasswordHasher());
const tokenService = new TokenAuditDecorator(new JwtTokenService());
const authService = new AuthService(userRepository, passwordHasher, tokenService);
```

### Problema Resolvido

Auditoria/logs são comportamentos transversais. Sem Decorator, haveria duas alternativas piores:

- misturar logs dentro de `BcryptPasswordHasher` e `JwtTokenService`;
- repetir logs em todos os services que usam senha/token.

Com Decorator, a implementação principal continua focada na sua responsabilidade, e a auditoria é adicionada por composição.

### Benefícios

- Evita alterar classes principais.
- Permite empilhar novos comportamentos no futuro.
- Mantém baixo acoplamento.
- Separa regra principal de comportamento transversal.
- Facilita testes isolados.

### Possíveis Extensões Futuras

O mesmo padrão pode ser usado para:

- métricas de performance;
- envio de logs para serviço externo;
- mascaramento de dados sensíveis;
- auditoria em banco de dados;
- tracing distribuído.

---

## Padrões Arquiteturais Relacionados, Mas Não GoF

O projeto também utiliza padrões importantes que ajudam na organização, mas que não pertencem ao catálogo clássico GoF.

### Repository Pattern

Localização:

```txt
server/src/domain/repositories
server/src/repositories
```

Exemplos:

```txt
UserRepository -> PrismaUserRepository
LeadRepository -> PrismaLeadRepository
RoleRepository -> PrismaRoleRepository
TeamRepository -> PrismaTeamRepository
PermissionRepository -> PrismaPermissionRepository
```

Objetivo:

- Isolar acesso a banco.
- Permitir que services dependam de contratos.
- Evitar Prisma espalhado por regras de negócio.

Apesar de muito usado em arquiteturas corporativas, Repository Pattern não é um padrão GoF.

### Service Layer

Localização:

```txt
server/src/services
```

Exemplos:

```txt
AuthService
LeadService
CollaboratorService
RoleService
TeamService
PermissionService
```

Objetivo:

- Concentrar regras de negócio.
- Evitar controllers com lógica pesada.
- Facilitar testes e manutenção.

Service Layer também não é um padrão GoF.

### Dependency Injection Manual

Localização:

```txt
server/src/routes/index.ts
server/src/routes/leadRoutes.ts
server/src/routes/rbacRoutes.ts
```

Exemplo:

```ts
const userRepository = new PrismaUserRepository();
const passwordHasher = new PasswordHashAuditDecorator(new BcryptPasswordHasher());
const tokenService = new TokenAuditDecorator(new JwtTokenService());
const authService = new AuthService(userRepository, passwordHasher, tokenService);
```

Objetivo:

- Injetar dependências por construtor.
- Reduzir acoplamento.
- Facilitar troca de implementações.

Injeção de dependência é uma técnica arquitetural, não um padrão GoF específico.

---

## Relação dos Padrões com os Requisitos do Projeto

| Necessidade | Padrão Aplicado | Justificativa |
|---|---|---|
| Controlar conexão com banco | Singleton | Mantém uma instância única do Prisma Client |
| Criar usuários por perfil | Factory Method | Encapsula a criação conforme RBAC |
| Adicionar logs sem alterar segurança | Decorator | Acrescenta auditoria em senha e token por composição |
| Isolar banco das regras | Repository Pattern | Contratos e implementações Prisma separadas |
| Centralizar regras de negócio | Service Layer | Services concentram casos de uso |

---

## Conclusão

O projeto aplica padrões GoF em pontos estratégicos do backend:

- **Singleton** para conexão com banco;
- **Factory Method** para criação de usuários por perfil;
- **Decorator** para adicionar auditoria a serviços de segurança.

Esses padrões contribuem para uma arquitetura mais organizada, extensível e aderente à proposta acadêmica do projeto, sem comprometer a simplicidade necessária para evolução contínua do CRM.
