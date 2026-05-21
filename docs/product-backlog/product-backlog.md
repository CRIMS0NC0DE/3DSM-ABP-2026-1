# 📋 Documentação do Product Backlog

Este repositório contém a organização e o mapeamento do backlog do produto, estruturado em **Épicos (Epics)** e **Histórias de Usuário (User Stories)** para garantir o rastreamento, evolução e entrega contínua da plataforma.

A estrutura foi planejada seguindo boas práticas de metodologias ágeis (Scrum/Kanban), priorização por impacto e arquitetura de software em camadas.

---

## 🗺️ Visão Geral do Backlog

O projeto está dividido em três grandes pilares estratégicos (Épicos):
1. **[CRC0-27] Fundação do Projeto, Autenticação e Setup de Ambiente** `(100% Concluído)`
2. **[CRC0-31] Gestão Operacional de Leads e Controle de Negociações** `(100% Concluído)`
3. **[CRC0-70] Inteligência Analítica, Auditoria e Documentação Final** `(25% Concluído)`

---

## 💎 Detalhamento dos Épicos e Histórias

### 🚀 [ÉPICO] Fundação do Projeto, Autenticação e Setup de Ambiente
* **Identificador:** `CRC0-27`
* **Status:** 🟢 **Concluído (100%)**
* **Descrição:** Estabelecer a infraestrutura base (Docker), o banco de dados inicial e o fluxo de segurança (Login/JWT) seguindo a arquitetura em camadas.

| ID | Trabalho / História (Story) | Prioridade | Responsável | Estado |
| :--- | :--- | :---: | :---: | :---: |
| `CRC0-30` | `[STORY]` Interface de Login e Proteção de Rotas (Frontend) | Média | U | 🟢 CONCLUÍDO |
| `CRC0-47` | `[STORY]` Aplicação de Padrões de Projeto e Documentação | Média | U | 🟢 CONCLUÍDO |
| `CRC0-29` | `[STORY]` Implementação de Login e Controle de Acesso JWT | Média | DM | 🟢 CONCLUÍDO |
| `CRC0-91` | `[STORY]` Criação de protótipo no FIGMA para desenvolvimento da plataforma | Média | TN | 🟢 CONCLUÍDO |
| `CRC0-97` | `[STORY]` Definição da estrutura de Páginas da Aplicação | Média | VP | 🟢 CONCLUÍDO |
| `CRC0-28` | `[STORY]` Configuração de Ambiente Docker e Estrutura de Dados | Média | MB | 🟢 CONCLUÍDO |
| `CRC0-104`| `[STORY]` Interface de Fluxo de Leads (Frontend) | Média | TN | 🟢 CONCLUÍDO |

---

### 💼 [ÉPICO] Gestão Operacional de Leads e Controle de Negociações
* **Identificador:** `CRC0-31`
* **Status:** 🟢 **Concluído (100%)**
* **Descrição:** Centralização e controle do funil de vendas, evolução de estágios das propostas e isolamento de segurança por perfil.

| ID | Trabalho / História (Story) | Prioridade | Responsável | Estado |
| :--- | :--- | :---: | :---: | :---: |
| `CRC0-61` | `[STORY]` Gestão de Estágios, Status e Importância da Negociação | Média | TN | 🟢 CONCLUÍDO |
| `CRC0-105`| `[STORY]` Fazer as Alterações no Frontend de Acordo com as Especificações passadas na Sprint Review 1 | Média | TN | 🟢 CONCLUÍDO |
| `CRC0-51` | `[STORY]` Cadastro e Gerenciamento de Leads e Clientes vinculados | Média | U | 🟢 CONCLUÍDO |
| `CRC0-56` | `[STORY]` Controle de Acesso e Isolamento de Dados por Perfil | Média | DM | 🟢 CONCLUÍDO |
| `CRC0-66` | `[STORY]` Painel Operacional e Implementação de Padrões de Projeto | Média | MB | 🟢 CONCLUÍDO |

---

### 📊 [ÉPICO] Inteligência Analítica, Auditoria e Documentação Final
* **Identificador:** `CRC0-70`
* **Status:** 🟡 **Em Progresso (25%)**
* **Descrição:** Implementação de dashboards analíticos, sistema de logs para conformidade e consolidação da documentação técnica e arquitetural.

| ID | Trabalho / História (Story) | Prioridade | Responsável | Estado |
| :--- | :--- | :---: | :---: | :---: |
| `CRC0-85` | `[STORY]` Consolidação de Artefatos UML e Documentação Arquitetural | Média | PR | 🟢 CONCLUÍDO |
| `CRC0-71` | `[STORY]` Implementação de Indicadores de Conversão e Desempenho | Média | U | ⚪ A FAZER |
| `CRC0-76` | `[STORY]` Filtros de Período Customizado com Trava de Segurança | Média | U | ⚪ A FAZER |
| `CRC0-81` | `[STORY]` Registro e Visualização de Logs de Operações | Média | U | ⚪ A FAZER |

---

## 🛠️ Legenda e Atribuições de Código
* **Prioridades:** `M` = Média.
* **Estados:**
  * 🟢 `CONCLUÍDO`: Item validado e integrado à branch principal.
  * ⚪ `A FAZER`: Item mapeado e refinado no backlog pronto para entrar na próxima Sprint.
