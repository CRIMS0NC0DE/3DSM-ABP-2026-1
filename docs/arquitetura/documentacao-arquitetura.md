# Arquitetura do Projeto

Este documento descreve a arquitetura geral do CRM 1000 Valle Multimarcas e a organizacao das pastas do repositorio.

## Visao Geral

O projeto e uma aplicacao web fullstack para gestao comercial de uma concessionaria/multimarcas. O sistema cobre autenticacao, RBAC, equipes, colaboradores, leads, funil de atendimento, dashboards e telas operacionais.

Stack principal:

- Frontend: React, TypeScript, Vite, Tailwind CSS.
- Backend: Node.js, Express, TypeScript executado nativamente com `ts-node`.
- Banco de dados: PostgreSQL.
- ORM: Prisma.
- Infraestrutura local: Docker Compose.

Fluxo macro:

```txt
Usuario no navegador
  -> React/Vite
  -> services/hooks do frontend
  -> API REST Express
  -> services de aplicacao
  -> repositories Prisma
  -> PostgreSQL
```

## Arquitetura em Camadas

### Frontend

O frontend concentra a experiencia do usuario, roteamento, telas, componentes e chamadas HTTP para a API.

Camadas principais:

- `pages`: telas roteaveis, como Dashboard, Leads, Login e Colaboradores.
- `components`: componentes reutilizaveis e componentes de dominio visual.
- `hooks`: regras de consumo de API e estado derivado, como `useLeads` e `usePermissions`.
- `contexts`: estado global de autenticacao e tema.
- `services`: clientes HTTP, mock APIs e integracao com backend.
- `types`: tipos compartilhados do frontend.

O roteamento e definido em `public/src/App.tsx`, usando:

- `ProtectedRoute` para exigir autenticacao.
- `PermissionRoute` para bloquear rotas por permissao/perfil.
- `AuthenticatedLayout` para telas internas com sidebar/navbar.

### Backend

O backend expoe uma API REST. Ele segue uma organizacao em camadas:

- Routes: definem endpoints HTTP e middlewares.
- Controllers: traduzem Request/Response para chamadas de service.
- Services: concentram regras de negocio.
- Repositories: implementam persistencia via Prisma.
- Domain: entidades e contratos abstratos.
- Security: hashing de senha e geracao/verificacao de tokens.
- Middlewares: autenticacao, autorizacao, tratamento de erros e helpers.

Fluxo de uma requisicao protegida:

```txt
Request HTTP
  -> route
  -> authenticate(authService)
  -> authorize/permissoes quando aplicavel
  -> controller
  -> service
  -> repository
  -> Prisma Client
  -> PostgreSQL
  -> response JSON
```

### Banco de Dados

O banco usa Prisma como fonte de modelagem e migracoes. O schema atual esta em:

```txt
server/prisma/schema.prisma
```

Modelos centrais:

- `User`: usuarios do sistema.
- `Role`: perfis RBAC.
- `Permission`: permissoes associadas a roles.
- `Team`: equipes e seus gerentes.
- `Lead`: leads comerciais.
- `Negotiation`: negociacoes derivadas dos leads.
- `NegotiationHistory`: historico de negociacao.
- `AuditLog`: registros de auditoria.

As migrations ficam em:

```txt
server/prisma/migrations
```

## Modulos Funcionais

### Autenticacao

Responsavel por:

- Login.
- Emissao de JWT.
- Recuperacao do usuario autenticado.
- Atualizacao de credenciais proprias.
- Criacao, listagem, atualizacao e remocao de usuarios por perfis autorizados.

Arquivos principais:

- `server/src/routes/authRoutes.ts`
- `server/src/controllers/AuthController.ts`
- `server/src/services/AuthService.ts`
- `server/src/repositories/PrismaUserRepository.ts`
- `server/src/security/token/JwtTokenService.ts`
- `server/src/security/password/BcryptPasswordHasher.ts`

### RBAC, Equipes e Permissoes

Responsavel por perfis, permissoes e equipes.

Arquivos principais:

- `server/src/routes/rbacRoutes.ts`
- `server/src/services/RoleService.ts`
- `server/src/services/PermissionService.ts`
- `server/src/services/TeamService.ts`
- `server/src/repositories/PrismaRoleRepository.ts`
- `server/src/repositories/PrismaPermissionRepository.ts`
- `server/src/repositories/PrismaTeamRepository.ts`

### Colaboradores

Modulo operacional para gerenciar usuarios/colaboradores.

Arquivos principais:

- `server/src/routes/collaboratorRoutes.ts`
- `server/src/controllers/CollaboratorController.ts`
- `server/src/services/CollaboratorService.ts`
- `public/src/pages/CollaboratorsPage.tsx`
- `public/src/components/Collaborators`

### Leads

Modulo de captacao, atendimento, movimentacao, edicao e delegacao de leads.

Arquivos principais:

- `server/src/routes/leadRoutes.ts`
- `server/src/controllers/LeadController.ts`
- `server/src/services/LeadService.ts`
- `server/src/repositories/PrismaLeadRepository.ts`
- `public/src/pages/LeadsPage.tsx`
- `public/src/hooks/useLeads.ts`
- `public/src/components/Lead`

### Dashboards

Dashboards de acompanhamento comercial e gerencial.

Arquivos principais:

- `public/src/pages/Dashboard.tsx`
- `public/src/components/Dashboard`
- `public/src/components/DashboardGerenteLoja`
- `public/src/components/DashboardGerenteGeral`
- `public/src/pages/*Chart.tsx`
- `public/src/pages/useMetrics.ts`

Os dashboards usam dados de leads e graficos com Recharts.

## Organizacao das Pastas

Estrutura geral:

```txt
.
├── docker-compose.dev.yml
├── docs
├── public
└── server
```

### `server`

Backend Node.js/Express.

```txt
server
├── Dockerfile
├── package.json
├── prisma
│   ├── schema.prisma
│   └── migrations
├── prisma.config.ts
├── tsconfig.json
└── src
```

#### `server/src`

```txt
server/src
├── @types
├── config
├── controllers
├── domain
├── errors
├── middlewares
├── repositories
├── routes
├── security
├── services
├── types
├── index.ts
├── seed.ts
└── seed-dashboard.ts
```

Responsabilidades:

- `index.ts`: inicializa Express, CORS, JSON parser, rotas e error handler.
- `config`: configuracoes compartilhadas, como Prisma Client.
- `routes`: agrupamento dos endpoints REST.
- `controllers`: camada HTTP, com leitura de request e escrita de response.
- `services`: regras de negocio e orquestracao de casos de uso.
- `repositories`: implementacoes concretas de persistencia via Prisma.
- `domain/entities`: entidades e tipos centrais do dominio.
- `domain/repositories`: contratos/ports dos repositories.
- `domain/factories`: factories de criacao de entidades/usuarios.
- `middlewares`: autenticacao, autorizacao, RBAC e tratamento assinc.
- `security/password`: interfaces/decorators/hash de senha.
- `security/token`: interfaces/decorators/JWT.
- `errors`: erros de aplicacao, como `AppError`.
- `types` e `@types`: extensoes de tipos Express.
- `seed.ts`: seed de dados base.
- `seed-dashboard.ts`: seed/importacao de dados para dashboard.

### `public`

Frontend React/Vite.

```txt
public
├── Dockerfile
├── package.json
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── src
```

#### `public/src`

```txt
public/src
├── assets
├── components
├── contexts
├── data
├── hooks
├── pages
├── services
├── types
├── App.tsx
├── main.tsx
└── main.css
```

Responsabilidades:

- `main.tsx`: ponto de entrada do React.
- `App.tsx`: declaracao das rotas.
- `main.css`: Tailwind e estilos globais.
- `assets`: imagens e arquivos estaticos importados pelo React.
- `components`: componentes reutilizaveis.
- `contexts`: providers e hooks globais, como autenticacao e tema.
- `hooks`: hooks de regra de tela/integração, como `useLeads`.
- `pages`: paginas roteaveis.
- `services`: cliente HTTP e mocks.
- `types`: tipos TypeScript compartilhados pelo frontend.
- `data`: dados locais auxiliares, como CSVs.

#### `public/src/components`

```txt
components
├── Auth
├── Collaborators
├── Dashboard
├── DashboardGerenteGeral
├── DashboardGerenteLoja
├── Layouts
├── Lead
└── UI
```

Responsabilidades:

- `Auth`: guardas de rota, controle de permissao e card de autenticacao.
- `Collaborators`: modal, switches, pills e tipos de colaboradores.
- `Dashboard`: cards/tabelas compartilhadas de dashboard.
- `DashboardGerenteGeral`: dashboard consolidado.
- `DashboardGerenteLoja`: dashboard de gerente de loja/equipe.
- `Layouts`: layout autenticado, sidebar, navbar e telas de acesso negado.
- `Lead`: cards, formularios, listas, badges e delegacao de leads.
- `UI`: componentes genericos de interface.

### `docs`

Documentacao do projeto.

```txt
docs
├── api-endpoints
├── arquitetura
├── assets
├── execucao
├── modelagem
├── others
├── processo
└── visao-geral
```

Responsabilidades:

- `api-endpoints`: documentacao dos endpoints REST.
- `arquitetura`: este documento de arquitetura.
- `assets`: imagens, PDFs e materiais visuais.
- `execucao`: instrucoes de execucao.
- `modelagem`: diagramas e modelagem de dados.
- `others`: materiais auxiliares.
- `processo`: documentacao de processo, DoD e retrospectivas.
- `visao-geral`: documentacao de visao de produto/projeto.

## Infraestrutura Local

O ambiente de desenvolvimento e definido em:

```txt
docker-compose.dev.yml
```

Servicos:

- `postgres-1000car-multimarcas`: PostgreSQL 17.
- `server.app`: API Node/Express na porta externa `3001`.
- `public-app`: frontend Vite na porta externa `3002`.
- `pgadmin`: interface para administrar PostgreSQL na porta `5050`.

Rede Docker:

```txt
abp-network
```

Volumes:

- `postgres_1000car_data`: dados persistidos do PostgreSQL.
- `pgadmin_data`: dados persistidos do pgAdmin.

## Scripts Importantes

Backend:

```bash
cd server
npm run dev
npm run build
npm run seed
npm run migrate:dev
```

Frontend:

```bash
cd public
npm run dev
npm run build
npm run lint
```

Docker:

```bash
docker compose -f docker-compose.dev.yml up --build -d
docker compose -f docker-compose.dev.yml down
```

## Padroes e Decisoes Arquiteturais

### TypeScript nativo no backend

O backend roda com:

```json
{
  "dev": "ts-node src/index.ts",
  "start": "ts-node src/index.ts",
  "build": "tsc --noEmit"
}
```

Ou seja, o projeto valida TypeScript com `tsc --noEmit`, mas nao compila para JavaScript antes de executar em desenvolvimento.

### Repository Pattern

Os services dependem de contratos de repository no dominio. As implementacoes concretas ficam em `server/src/repositories` e usam Prisma.

Exemplo:

```txt
LeadService
  -> LeadRepository
  -> PrismaLeadRepository
  -> Prisma Client
```

### Service Layer

As regras de negocio devem ficar nos services, nao diretamente em routes/controllers.

Exemplos:

- `AuthService`: regras de login, criacao e gestao de usuarios.
- `LeadService`: regras de visibilidade, criacao, edicao e delegacao de leads.
- `TeamService`: regras de criacao/edicao de equipes.

### Controllers finos

Controllers devem:

- Ler parametros/body.
- Obter usuario autenticado quando necessario.
- Chamar services.
- Responder JSON/status HTTP.

### Middlewares

Principais middlewares:

- `authenticate`: valida JWT e injeta usuario autenticado no request.
- `authorize`: valida se o perfil esta autorizado.
- `asyncHandler`: centraliza captura de erros assinc.
- `errorHandler`: padroniza respostas de erro.
- `rbac`: helpers adicionais de autorizacao por perfil/recurso.

### Frontend por composicao

Telas grandes devem delegar para componentes menores. Regras de consumo de API devem preferencialmente ficar em hooks ou services, evitando fetch direto espalhado em componentes.

Exemplo:

```txt
LeadsPage
  -> useLeads
  -> services/api
  -> backend /leads
```

## Fluxos Principais

### Login

```txt
LoginPage
  -> AuthContext.login
  -> services/api.login
  -> POST /auth/login
  -> AuthService.login
  -> PrismaUserRepository.findByEmail
  -> bcrypt compare
  -> JwtTokenService.generate
```

### Listagem de Leads

```txt
LeadsPage
  -> useLeads
  -> GET /leads
  -> authenticate
  -> LeadController.list
  -> LeadService.listLeads
  -> PrismaLeadRepository
```

### Delegacao de Lead

```txt
LeadsPage
  -> DelegationManager
  -> useLeads.delegateLead
  -> PATCH /leads/:id/assign
  -> LeadService.assignLead
  -> valida perfil/time
  -> PrismaLeadRepository.assign
```

### Controle de Rotas no Frontend

```txt
App.tsx
  -> ProtectedRoute
  -> AuthenticatedLayout
  -> PermissionRoute
  -> Pagina protegida
```

## Observacoes e Riscos Tecnicos

- Ha mais de um arquivo de declaracao para extensao do Express em `server/src/types` e `server/src/@types`. Idealmente, manter uma unica fonte para evitar conflitos de tipos.
- A documentacao de endpoints deve acompanhar `server/src/routes`.
- O schema Prisma e as migrations devem ser tratados como fonte de verdade do banco.
- O frontend usa bibliotecas visuais como Recharts e Heroicons; depois de pulls que adicionem dependencias, rode `npm install` em `public`.
- Antes de abrir PR, validar:

```bash
cd server && npm run build
cd public && npm run lint
cd public && npm run build
```
