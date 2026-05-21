# Documentacao da API

API REST do CRM 1000 Valle Multimarcas. A API roda em Node.js/Express com TypeScript nativo, Prisma ORM e PostgreSQL.

## Base URL

Ambiente Docker/dev:

```txt
http://localhost:3001
```

Health check:

```http
GET /health
```

Resposta:

```json
{
  "status": "ok"
}
```

## Autenticacao

Os endpoints protegidos exigem JWT no header:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Perfis usados pelo RBAC:

```txt
ADMIN
GERENTE_GERAL
GERENTE
ATENDENTE
```

Formato padrao de erro:

```json
{
  "message": "Mensagem do erro."
}
```

Erros de validacao Zod:

```json
{
  "message": "Dados invalidos.",
  "issues": {
    "campo": ["Mensagem de validacao."]
  }
}
```

## Auth e Usuarios

### POST /auth/login

Autentica um usuario e retorna token JWT.

Autenticacao: publica.

Body:

```json
{
  "email": "admin@empresa.com",
  "senha": "123456"
}
```

Resposta `200`:

```json
{
  "token": "jwt.token",
  "expiresIn": "8h",
  "user": {
    "id": "clx...",
    "nome": "Administrador",
    "email": "admin@empresa.com",
    "role": "ADMIN",
    "teamId": null
  }
}
```

### GET /auth/me

Retorna o usuario autenticado.

Autenticacao: `ADMIN`, `GERENTE_GERAL`, `GERENTE`, `ATENDENTE`.

Resposta `200`:

```json
{
  "user": {
    "id": "clx...",
    "nome": "Maria",
    "email": "maria@empresa.com",
    "role": "GERENTE",
    "teamId": "clt..."
  }
}
```

### PATCH /auth/me

Atualiza as credenciais do proprio usuario.

Autenticacao: usuario autenticado.

Body:

```json
{
  "email": "novo.email@empresa.com",
  "senhaAtual": "123456",
  "novaSenha": "654321"
}
```

Campos opcionais:

- `email`
- `senhaAtual`
- `novaSenha`

Resposta `200`:

```json
{
  "user": {
    "id": "clx...",
    "nome": "Maria",
    "email": "novo.email@empresa.com",
    "role": "GERENTE",
    "teamId": "clt..."
  }
}
```

### GET /auth/users

Lista usuarios gerenciaveis pelo usuario autenticado.

Autenticacao: `ADMIN`, `GERENTE`.

Regras:

- `ADMIN` lista todos os usuarios.
- `GERENTE` lista apenas atendentes do proprio time.

Resposta `200`:

```json
{
  "users": [
    {
      "id": "clx...",
      "nome": "Atendente 1",
      "email": "atendente@empresa.com",
      "role": "ATENDENTE",
      "teamId": "clt..."
    }
  ]
}
```

### POST /auth/users

Cria um usuario.

Autenticacao: `ADMIN`, `GERENTE`.

Regras:

- `ADMIN` pode criar usuarios de qualquer perfil.
- `GERENTE` pode criar apenas `ATENDENTE` no proprio time.

Body:

```json
{
  "nome": "Atendente 1",
  "email": "atendente@empresa.com",
  "senha": "123456",
  "role": "ATENDENTE",
  "teamId": "clt..."
}
```

Resposta `201`:

```json
{
  "user": {
    "id": "clx...",
    "nome": "Atendente 1",
    "email": "atendente@empresa.com",
    "role": "ATENDENTE",
    "teamId": "clt..."
  }
}
```

### POST /auth/register

Alias de criacao de usuario. Usa a mesma regra e contrato de `POST /auth/users`.

Autenticacao: `ADMIN`, `GERENTE`.

### PUT /auth/users/:id

Atualiza um usuario.

Autenticacao: `ADMIN`, `GERENTE`.

Body:

```json
{
  "nome": "Atendente Atualizado",
  "email": "atendente.novo@empresa.com",
  "senha": "novaSenha123",
  "role": "ATENDENTE",
  "teamId": "clt..."
}
```

Todos os campos sao opcionais.

Resposta `200`:

```json
{
  "user": {
    "id": "clx...",
    "nome": "Atendente Atualizado",
    "email": "atendente.novo@empresa.com",
    "role": "ATENDENTE",
    "teamId": "clt..."
  }
}
```

### DELETE /auth/users/:id

Remove um usuario.

Autenticacao: `ADMIN`, `GERENTE`.

Resposta `204`: sem corpo.

### GET /auth/management

Endpoint simples para validar acesso gerencial.

Autenticacao: `ADMIN`, `GERENTE_GERAL`, `GERENTE`.

Resposta `200`:

```json
{
  "message": "Acesso liberado para area gerencial.",
  "user": {
    "id": "clx...",
    "nome": "Maria",
    "email": "maria@empresa.com",
    "role": "GERENTE",
    "teamId": "clt..."
  }
}
```

## RBAC

### GET /rbac/roles

Lista os perfis cadastrados.

Autenticacao: `ADMIN`, `GERENTE_GERAL`, `GERENTE`.

Resposta `200`:

```json
{
  "roles": [
    {
      "id": "clx...",
      "name": "ADMIN",
      "description": "Administrador"
    }
  ]
}
```

### GET /rbac/permissions

Lista as permissoes cadastradas.

Autenticacao: `ADMIN`.

Resposta `200`:

```json
{
  "permissions": [
    {
      "id": "clx...",
      "name": "ver_dashboard"
    }
  ]
}
```

### GET /rbac/teams

Lista equipes.

Autenticacao: `ADMIN`, `GERENTE_GERAL`, `GERENTE`.

Regras:

- `GERENTE` lista apenas equipes em que ele e gerente.
- `ADMIN` e `GERENTE_GERAL` listam todas.

Resposta `200`:

```json
{
  "teams": [
    {
      "id": "clt...",
      "name": "Equipe A",
      "managerId": "clx..."
    }
  ]
}
```

### POST /rbac/teams

Cria uma equipe.

Autenticacao: `ADMIN`.

Body:

```json
{
  "name": "Equipe A",
  "managerId": "clx..."
}
```

Resposta `201`:

```json
{
  "team": {
    "id": "clt...",
    "name": "Equipe A",
    "managerId": "clx..."
  }
}
```

### PUT /rbac/teams/:id

Atualiza uma equipe.

Autenticacao: `ADMIN`.

Body:

```json
{
  "name": "Equipe B",
  "managerId": "clx..."
}
```

Resposta `200`:

```json
{
  "team": {
    "id": "clt...",
    "name": "Equipe B",
    "managerId": "clx..."
  }
}
```

### DELETE /rbac/teams/:id

Remove uma equipe.

Autenticacao: `ADMIN`.

Resposta `204`: sem corpo.

## Leads

### GET /leads

Lista leads conforme o perfil do usuario autenticado.

Autenticacao: `ADMIN`, `GERENTE_GERAL`, `GERENTE`, `ATENDENTE`.

Regras:

- `ADMIN` e `GERENTE_GERAL` veem todos os leads.
- `GERENTE` ve leads do proprio time.
- `ATENDENTE` ve apenas os proprios leads.

Resposta `200`:

```json
{
  "leads": [
    {
      "id": "cll...",
      "clientName": "Joao Silva",
      "clientPhone": "+55 11 90000-0000",
      "clientEmail": "joao@email.com",
      "subject": "Honda Civic",
      "origin": "whatsapp",
      "importance": "quente",
      "status": "novo",
      "attendantId": "clx...",
      "attendantName": "Atendente 1",
      "createdAt": "2026-05-21T12:00:00.000Z",
      "updatedAt": "2026-05-21T12:00:00.000Z"
    }
  ]
}
```

### POST /leads

Cria um lead para o usuario autenticado.

Autenticacao: `ADMIN`, `GERENTE`, `ATENDENTE`.

Regra: `GERENTE_GERAL` nao pode criar leads diretamente.

Body:

```json
{
  "clientName": "Joao Silva",
  "clientPhone": "+55 11 90000-0000",
  "clientEmail": "joao@email.com",
  "subject": "Honda Civic",
  "origin": "whatsapp",
  "importance": "quente",
  "status": "novo"
}
```

Campos:

- `clientName`: obrigatorio.
- `clientPhone`: opcional.
- `clientEmail`: opcional.
- `subject`: opcional.
- `origin`: obrigatorio.
- `importance`: `frio`, `morno`, `quente`. Padrao: `morno`.
- `status`: opcional. Padrao: `novo`.

Status aceitos:

```txt
novo
em_atendimento
agendado
em_negociacao
convertido
perdido
```

Tambem sao aceitos aliases como `nao atendido`, `em atendimento`, `em negociacao`, `vendido`.

Resposta `201`:

```json
{
  "lead": {
    "id": "cll...",
    "clientName": "Joao Silva",
    "clientPhone": "+55 11 90000-0000",
    "clientEmail": "joao@email.com",
    "subject": "Honda Civic",
    "origin": "whatsapp",
    "importance": "quente",
    "status": "novo",
    "attendantId": "clx...",
    "attendantName": "Atendente 1",
    "createdAt": "2026-05-21T12:00:00.000Z",
    "updatedAt": "2026-05-21T12:00:00.000Z"
  }
}
```

### PATCH /leads/:id

Atualiza dados de um lead.

Autenticacao: usuario autenticado.

Regras:

- `ADMIN` e `GERENTE_GERAL` podem atualizar qualquer lead.
- `GERENTE` pode atualizar leads do proprio time.
- `ATENDENTE` pode atualizar apenas os proprios leads.

Body:

```json
{
  "clientName": "Joao Souza",
  "clientPhone": "+55 11 98888-7777",
  "clientEmail": "joao.souza@email.com",
  "subject": "Toyota Corolla",
  "origin": "instagram",
  "importance": "morno",
  "status": "em_atendimento"
}
```

Todos os campos sao opcionais.

Resposta `200`:

```json
{
  "lead": {
    "id": "cll...",
    "clientName": "Joao Souza",
    "clientPhone": "+55 11 98888-7777",
    "clientEmail": "joao.souza@email.com",
    "subject": "Toyota Corolla",
    "origin": "instagram",
    "importance": "morno",
    "status": "em_atendimento",
    "attendantId": "clx...",
    "attendantName": "Atendente 1",
    "createdAt": "2026-05-21T12:00:00.000Z",
    "updatedAt": "2026-05-21T13:00:00.000Z"
  }
}
```

### PATCH /leads/:id/status

Atualiza apenas o status do lead.

Autenticacao: usuario autenticado.

Body:

```json
{
  "status": "convertido"
}
```

Resposta `200`:

```json
{
  "lead": {
    "id": "cll...",
    "status": "convertido"
  }
}
```

### PATCH /leads/:id/assign

Delega um lead para outro usuario.

Autenticacao: `ADMIN`, `GERENTE_GERAL`, `GERENTE`.

Regras:

- `ATENDENTE` nao pode delegar leads.
- `GERENTE` pode delegar apenas para atendentes do proprio time.
- `GERENTE_GERAL` pode delegar para `GERENTE`, `GERENTE_GERAL` ou `ATENDENTE`.
- `ADMIN` pode delegar para qualquer usuario.

Body:

```json
{
  "attendantId": "clx..."
}
```

Resposta `200`:

```json
{
  "lead": {
    "id": "cll...",
    "attendantId": "clx...",
    "attendantName": "Atendente 2"
  }
}
```

### GET /leads/assignable

Lista usuarios que podem receber leads do usuario autenticado.

Autenticacao: usuario autenticado.

Regras:

- `ATENDENTE` retorna lista vazia.
- `GERENTE` retorna atendentes do proprio time.
- `GERENTE_GERAL` retorna gerentes, gerentes gerais e atendentes, exceto ele mesmo.
- `ADMIN` retorna todos os usuarios, exceto ele mesmo.

Resposta `200`:

```json
{
  "users": [
    {
      "id": "clx...",
      "nome": "Atendente 2",
      "role": "ATENDENTE"
    }
  ]
}
```

## Colaboradores

> Observacao: estes endpoints estao autenticados, mas a regra fina de permissao deve ser alinhada ao RBAC final do projeto.

### GET /collaborators

Lista colaboradores.

Autenticacao: usuario autenticado.

Resposta `200`:

```json
{
  "collaborators": [
    {
      "id": "clx...",
      "name": "Maria",
      "email": "maria@empresa.com",
      "role": "GERENTE",
      "teamId": "clt...",
      "createdAt": "2026-05-21T12:00:00.000Z",
      "updatedAt": "2026-05-21T12:00:00.000Z"
    }
  ]
}
```

### POST /collaborators

Cria colaborador.

Autenticacao: usuario autenticado.

Body:

```json
{
  "name": "Atendente 3",
  "email": "atendente3@empresa.com",
  "password": "123456",
  "role": "ATENDENTE",
  "teamId": "clt..."
}
```

Campos:

- `name`: obrigatorio.
- `email`: obrigatorio.
- `password`: obrigatorio, minimo 6 caracteres.
- `role`: `ADMIN`, `GERENTE_GERAL`, `GERENTE`, `ATENDENTE`. Padrao: `ATENDENTE`.
- `teamId`: opcional.

Resposta `201`:

```json
{
  "collaborator": {
    "id": "clx...",
    "name": "Atendente 3",
    "email": "atendente3@empresa.com",
    "role": "ATENDENTE",
    "teamId": "clt...",
    "createdAt": "2026-05-21T12:00:00.000Z",
    "updatedAt": "2026-05-21T12:00:00.000Z"
  }
}
```

### PATCH /collaborators/:id

Atualiza colaborador.

Autenticacao: usuario autenticado.

Body:

```json
{
  "name": "Atendente Atualizado",
  "role": "ATENDENTE",
  "teamId": "clt..."
}
```

Campos opcionais:

- `name`
- `role`
- `teamId`

Para remover a equipe, envie:

```json
{
  "teamId": null
}
```

Resposta `200`:

```json
{
  "collaborator": {
    "id": "clx...",
    "name": "Atendente Atualizado",
    "email": "atendente3@empresa.com",
    "role": "ATENDENTE",
    "teamId": null,
    "createdAt": "2026-05-21T12:00:00.000Z",
    "updatedAt": "2026-05-21T13:00:00.000Z"
  }
}
```

## Codigos HTTP

| Codigo | Uso |
| --- | --- |
| `200` | Operacao concluida com retorno. |
| `201` | Recurso criado. |
| `204` | Operacao concluida sem corpo de resposta. |
| `400` | Requisicao invalida. |
| `401` | Usuario nao autenticado ou token invalido. |
| `403` | Usuario autenticado sem permissao. |
| `404` | Recurso nao encontrado. |
| `409` | Conflito, como e-mail ja cadastrado. |
| `500` | Erro interno ou configuracao ausente. |

## Observacoes de Implementacao

- O backend usa JWT para autenticacao.
- Senhas sao armazenadas com hash usando bcrypt.
- As regras principais de acesso estao nos services e nos middlewares `authenticate` e `authorize`.
- O Prisma usa o modelo novo de RBAC com `User`, `Role`, `Permission` e `Team`.
- Para usar os endpoints protegidos, primeiro autentique em `POST /auth/login` e envie o token no header `Authorization`.
