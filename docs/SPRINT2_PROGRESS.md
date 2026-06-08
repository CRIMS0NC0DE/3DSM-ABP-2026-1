# 🚀 Progresso Sprint 2 - Funcionalidade de Arquivamento de Leads

Este documento resume o que foi implementado, como testar e quais são os próximos passos para a conclusão da funcionalidade de arquivamento de leads finalizados ou perdidos.

## 📂 Arquivos para Commitar
Certifique-se de incluir estes arquivos no seu próximo commit:
- `server/prisma/schema.prisma`: Adição do campo `archive` e definição de `statusLead`.
- `server/src/services/LeadService.ts`: Lógica de negócio para atualização em massa (`updateMany`).
- `server/src/services/LeadController.ts`: Controlador para gerenciar as requisições de leads.
- `server/src/services/leadRoutes.ts`: Definição da rota `POST /archive`.
- `server/src/routes/index.ts`: Registro central das rotas de leads.

---

## 🧪 Roteiro de Testes

Para verificar a funcionalidade no novo computador, siga estes passos:

1.  **Configuração do Banco:**
    - Execute `npx prisma studio`.
    - Certifique-se de que existam leads com `statusLead` igual a `"Fechado"` ou `"Perdido"`.
    - O campo `archive` deve estar como `false`.

2.  **Autenticação:**
    - Faça login via `POST /auth/login` (ou use o token se já tiver um).
    - Copie o JWT gerado.

3.  **Execução do Arquivamento:**
    - Envie um `POST` para `http://localhost:3333/leads/archive`.
    - Adicione o Header: `Authorization: Bearer <seu_token>`.
    - **Resultado esperado:** JSON `{ "message": "X leads foram movidos para o arquivo." }`.

4.  **Validação:**
    - Verifique no Prisma Studio se os leads alvo agora possuem `archive: true`.

---

## 🏗️ Sugestões de Arquitetura e Próximos Passos

Para alinhar o projeto com os requisitos da **Sprint 2** (`SP2.txt`):

1.  **Organização de Pastas:** 
    - Mover `LeadController.ts` para `server/src/controllers/`.
    - Mover `leadRoutes.ts` para `server/src/routes/`.
2.  **Uso de Enums:** No `schema.prisma`, transformar `statusLead` em um `enum` (ex: `STATUS_LEAD`) para evitar erros de digitação e padronizar o funil de vendas.
3.  **Segurança (RBAC):** Adicionar o middleware `authorize` na rota de arquivamento para permitir que apenas `ADMINISTRADOR` ou `GERENTE` executem a limpeza do funil.
4.  **Filtro Global:** Ajustar as rotas de listagem (`GET /leads`) para sempre retornar apenas leads onde `archive: false`, separando o funil ativo do histórico.

---

## 💻 Comandos para o Novo Computador

Ao clonar ou baixar o repositório na outra máquina:

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

*Dica: Verifique se o seu `.env` na nova máquina possui a `DATABASE_URL` correta para o Docker.*