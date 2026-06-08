# 🔄 Sprint Retrospective — Sprint 1

> Projeto: **1000 Valle Multimarcas**  
> Sprint: **Sprint 1**  
> Período: **24/03 a 14/04**  
> Foco da Sprint: **Fundação do Projeto, Autenticação e Configuração de Ambiente**

---

# 📌 Objetivo da Sprint

Estabelecer a estrutura inicial do sistema, incluindo ambiente de desenvolvimento com Docker, configuração do banco de dados, autenticação JWT, organização arquitetural em camadas e criação da interface base do frontend.

---

# ✅ O que foi concluído

## Infraestrutura e Setup (RP02)
- [x] Criação do arquivo `docker-compose.yml`
- [x] Configuração dos serviços:
  - PostgreSQL
  - Backend Node.js
  - Frontend React
- [x] Configuração das variáveis de ambiente (`.env`)
- [x] Inicialização do repositório Git
- [x] Criação do README estruturado
- [x] Definição da política de branches

---

## Banco de Dados (RP03)
- [x] Criação das tabelas:
  - `users`
  - `roles`
  - `teams/stores`
- [x] Implementação dos scripts DDL iniciais
- [x] Inserção dos perfis padrões via DML
- [x] Criação de usuário administrador para testes

---

## Backend — Camadas e Autenticação
- [x] Estruturação em camadas:
  - Controller
  - Service
  - Repository
  - Domain
- [x] Criação das entidades TypeScript
- [x] Implementação do Repository de usuários
- [x] Implementação da autenticação JWT
- [x] Validação de senha utilizando bcrypt
- [x] Endpoint `POST /auth/login` funcional

---

## Frontend — Interface Base
- [x] Criação da tela de login responsiva
- [x] Integração do frontend com a API
- [x] Implementação do contexto global de autenticação
- [x] Armazenamento do token JWT
- [x] Implementação de rotas privadas

---

## Padrões de Projeto (GoF)
- [x] Aplicação do padrão Singleton na conexão com PostgreSQL
- [x] Estrutura inicial preparada para Factory Method

---

# 🟢 O que funcionou bem

- Boa separação arquitetural em camadas
- Docker facilitou a padronização do ambiente
- Integração entre frontend e backend ocorreu sem grandes problemas
- Organização do projeto melhorou a divisão das tarefas da equipe
- JWT e RBAC funcionaram corretamente na estrutura inicial

---

# 🔴 Problemas encontrados

- Dificuldade inicial na configuração do Docker Compose
- Conflitos de dependências entre pacotes do frontend
- Ajustes necessários na conexão do backend com PostgreSQL
- Curva de aprendizado na implementação do RBAC

---

# 💡 Melhorias para a próxima Sprint

- Implementar testes automatizados
- Melhorar padronização dos commits
- Refinar documentação técnica
- Melhorar tratamento de erros da API

---

# 📊 Metas de Entrega (DoD)

| Meta | Status |
|---|---|
| Sistema executando via Docker Compose | ✅ |
| Login com JWT funcional | ✅ |
| Senhas protegidas com bcrypt | ✅ |
| Estrutura inicial do banco criada | ✅ |
| Organização em camadas implementada | ✅ |
| Tela de login funcional | ✅ |
| Aplicação de padrão GoF | ✅ |
| Repositório GitHub estruturado | ✅ |

---

# 🧠 Lições Aprendidas

- Importância da arquitetura organizada desde o início do projeto
- Benefícios do Docker para padronização de ambiente
- Melhor compreensão sobre autenticação JWT
- Necessidade de definir padrões de código logo nas primeiras sprints
- Separação em camadas facilita manutenção e escalabilidade

---

# 📝 Observações Finais

A Sprint 1 foi responsável por estabelecer toda a fundação arquitetural do projeto. A equipe conseguiu concluir os principais objetivos relacionados à infraestrutura, autenticação e estrutura inicial da aplicação, criando uma base sólida para o desenvolvimento das próximas funcionalidades do sistema.
